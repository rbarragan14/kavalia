import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { ICompensationSchema, IPaymentVariable, DataService } from '@app/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CatalogService, IndicatorService } from '@app/core/services/models';
import { CompensationService } from '@app/core/services/models/compensation.service';

@Component({
  selector: 'app-compensation-schema-details',
  templateUrl: './compensation-schema-details.component.html',
  styleUrls: ['./compensation-schema-details.component.scss']
})
export class CompensationSchemaDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModalPaymentVariable') infoModalPaymentVariable: ModalDirective;

  positionsList: Array<{ id: string, itemName: string }> = [];
  paymentElementVariable: Array<{ key: string, value: string }> = [];
  paymentTables: Array<{ id: string, itemName: string }> = [];

  variableIndicatorRows: Array<IPaymentVariable> = [];
  variableSelected: IPaymentVariable = null;
  variableSelectedIndex: number = null;
  item: ICompensationSchema = null;

  periodicityList: Array<{ key: string, value: string }>;
  indicatorList: Array<{ key: string, value: string }> = [];
  operatorList: Array<{ key: string, value: string }> =
  [
    { value: 'Suma', key: '1' },
    { value: 'Resta', key: '2' },
    { value: 'Multiplicación', key: '3' },
    { value: 'División', key: '4' },
  ];

  editingStatus = false;
  currentId = 0;

  detailForm: FormGroup;
  paymentVariableForm: FormGroup;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _ns: AppNotificationsService,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _catalogService: CatalogService,
    private _indicatorService: IndicatorService,
    private _compensationService: CompensationService) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PSC').subscribe(
      data => {
        this.positionsList = this.dictToMultiOptions(data);
        this.setSelectedPositions();
      }
    );

    this._catalogService.getCatalogDictionary('PRD').subscribe(
      data => this.periodicityList = data
    );

    this._indicatorService.getIndicatorDictionary().subscribe(
      data => this.indicatorList = data
    );

    this._catalogService.getCatalogDictionary('ELP').subscribe(
      data => this.paymentElementVariable = data
    );

    this._compensationService.getPaymentTableDictionary().subscribe(
      data => this.paymentTables = this.dictToMultiOptions(data)
    );

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      finalDate: [null],
      positions: [null, [Validators.required]],
      periodicityId: [null, [Validators.required]],
    });

    this.paymentVariableForm = this._formBuilder.group({
      variable: [null, [Validators.required]],
      valueReference: [null],
      paymentTables: [null, [Validators.required]],
      operator: [null],
      aditional: [false],
      adjustmentFactor: [null],
      indicator: [null, [Validators.required]],
      fixedValue: [null],
    });
  }

  onSubmit({ value, valid }: { value: ICompensationSchema, valid: boolean }) {
    if (valid) {
      value.paymentVariables = this.variableIndicatorRows;
      if (this.editingStatus) {
        this._dataService.post(`/api/compensation/schema/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/compensation/schema', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSubmitPaymentVariable({ value, valid }: { value: IPaymentVariable, valid: boolean }) {
    if (valid) {
      if (this.variableSelected !== null) {
        this.setFormValues(value);
      } else {
        const paymentVariable = this.paymentElementVariable.find(x => x.key === value.variable.toString());
        value.name = paymentVariable.value;
        this.variableIndicatorRows.splice(0, 0, value);
      }

      this.variableIndicatorRows = [...this.variableIndicatorRows];
      this.infoModalPaymentVariable.hide();
    } else {
      this.validateAllFormFields(this.paymentVariableForm);
    }
  }

  onDeleteVariable() {
    if (this.variableSelectedIndex !== null) {
      this.variableIndicatorRows.splice(this.variableSelectedIndex , 1);
      this.variableIndicatorRows = [...this.variableIndicatorRows];
      this._ns.success('El cambio fue realizado!');
    }
    this.infoModalPaymentVariable.hide();
  }

  onSelectVariable(item: IPaymentVariable, rowIndex: number) {
    this.variableSelected = item;
    this.variableSelectedIndex = rowIndex;
    this.paymentVariableForm.setValue({
      variable: item.variable,
      valueReference: item.valueReference,
      paymentTables: this.setSelectedTables(item),
      operator: item.operator,
      aditional: item.aditional,
      adjustmentFactor: item.adjustmentFactor,
      indicator: item.indicator,
      fixedValue: item.fixedValue,
    });

    this.infoModalPaymentVariable.show();
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/compensation/schema']);
  }

  onClickModalVariable() {
    this.paymentVariableForm.reset();
    this.paymentVariableForm.patchValue({ aditional: false });
    this.infoModalPaymentVariable.show();
    this.variableSelected = null;
  }

  setFormValues(value: IPaymentVariable) {
    const paymentVariable = this.paymentElementVariable.find(x => x.key === value.variable.toString());
    value.name = paymentVariable.value;

    this.variableSelected.name = value.name;
    this.variableSelected.variable = value.variable;
    this.variableSelected.valueReference = value.valueReference;
    this.variableSelected.paymentTables = value.paymentTables;
    this.variableSelected.aditional = value.aditional;
    this.variableSelected.adjustmentFactor = value.adjustmentFactor;
    this.variableSelected.indicator = value.indicator;
    this.variableSelected.fixedValue = value.fixedValue;
  }

  getItem(id: number) {
    this._dataService.get<ICompensationSchema>(`/api/compensation/schema/${id}`).subscribe(
      data =>  {
        this.item = data;
        this.detailForm.patchValue({
          name: this.item.name,
          periodicityId: this.item.periodicityId,
          startDate: new Date(this.item.startDate),
          finalDate: this.item.finalDate !== null ? new Date(this.item.finalDate) : null
        });
        this.setSelectedPositions();
        this.variableIndicatorRows = data.paymentVariables || [];
      }
    );
  }

  setSelectedPositions() {
    if (this.positionsList.length > 0 && this.item && this.item.positions) {
      const selected = this.item.positions.map(p => {
        const catalog = this.positionsList.find(c => c.id === p.id.toString());
        return catalog;
      });
      this.detailForm.patchValue({
        positions: selected
      });
    }
  }

  setSelectedTables(variable: IPaymentVariable): Array<{ id: string, itemName: string }> {
    if (this.paymentTables.length > 0 && variable && variable.paymentTables) {
      const selected = variable.paymentTables.map(p => {
        const catalog = this.paymentTables.find(c => c.id === p.id.toString());
        return catalog;
      });

      return selected;
    }

    return [];
  }
}
