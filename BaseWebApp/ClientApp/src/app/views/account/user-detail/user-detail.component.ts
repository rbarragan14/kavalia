import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IUser, IRole } from '@app/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';
import { CatalogService } from '@app/core/services/models';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent
  extends BaseFormComponent
  implements OnInit {

  identificationTypes: Array<{ key: string, value: string }>;
  roles: Array<{ key: string, value: string }> = [];
  user: IUser = null;
  currentId = 0;

  editingStatus = false;
  detailForm: FormGroup;
  accountForm: FormGroup;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _catalogService: CatalogService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
    }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('TID').subscribe(
      data => this.identificationTypes = data
    );
    this.getRoles();

    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getUser(this.currentId);
      this.editingStatus = true;
    }

    if (!this.editingStatus) {
      this.accountForm = this._formBuilder.group({
        password: [null, [Validators.required]],
        passwordConfirm: [null, [Validators.required]]
      }, { validator: this.passwordMatcher });

      this.detailForm = this._formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        identificationTypeId: [null, [Validators.required]],
        identification: [null, [Validators.required]],
        applicationRoleId: [null, [Validators.required]],
        account: this.accountForm
      });
    } else {
      this.detailForm = this._formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        identificationTypeId: [null, [Validators.required]],
        identification: [null, [Validators.required]],
        applicationRoleId: [null, [Validators.required]]
      });
    }
  }

  passwordMatcher (control: AbstractControl): {[key: string]: boolean} {
    const password = control.get('password');
    const confirm = control.get('passwordConfirm');
    if (!password || !confirm) {
      return null;
    }
    return password.value === confirm.value ? null : { pwdnomatch:  true };
  }

  onSubmit({ value, valid }: { value: IUser, valid: boolean }) {
    if (valid) {
      value.id = this.currentId;
      if (this.editingStatus) {
        this._dataService.post(`/api/account/user/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        value.password = this.accountForm.get('password').value;
        this._dataService.put('/api/account/user', value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onReturn() {
    this._router.navigate(['/account/users']);
  }

  getRoles() {
    this._dataService.get<IRole[]>(`/api/account/role`).subscribe(
      data =>  {
        this.roles = data.map(p => {
          const r = { key: p.id.toString(), value: p.name };
          return r;
        });
      }
    );
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  getUser(id: number) {
    this._dataService.get<IUser>(`/api/account/user/${id}`).subscribe(
      data =>  {
        this.user = data;
        this.detailForm.setValue({
          email: this.user.email,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          identificationTypeId: this.user.identificationTypeId,
          identification: this.user.identification,
          applicationRoleId: this.user.applicationRoleId
        });
      }
    );
  }

  onDataAccess() {
    this._router.navigate([`/account/data-access/${this.currentId}`]);
  }

  onSetPassword() {
    this._router.navigate([`/account/set-password/${this.currentId}`]);
  }
}
