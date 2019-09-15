import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { ICompany } from '@app/core/models/Company';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  item: ICompany = null;
  currentId = 0;

  itemForm: FormGroup;
  editingStatus = false;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
    }

    ngOnInit() {
      this.itemForm = this._formBuilder.group({
        name: [null, [Validators.required]],
        identification: [null, [Validators.required]],
        address: [null, [Validators.required]],
        activeStatus: [true, [Validators.required]],
      });

      if ('id' in this._activatedRoute.snapshot.params) {
        this.editingStatus = true;
        this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
        this.getItem(this.currentId);
      }
    }

    onSubmit({ value, valid }: { value: ICompany, valid: boolean }) {
      if (valid) {
        if (this.editingStatus) {
          this._dataService.post(`/api/company/${this.currentId}`, value).subscribe(
            data => this.onSuccess()
          );
        } else {
          this._dataService.put('/api/company', value).subscribe(
            data => this.onSuccess()
          );
        }
      } else {
        this.validateAllFormFields(this.itemForm);
      }
    }

    onSuccess() {
      this._ns.success('El cambio fue realizado!');
      this.onReturn();
    }

    onReturn() {
      this._router.navigate(['/config/companies']);
    }

    getItem(id: number) {
      this._dataService.get<ICompany>(`/api/company/${id}`).subscribe(
          data =>  {
            this.item = data;

            this.itemForm.setValue({
              name: this.item.name,
              identification: this.item.identification,
              address: this.item.address,
              activeStatus: this.item.activeStatus,
            });
          }
        );
    }

}
