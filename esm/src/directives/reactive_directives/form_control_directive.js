/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, Input, Optional, Output, Self, forwardRef } from '@angular/core';
import { EventEmitter } from '../../facade/async';
import { StringMapWrapper } from '../../facade/collection';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { NG_VALUE_ACCESSOR } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { ReactiveErrors } from '../reactive_errors';
import { composeAsyncValidators, composeValidators, isPropertyUpdated, selectValueAccessor, setUpControl } from '../shared';
export const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlDirective)
};
export class FormControlDirective extends NgControl {
    constructor(_validators, _asyncValidators, valueAccessors) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.update = new EventEmitter();
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    set isDisabled(isDisabled) { ReactiveErrors.disabledAttrWarning(); }
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            setUpControl(this.form, this);
            if (this.control.disabled)
                this.valueAccessor.setDisabledState(true);
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    }
    get path() { return []; }
    get validator() { return composeValidators(this._validators); }
    get asyncValidator() {
        return composeAsyncValidators(this._asyncValidators);
    }
    get control() { return this.form; }
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _isControlChanged(changes) {
        return StringMapWrapper.contains(changes, 'form');
    }
}
/** @nocollapse */
FormControlDirective.decorators = [
    { type: Directive, args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' },] },
];
/** @nocollapse */
FormControlDirective.ctorParameters = [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] },] },
];
/** @nocollapse */
FormControlDirective.propDecorators = {
    'form': [{ type: Input, args: ['formControl',] },],
    'model': [{ type: Input, args: ['ngModel',] },],
    'update': [{ type: Output, args: ['ngModelChange',] },],
    'isDisabled': [{ type: Input, args: ['disabled',] },],
};
//# sourceMappingURL=form_control_directive.js.map