import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, IUserDelegate, IUser, UtilityService } from '@app/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-user-delegate-detail',
  templateUrl: './user-delegate-detail.component.html',
  styleUrls: ['./user-delegate-detail.component.scss']
})
export class UserDelegateDetailComponent
  extends BaseFormComponent
  implements OnInit {

  item: IUserDelegate = null;
  currentId = 0;
  detailForm: FormGroup;
  editingStatus = false;
  users: Array<{ key: string, value: string }> = [];

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _utilityService: UtilityService) {
      super();
    }

  ngOnInit() {

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      delegateUserId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      activeStatus: [true],
    });

    this.getUsers();
  }

  getItem(id: number) {
    this._dataService.get<IUserDelegate>(`/api/account/delegate/${id}`).subscribe(
        data =>  {
          this.item = data;

          this.detailForm.setValue({
            delegateUserId: this.item.delegateUserId,
            startDate: new Date(this.item.startDate),
            finalDate: new Date(this.item.finalDate),
            activeStatus: this.item.activeStatus,
          });
        }
      );
  }

  onSubmit({ value, valid }: { value: IUserDelegate, valid: boolean }) {
    if (valid) {
      value.startDate = this._utilityService.convertToUtc(value.startDate);
      value.finalDate = this._utilityService.convertToUtc(value.finalDate);
      if (this.editingStatus) {
        this._dataService.post(`/api/account/delegate/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/account/delegate', value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/account/delegate']);
  }

  onDelete() {
    this._dataService.delete(`/api/account/delegate/${this.currentId}`).subscribe(
      data => this.onSuccess()
    );
  }

  getUsers() {
    this._dataService.get<IUser[]>(`/api/account/delegate/users`).subscribe(
      data =>  {
        this.users = data.map(p => {
          const r = { key: p.id.toString(), value: p.name };
          return r;
        });
      }
    );
  }
}
