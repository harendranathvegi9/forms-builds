/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var core_1 = require('@angular/core');
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var validators_1 = require('../validators');
var checkbox_value_accessor_1 = require('./checkbox_value_accessor');
var default_value_accessor_1 = require('./default_value_accessor');
var normalize_validator_1 = require('./normalize_validator');
var number_value_accessor_1 = require('./number_value_accessor');
var radio_control_value_accessor_1 = require('./radio_control_value_accessor');
var select_control_value_accessor_1 = require('./select_control_value_accessor');
var select_multiple_control_value_accessor_1 = require('./select_multiple_control_value_accessor');
function controlPath(name, parent) {
    var p = collection_1.ListWrapper.clone(parent.path);
    p.push(name);
    return p;
}
exports.controlPath = controlPath;
function setUpControl(control, dir) {
    if (lang_1.isBlank(control))
        _throwError(dir, 'Cannot find control with');
    if (lang_1.isBlank(dir.valueAccessor))
        _throwError(dir, 'No value accessor for form control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    // view -> model
    dir.valueAccessor.registerOnChange(function (newValue) {
        dir.viewToModelUpdate(newValue);
        control.markAsDirty();
        control.setValue(newValue, { emitModelToViewChange: false });
    });
    control.registerOnChange(function (newValue, emitModelEvent) {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
    if (dir.valueAccessor.setDisabledState) {
        control.registerOnDisabledChange(function (isDisabled) { dir.valueAccessor.setDisabledState(isDisabled); });
    }
    // touched
    dir.valueAccessor.registerOnTouched(function () { return control.markAsTouched(); });
}
exports.setUpControl = setUpControl;
function setUpFormContainer(control, dir) {
    if (lang_1.isBlank(control))
        _throwError(dir, 'Cannot find control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
exports.setUpFormContainer = setUpFormContainer;
function _throwError(dir, message) {
    var messageEnd;
    if (dir.path.length > 1) {
        messageEnd = "path: '" + dir.path.join(' -> ') + "'";
    }
    else if (dir.path[0]) {
        messageEnd = "name: '" + dir.path + "'";
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new core_1.BaseException(message + " " + messageEnd);
}
function composeValidators(validators) {
    return lang_1.isPresent(validators) ? validators_1.Validators.compose(validators.map(normalize_validator_1.normalizeValidator)) : null;
}
exports.composeValidators = composeValidators;
function composeAsyncValidators(validators) {
    return lang_1.isPresent(validators) ? validators_1.Validators.composeAsync(validators.map(normalize_validator_1.normalizeAsyncValidator)) :
        null;
}
exports.composeAsyncValidators = composeAsyncValidators;
function isPropertyUpdated(changes, viewModel) {
    if (!collection_1.StringMapWrapper.contains(changes, 'model'))
        return false;
    var change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !lang_1.looseIdentical(viewModel, change.currentValue);
}
exports.isPropertyUpdated = isPropertyUpdated;
function isBuiltInAccessor(valueAccessor) {
    return (lang_1.hasConstructor(valueAccessor, checkbox_value_accessor_1.CheckboxControlValueAccessor) ||
        lang_1.hasConstructor(valueAccessor, number_value_accessor_1.NumberValueAccessor) ||
        lang_1.hasConstructor(valueAccessor, select_control_value_accessor_1.SelectControlValueAccessor) ||
        lang_1.hasConstructor(valueAccessor, select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor) ||
        lang_1.hasConstructor(valueAccessor, radio_control_value_accessor_1.RadioControlValueAccessor));
}
exports.isBuiltInAccessor = isBuiltInAccessor;
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (lang_1.isBlank(valueAccessors))
        return null;
    var defaultAccessor;
    var builtinAccessor;
    var customAccessor;
    valueAccessors.forEach(function (v) {
        if (lang_1.hasConstructor(v, default_value_accessor_1.DefaultValueAccessor)) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (lang_1.isPresent(builtinAccessor))
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (lang_1.isPresent(customAccessor))
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (lang_1.isPresent(customAccessor))
        return customAccessor;
    if (lang_1.isPresent(builtinAccessor))
        return builtinAccessor;
    if (lang_1.isPresent(defaultAccessor))
        return defaultAccessor;
    _throwError(dir, 'No valid value accessor for form control with');
    return null;
}
exports.selectValueAccessor = selectValueAccessor;
//# sourceMappingURL=shared.js.map