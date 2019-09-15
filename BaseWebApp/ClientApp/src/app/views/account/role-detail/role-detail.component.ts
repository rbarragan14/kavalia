import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRole, IPermission,  IRolePermission} from '@app/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent
  extends BaseFormComponent
  implements OnInit {

  selectedPermissions: Array<any> = [];
  allPermissions: Array<IPermission> = null;
  role: IRole = null;
  currentId = 0;

  editingStatus = false;
  detailForm: FormGroup;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
    }

    ngOnInit() {
      this.detailForm = this._formBuilder.group({
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
      });

      this.getAllPermissions();

      if (this._activatedRoute.snapshot.params['id']) {
        this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
        this.getRole(this.currentId);
        this.editingStatus = true;
      }
    }

    onSubmit({ value, valid }: { value: IRole, valid: boolean }) {
      if (valid) {
          value.id = this.currentId;
          value.permissions = this.selectedPermissions.map(p => {
              const r: IRolePermission = { permissionId: p.id, roleId: 0 };
              return r;
            });

        if (this.editingStatus) {
          this._dataService.post(`/api/account/role/${this.currentId}`, value).subscribe(
            data => this.onSuccess()
          );
        } else {
          this._dataService.put('/api/account/role', value).subscribe(
            data => this.onSuccess()
          );
        }
      } else {
        this.validateAllFormFields(this.detailForm);
      }
    }

    onReturn() {
      this._router.navigate(['/account/roles']);
    }

    getRole(id: number) {
      this._dataService.get<IRole>(`/api/account/role/${id}`).subscribe(
          data => {
            this.role = data;
            this.detailForm.setValue({
              name: this.role.name,
              description: this.role.description,
            });
            this.setSelectedPermissions();
          }
      );
    }

    setSelectedPermissions() {
      if (this.allPermissions != null && this.role != null) {
        this.selectedPermissions = this.role.permissions.map(r => this.allPermissions.find(p => p.id === r.permissionId));
      }
    }

    onDelete() {
      this._dataService.delete(`/api/account/role/${this.currentId}`).subscribe(
        data => this.onSuccess()
      );
    }

    onSuccess() {
      this._ns.success('El cambio fue realizado!');
      this.onReturn();
    }

    getAllPermissions() {
      this._dataService.get<IPermission[]>('/api/account/permission').subscribe(
          data => {
            this.allPermissions = data;
            this.setSelectedPermissions();
          }
      );
    }
}
