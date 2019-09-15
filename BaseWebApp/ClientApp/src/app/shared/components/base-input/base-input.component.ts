import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { UtilityService } from '@app/core';

@Component({
  selector: 'app-base-input,[app-base-input]',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss']
})
export class BaseInputComponent implements OnInit {

  @Input() public id: string;
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public group: FormGroup;
  @Input() public type = 'textbox';
  @Input() public colCss = 'col-sm-12';
  @Input() public formValidate = false;
  @Input() public options: Array<{ key: string, value: string }> = [];
  @Input() public multioptions: Array<{ id: string, itemName: string }> = [];

  @Input() public icon = '';
  @Input() public align = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  dropdownSettings = {
    singleSelection: false,
    text: this.placeholder,
    selectAllText: 'Todos',
    unSelectAllText: 'Ninguno',
    enableSearchFilter: false,
    enableCheckAll : false
  };

  es: any;
  constructor(private _us: UtilityService) { }

  ngOnInit() {
    this.es = this._us.calendarSpanish;
  }

  selectSettings() {
    return {
      singleSelection: false,
      text: this.placeholder,
      selectAllText: 'Todos',
      unSelectAllText: 'Ninguno',
      enableSearchFilter: false,
      enableCheckAll : false
    };
  }

  inputType(): string {
    if (this.type === 'password') {
      return 'password';
    }

    if (this.type === 'number' || this.type === 'decimal') {
      return 'number';
    }

    return 'text';
  }

  showStep(): any {
    if (this.type === 'decimal') {
      return '.01';
    }
  }

  isFieldTouched(field: string) {
    if (!this.group) {
      return true;
    }
    if (this.formValidate && this.group.touched) {
      return true;
    }
    return this.group.get(field).touched;
  }

  isFieldValid(field: string) {
    if (!this.group) {
      return false;
    }
    if (this.formValidate && !this.group.valid && this.group.touched) {
      return false;
    }
    return this.group.get(field).valid && this.group.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': !this.isFieldValid(field) && this.isFieldTouched(field),
      'has-feedback': this.isFieldValid(field) && this.isFieldTouched(field)
    };
  }

  errorMessage(fieldId: string) {
    if (!this.group) {
      return null;
    }

    if (this.formValidate && !this.group.valid && this.group.touched) {
      return this.errorMessageFromControl(this.group);
    }

    const control = this.group.get(fieldId);
    return this.errorMessageFromControl(control);
  }

  onChange(event: any) {
    this.valueChange.emit(event);
  }

  private errorMessageFromControl(control: AbstractControl): string {
    for (const propertyName in control.errors) {
        if (control.errors.hasOwnProperty(propertyName) && (control.touched)) {
          return this.getValidatorErrorMessage(propertyName, 1);
        }
    }
    return '';
  }

  private getValidatorErrorMessage(code: string, fieldLength: number | undefined) {
    const config: any = {
        required: 'Este es un campo requerido',
        minlength: 'La longitud mínima es ' + fieldLength,
        maxlength: 'La longitud máxima es ' + fieldLength,
        invalidCreditCard: 'Invalid credit card number',
        email: 'Dirección de correo inválida',
        pwdnomatch: 'La contraseña y su confirmación no coinciden',
        invalidPassword: 'Password must be at least 6 characters long, and contain a number and special character.'
    };
    return config[code];
  }
}
