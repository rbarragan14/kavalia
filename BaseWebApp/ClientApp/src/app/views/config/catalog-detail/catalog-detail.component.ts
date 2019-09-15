import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ICatalog, ICatalogItem } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.scss']
})
export class CatalogDetailComponent
  extends BaseFormComponent
  implements OnInit {

  catalog: ICatalog = null;
  currentId = 0;

  catalogItem: ICatalogItem = null;
  currentItemId = 0;

  catalogDetailForm: FormGroup;
  editingStatus = false;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
    }

  ngOnInit() {
    this.catalogDetailForm = this._formBuilder.group({
      catalogItemId: [null, [Validators.required, Validators.minLength(2)]],
      name: [null, [Validators.required, Validators.minLength(1)]]
    });

    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getCatalog(this.currentId);
    }

    if (this._activatedRoute.snapshot.params['itemId']) {
      this.editingStatus = true;
      this.currentItemId = parseInt(this._activatedRoute.snapshot.params['itemId'], 10);
      this.getCatalogItem(this.currentId, this.currentItemId);
    }
  }

  onSubmit({ value, valid }: { value: ICatalogItem, valid: boolean }) {
    if (valid) {
      value.catalogId = this.currentId;

      if (this.editingStatus) {
        this._dataService.post(`/api/catalog/${this.currentId}/item/${this.currentItemId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put(`/api/catalog/${this.currentId}/item`, value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.catalogDetailForm);
    }
  }

  getCatalog(id: number) {
      this._dataService.get<ICatalog>(`/api/catalog/${id}`).subscribe(
          data => this.catalog = data
      );
  }

  getCatalogItem(id: number, itemId: number) {
    this._dataService.get<ICatalogItem>(`/api/catalog/${id}/item/${itemId}`).subscribe(
        data =>  {
          this.catalogItem = data;

          this.catalogDetailForm.setValue({
            catalogItemId: this.catalogItem.catalogItemId,
            name: this.catalogItem.name
          });
        }
    );
  }

  onDelete() {
    this._dataService.delete(`/api/catalog/${this.currentId}/item/${this.currentItemId}`).subscribe(
      data => this.onSuccess()
    );
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/config/catalogs/', this.currentId]);
  }
}
