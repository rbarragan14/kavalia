import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessRule, DataService } from '@app/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { CatalogService } from '@app/core/services/models';
import { CompensationService } from '@app/core/services/models/compensation.service';

@Component({
  selector: 'app-business-rule-details',
  templateUrl: './business-rule-details.component.html',
  styleUrls: ['./business-rule-details.component.scss']
})

export class BusinessRuleDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  incidentTypeList: Array<{ key: string, value: string }>;
  paymentTables: Array<{ key: string, value: string }>;
  paymentVariableElements: Array<{ id: string, itemName: string }> = [];
  type: Array<{ key: string, value: string }> =
  [
    { value: 'Tabla de Pago', key: '1' },
    { value: 'Porcentaje Salario', key: '2' },
  ];

  detailForm: FormGroup;
  editingStatus = false;
  item: IBusinessRule = null;
  currentId = 0;
  versionNumber = 1;
  newVersion = false;
  typeSelected: string = null;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _catalogService: CatalogService,
    private _compensationService: CompensationService,
    private _ns: AppNotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('TIC').subscribe(
      data => this.incidentTypeList = data
    );

    this._catalogService.getCatalogDictionary('ELP').subscribe(
      data => this.paymentVariableElements = this.dictToMultiOptions(data)
    );

    this._compensationService.getPaymentTableDictionary().subscribe(
      data => this.paymentTables = data
    );

    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'version');
    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      startDate: [null, [Validators.required]],
      version: [{value: this.versionNumber, disabled: true}],
      incidentTypeId: [null, [Validators.required]],
      type: [null, [Validators.required]],
      paymentTableId: [null],
      salaryPercentage: [null],
      paymentVariableElements: [null, [Validators.required]],
      additional: [false]
    });
  }

  onSubmit({ value, valid }: { value: IBusinessRule, valid: boolean }) {
    if (valid) {
      value.version = this.versionNumber;
      if (this.editingStatus) {
        this._dataService.post(`/api/compensation/businessrule/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/compensation/businessrule', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onReturn() {
    this._router.navigate(['/compensation/business-rules']);
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  setSelectedElements() {
    if (this.paymentVariableElements.length > 0 && this.item && this.item.paymentVariableElements) {
      const selected = this.item.paymentVariableElements.map(p => {
        const catalog = this.paymentVariableElements.find(c => c.id === p.id.toString());
        return catalog;
      });
      this.detailForm.patchValue({
        paymentVariableElements: selected
      });
    }
  }

  getItem(id: number) {
    this._dataService.get<IBusinessRule>(`/api/compensation/businessrule/${id}`).subscribe(
      data =>  {
        this.versionNumber = this.newVersion ? data.version + 1 : data.version;
        this.item = data;
        const type = this.item.paymentTableId !== null ? '1' : '2';
        this.detailForm.patchValue({
          startDate: new Date(this.item.startDate),
          paymentTableId: this.item.paymentTableId,
          incidentTypeId: this.item.incidentTypeId,
          salaryPercentage: this.item.salaryPercentage,
          additional: this.item.additional,
          version: this.versionNumber,
          type: type
        });

        this.onChangeType({ value: type });
        this.setSelectedElements();
      }
    );
  }

  onChangeType(event: any) {
    this.typeSelected = event.value;
    this.setRequired(this.detailForm.controls['paymentTableId'], this.typeSelected === '1' );
    this.setRequired(this.detailForm.controls['salaryPercentage'], this.typeSelected === '2');

    if (this.typeSelected === '1') {
      this.detailForm.patchValue({salaryPercentage: null});
    } else {
      this.detailForm.patchValue({paymentTableId: null});
    }
  }
}
