import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';
import { DataService, ICatalog, ICatalogItem, ICatalogAssociate } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';

@Component({
  selector: 'app-catalog-associate-details',
  templateUrl: './catalog-associate-details.component.html',
  styleUrls: ['./catalog-associate-details.component.scss']
})
export class CatalogAssociateDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  catalogs: Array<{ key: string, value: string }> = [];
  parentItems: Array<{ key: string, value: string }> = [];

  parentCatalog: ICatalog;
  childCatalog: ICatalog;

  childItems: ICatalogItem[] = [];
  selectedChildItems: ICatalogItem[] = [];
  detailForm: FormGroup;

  editingStatus = false;

  private parentCatalogItemId = 0;
  private childCatalogId = 0;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
      this.getCatalogs();
    }

  ngOnInit() {

    if (this._activatedRoute.snapshot.params['parentCatalogItemId'] && this._activatedRoute.snapshot.params['childCatalogId']) {
      this.parentCatalogItemId = parseInt(this._activatedRoute.snapshot.params['parentCatalogItemId'], 10);
      this.childCatalogId = parseInt(this._activatedRoute.snapshot.params['childCatalogId'], 10);

      this.editingStatus = true;
      this.getAssociationDetails(this.parentCatalogItemId, this.childCatalogId);
    }

    const validators = this.editingStatus ? null : Validators.compose([Validators.required]);
    this.detailForm = this._formBuilder.group({
      parentCatalogId: [{value: null, disabled: this.editingStatus}, validators],
      childCatalogId: [{value: null, disabled: this.editingStatus}, validators],
      parentCatalogItemId: [{value: null, disabled: this.editingStatus}, validators]
    });
  }

  getAssociationDetails(parentCatalogItemId: number, childCatalogId: number) {
    this._dataService.get<ICatalogAssociate>(`/api/catalog/associate/${parentCatalogItemId}/${childCatalogId}`).subscribe(
      data => {
        this.detailForm.setValue({
          parentCatalogId: data.parentCatalogId,
          childCatalogId: data.childCatalogId,
          parentCatalogItemId: data.parentCatalogItemId
        });

        this.getCatalog(data.parentCatalogId, true);
        this.getCatalog(data.childCatalogId, false, data.catalogItems);
      }
    );
  }

  onReturn() {
    this._router.navigate(['/config/associate']);
  }

  getCatalogs() {
    this._dataService.get<ICatalog[]>(`/api/catalog`).subscribe(
      data =>  {
        this.catalogs = data.map(p => {
          const r = { key: p.id.toString(), value: p.name };
          return r;
        });
      }
    );
  }

  getCatalog(id: number, isParent: boolean, selected: ICatalogItem[] = null)  {
    this._dataService.get<ICatalog>('/api/catalog/' + id).subscribe(
      data => {
        if (isParent) {
          this.parentCatalog = data;
          this.parentItems =  data.catalogItems.map(p => {
            const r = { key: p.id.toString(), value: p.name };
            return r;
          });
        } else {
          this.childCatalog = data;
          this.childItems = this.childCatalog.catalogItems;
          if (selected) {
            this.selectedChildItems = selected.map(r => this.childItems.find(p => p.id === r.id));
          }
        }
      }
    );
  }

  onSubmit({ value, valid }: { value: ICatalogAssociate, valid: boolean }) {
    if (!this.hasInvalidFields(this.detailForm)) {
      value.catalogItems = this.selectedChildItems;
      if (this.editingStatus) {
        this._dataService.post(`/api/catalog/associate/${this.parentCatalogItemId}/${this.childCatalogId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put(`/api/catalog/associate`, value).subscribe(
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

  onChangeParent(event: any) {
    this.getCatalog(event.value, true);
  }

  onChangeChild(event: any) {
    this.getCatalog(event.value, false);
  }
}
