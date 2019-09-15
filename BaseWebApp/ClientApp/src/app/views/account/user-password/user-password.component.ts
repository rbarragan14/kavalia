import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DataService, IUser } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '@app/shared/components';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent
  extends BaseFormComponent
  implements OnInit {

  accountForm: FormGroup;
  currentId: number;
  editingStatus = false;

  constructor(private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _ns: AppNotificationsService,
    private _dataService: DataService) {
      super();
    }

  ngOnInit() {
    this.accountForm = this._formBuilder.group({
      name: [{ value: '', disabled: true }],
      password: [null, [Validators.required]],
      currentPassword: [null, [Validators.required]],
      passwordConfirm: [null, [Validators.required]]
    }, { validator: this.passwordMatcher });
    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.editingStatus = true;
      this.setRequired(this.accountForm.controls['currentPassword'], false);
      this.getUser(this.currentId);
    }
  }

  onReturn() {
    this._router.navigate(['/account/users']);
  }

  onSubmit({ value, valid }: { value: IUser, valid: boolean }) {
    if (valid) {
      value.id = this.currentId;
      if (this.editingStatus) {
        this._dataService.post(`/api/account/user/password/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        value.password = this.accountForm.get('password').value;
        this._dataService.put('/api/account/user/password', value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.accountForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  private getUser(id: number) {
    this._dataService.get<IUser>(`/api/account/user/${id}`).subscribe(
      data =>  {
          this.accountForm.patchValue({
          name: data.firstName + ' ' + data.lastName
        });
      }
    );
  }

  private passwordMatcher (control: AbstractControl): {[key: string]: boolean} {
    const password = control.get('password');
    const confirm = control.get('passwordConfirm');
    if (!password || !confirm) {
      return null;
    }
    return password.value === confirm.value ? null : { pwdnomatch:  true };
  }
}
