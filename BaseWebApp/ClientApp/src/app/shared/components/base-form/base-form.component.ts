import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-base-form-component',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  hasInvalidFields(formGroup: FormGroup): boolean {
    for (const field of Object.keys(formGroup.controls)) {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.disabled && control.invalid) {
          return true;
        }
      } else if (control instanceof FormGroup) {
        return this.hasInvalidFields(control);
      }
    }
    return false;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  dictToMultiOptions(value: Array<{ key: string, value: string }>): Array<{ id: string, itemName: string }> {
    return value.map(x => {
      const r = { id: x.key, itemName: x.value };
      return r;
    });
  }

  setRequired(control: AbstractControl, isRequired: boolean) {
    if (isRequired) {
      control.setValidators([Validators.required]);
    } else {
      control.setValidators([]);
    }

    control.updateValueAndValidity();
  }
}
