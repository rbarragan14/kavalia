import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IPaymentTableIndicator,
         IPaymentTable,
         IIndicatorGoal,
         IGoalPayment,
         DataService,
         IPaymentTableIndicatorForm,
         IThresholdDetail,
         IPaymentTableHierarcy,
         IHierarchyStructure} from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { CatalogService } from '@app/core/services/models';
import { IndicatorService } from '@app/core/services/models/indicator.service';
import { TreeNode } from 'primeng/api';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';

@Component({
  selector: 'app-payment-table-details',
  templateUrl: './payment-table-details.component.html',
  styleUrls: ['./payment-table-details.component.scss']
})
export class PaymentTableDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModalIndicator') infoModalIndicator: ModalDirective;
  @ViewChild('infoModalGoals') infoModalGoals: ModalDirective;
  @ViewChild('infoModalGoalDetails') infoModalGoalDetails: ModalDirective;
  @ViewChild('infoModalPaymentDetails') infoModalPaymentDetails: ModalDirective;
  @ViewChild('infoModalPaymentMatrixDetails') infoModalPaymentMatrixDetails: ModalDirective;
  @ViewChild('hierarchySelectModal') hierarchySelectModal: ModalDirective;

  @ViewChild('infoModalPaymentTableIndicator') infoModalPaymentTableIndicator: ModalDirective;
  @ViewChild('infoModalPaymentTableMatrix') infoModalPaymentTableMatrix: ModalDirective;

  detailForm: FormGroup;
  indicatorForm: FormGroup;
  hierarchyForm: FormGroup;
  goalsForm: FormGroup;
  goalDetailsForm: FormGroup;
  paymentDetailsForm: FormGroup;

  editingStatus = false;
  indicatorRowIndex = -1;
  currentId = 0;
  paymentTableType = '0';
  newVersion = false;
  copyVersion = false;
  versionNumber = 1;
  selectedNode: TreeNode;

  item: IPaymentTable = null;
  itemIndicator: IPaymentTableIndicatorForm = null;

  indicatorRows: Array<IPaymentTableIndicator> = [];
  matrixIndicatorRows: Array<{ key: string, value: string }> = [];
  goalType: Array<{ key: string, value: string }>;
  kindType: Array<{ key: string, value: string }>;
  hierarchyStructureList: Array<{ key: string, value: string }>;
  hierarchyStructures: IHierarchyStructure[];

  paymentType: Array<{ key: string, value: string }>;
  activeNodes: TreeNode[] = [];

  goalsRows: IIndicatorGoal[] = [];
  goalDetailsRows: IThresholdDetail[] = [];
  goalDetailSelected: IThresholdDetail = null;
  tableHierarchies: IPaymentTableHierarcy[] = [];

  indicatorListMultiple: Array<{ id: string, itemName: string }> = [];
  indicatorList: Array<{ key: string, value: string }> = [];
  editing: any = {};
  selectedGoal: IThresholdDetail[] = [];
  goalDetailsColumns: any[] = [];

  paymentTableTypes: Array<{ key: string, value: string }> =
  [
    { value: 'Por Indicador', key: '1' },
    { value: 'Matricial', key: '2' },
  ];

  maxLimitTypes: Array<{ key: string, value: string }> =
  [
    { value: 'Valor Fijo', key: '1' },
    { value: 'Porcentaje Salario Referencia', key: '2' },
    { value: 'Porcentaje Salario', key: '2' },
  ];

  matrix: any =
  [
    {'I': '0-90%', '1': '0%', '2': '26%', '3': '34%', '4': '38%' },
    {'I': '94%', '1': '25%', '2': '29%', '3': '38%', '4': '41%' },
    {'I': '98%', '1': '39%', '2': '47%', '3': '49%', '4': '52%' },
    {'I': '99%', '1': '43%', '2': '52%', '3': '57%', '4': '61%' },
    {'I': '100%', '1': '52%', '2': '67%', '3': '70%', '4': '73%' },
    {'I': '102%', '1': '64%', '2': '80%', '3': '85%', '4': '88%' },
    {'I': '110%', '1': '68%', '2': '93%', '3': '98%', '4': '110%' },
  ];

  indicatorTable: {[k: string]: any}[] = [];
  indicatorTableCols: { header: string, field: string }[] = [];

  //// TIPO META - UMBRAL (Indicadores)
  percentageElement = ''; /// TMT-01 - Porcentaje
  specificUnitsElement = ''; /// TMT-02 - Unidades Especificas
  thresoldElement = ''; /// TMT-03 - Umbral

  //// TIPO PAGO - (Datos Pago)
  kindElement = ''; /// TPG-05 - Especie
  fixedElements: string[] = []; /// TPG-02 - Fijo / TPG-04 - Fijo Unidad
  percentageElements: string[] = []; /// TPG-01 - % valor referencia / TPG-03 -% valor unidad

  //// TIPO TOPE
  maxLimitValueElemet = '1';

  showIndicatorPercentage = false;
  showSpecificUnits = false;
  showThresold = false;
  kindSelected = false;
  thresoldSelected = false;
  showMaxLimit = false;
  showPaymentMaxValue = false;

  fixedValueSelected = false;
  percentageValueSelected = false;

  constructor(private formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _catalogService: CatalogService,
    private _activatedRoute: ActivatedRoute,
    private _indicatorService: IndicatorService,
    private _hierarchyService: HierarchyService,
    private _dataService: DataService,
    private _router: Router) {
    super();
  }

  updateValue(event: any, cell: any, rowIndex: any) {
    this.editing[rowIndex + '-' + cell] = false;
    this.matrix[rowIndex][cell] = event.target.value;
    this.matrix = [...this.matrix];
  }

  ngOnInit() {
    this.getItemsCatalog();
    this._catalogService.getCatalogDictionary('TMT').subscribe(
      data => this.goalType = data
    );

    this._catalogService.getCatalogDictionary('ESP').subscribe(
      data => this.kindType = data
    );

    this._catalogService.getCatalogDictionary('TPG').subscribe(
      data => this.paymentType = data
    );

    this._indicatorService.getIndicatorDictionary().subscribe(
      data => {
        this.indicatorList = data;
        this.indicatorListMultiple = this.dictToMultiOptions(data);
        this.setSelectedIndicators();
      }
    );

    this._hierarchyService.getHierarchyStructureDictionary().subscribe(
      data => this.hierarchyStructureList = data
    );

    this._hierarchyService.getHierarchyStructureList().subscribe(
      data => this.hierarchyStructures = data
    );

    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'version');
    this.copyVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'copy');

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion && !this.copyVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      version: [{value: this.versionNumber, disabled: true}],
      startDate: [null, [Validators.required]],
      finalDate: [null],
    });

    this.indicatorForm = this.formBuilder.group({
      indicator: [null, [Validators.required]],
      goalTypeIndicator: [null, [Validators.required]],
      paymentTableType: [null, [Validators.required]],
      indicatorPercentage: [null],
    });

    this.goalsForm = this.formBuilder.group({
      paymentTypeId: [null, [Validators.required]],
      maxLimitTypeId: [null, [Validators.required]],
      paymentMaxValue: [null],
      percentage: [null],
      goalKindId: [null],
      kindValue: [null]
    });

    this.goalDetailsForm = this.formBuilder.group({
      percentage: [null],
      unitNumber: [null],
      thresholdLow: [null, [Validators.required]],
      thresholdUp: [null, [Validators.required]],
    });

    this.paymentDetailsForm = this.formBuilder.group({
      fixedValue: [null],
      percentageUnit: [null],
      indicator: [{value: null, disabled: true}],
    });

    this.hierarchyForm = this.formBuilder.group({
      hierarchy: [null, [Validators.required]],
    });
  }

  getItem(id: number) {
    this._dataService.get<IPaymentTable>(`/api/compensation/paymenttable/${id}`).subscribe(
      data =>  {
        this.versionNumber = this.newVersion ? data.version + 1 : data.version;
        this.item = data;
        this.detailForm.patchValue({
          startDate: new Date(this.item.startDate),
          name: this.item.name,
          finalDate: data.finalDate !== null ? new Date(data.finalDate) : null,
          version: this.versionNumber,
        });

        this.item.indicators.forEach(i => i.name = i.indicator.name);
        this.paymentTableType = this.item.tableType.toString();
        this.tableHierarchies = this.item.hierarchies;

        this.fillIndicators(this.item.indicators);
        this.setIndicatorsForm();
      }
    );
  }

  onDeleteIndicator() {
    if (this.indicatorRowIndex > -1) {
      this.indicatorRows.splice(this.indicatorRowIndex, 1);
      this.indicatorRows = [...this.indicatorRows];
    }

    this.infoModalIndicator.hide();
    this._ns.success('El cambio fue realizado!');
  }

  onSubmit({ value, valid }: { value: IPaymentTable, valid: boolean }) {
    if (valid && this.validateData()) {
      value.hierarchies = this.tableHierarchies;
      value.version = this.versionNumber;
      value.tableType = this.itemIndicator.paymentTableType;
      value.thresholdType = this.itemIndicator.goalTypeIndicator;
      value.percentageIndicatorType = this.itemIndicator.indicatorPercentage;
      value.indicators = this.indicatorRows;

      if (this.editingStatus) {
        this._dataService.post(`/api/compensation/paymenttable/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/compensation/paymenttable', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  private validateData(): boolean {
    //// payment table selected
    if (this.paymentTableType === '0') {
      this._ns.warning('Debe seleccionar los indicadores y el tipo de tabla a usar');
      return false;
    }

    //// indicators selected
    if (!this.indicatorRows || this.indicatorRows.length === 0) {
      this._ns.warning('Debe seleccionar los indicadores a usar');
      return false;
    }

    //// hierarchy selected
    if (!this.tableHierarchies || this.tableHierarchies.length === 0) {
      this._ns.warning('Debe seleccionar la jerarquía a usar');
      return false;
    }

    //// payment configuration
    return true;
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/compensation/payment-table']);
  }

  onSelectGoal(item: IPaymentTableIndicator, rowIndex: number): void {
    this.indicatorRowIndex = rowIndex;
    if (this.indicatorRows[this.indicatorRowIndex].goalPayment) {
      this.goalsForm.setValue(
        {
          paymentTypeId: this.indicatorRows[this.indicatorRowIndex].goalPayment.paymentTypeId,
          maxLimitTypeId: this.indicatorRows[this.indicatorRowIndex].goalPayment.maxLimitTypeId,
          percentage: this.indicatorRows[this.indicatorRowIndex].goalPayment.percentage,
          goalKindId: this.indicatorRows[this.indicatorRowIndex].goalPayment.goalKindId,
          paymentMaxValue: this.indicatorRows[this.indicatorRowIndex].goalPayment.paymentMaxValue,
          kindValue: this.indicatorRows[this.indicatorRowIndex].goalPayment.kindValue
      });
      this.showHideKindValues(this.indicatorRows[this.indicatorRowIndex].goalPayment.paymentTypeId);
      this.showHideMaxLimit(this.indicatorRows[this.indicatorRowIndex].goalPayment.maxLimitTypeId);
    } else {
      this.goalsForm.reset();
    }

    this.infoModalGoals.show();
  }

  onSelectGoalDetailRow() {
    this.paymentDetailsForm.patchValue({
      fixedValue: this.selectedGoal[0].fixedValue,
      percentageUnit: this.selectedGoal[0].percentageUnit
    });
  }

  onCloseGoalDetails() {
    this.indicatorRows[this.indicatorRowIndex].thresholdDetails = this.goalDetailsRows;
    this.infoModalGoalDetails.hide();
    this.indicatorRowIndex = -1;
  }

  onSelectGoalDetails(item: IPaymentTableIndicator, rowIndex: number): void {
    this.goalDetailsColumns = [];
    this.indicatorRowIndex = rowIndex;

    this.setUpGoalsGrid();
    this.setRequired(this.goalDetailsForm.controls['percentage'], this.showIndicatorPercentage);
    this.setRequired(this.goalDetailsForm.controls['unitNumber'], this.showSpecificUnits);
    this.setRequired(this.goalDetailsForm.controls['thresholdLow'], this.showThresold);
    this.setRequired(this.goalDetailsForm.controls['thresholdUp'], this.showThresold);

    if (this.indicatorRows[this.indicatorRowIndex].thresholdDetails) {
      this.goalDetailsRows = this.indicatorRows[this.indicatorRowIndex].thresholdDetails;
    } else {
      this.goalDetailsRows = [];
    }

    this.infoModalGoalDetails.show();
  }

  onSelectPaymentDetails(item: IPaymentTableIndicator, rowIndex: number): void {
    if (this.paymentTableType === '2') {
      this.matrixIndicatorRows = this.indicatorRows.map(x => {
        const r = { key: x.id.toString(), value: x.name };
        return r;
      } );
      this.infoModalPaymentMatrixDetails.show();
    } else {
      this.indicatorRowIndex = rowIndex;
      this.setUpGoalsGrid();

      if (this.indicatorRows[this.indicatorRowIndex].thresholdDetails) {
        this.goalDetailsRows = this.indicatorRows[this.indicatorRowIndex].thresholdDetails;
      } else {
        this.goalDetailsRows = [];
      }
      this.infoModalPaymentDetails.show();
      this.paymentDetailsForm.patchValue({indicator: this.indicatorRows[rowIndex].name});

      const paymentTypeSelected = this.indicatorRows[rowIndex].goalPayment ? this.indicatorRows[rowIndex].goalPayment.paymentTypeId : 0;
      this.fixedValueSelected = !!this.fixedElements.find(x => x === paymentTypeSelected.toString());
      this.percentageValueSelected = !!this.percentageElements.find(x => x === paymentTypeSelected.toString());
    }
  }

  onClickModalIndicator() {
    this.infoModalIndicator.show();
    this.indicatorRowIndex = -1;
  }

  onClickModalTable() {
    if (this.paymentTableType === '0') {
      this._ns.warning('Debe seleccionar el tipo de tabla a usar');
    } else if (this.paymentTableType === '1') {
      this.buildIndicatorTable();
      this.infoModalPaymentTableIndicator.show();
    } else {
      this.infoModalPaymentTableMatrix.show();
    }
  }

  onSubmitIndicator({ value, valid }: { value: IPaymentTableIndicatorForm, valid: boolean }) {
    if (valid) {
      this.itemIndicator = value;
      this.paymentTableType = value.paymentTableType.toString();
      this.indicatorRows = [];

      this.fillIndicators(value.indicator.map(i => {
          const indicatorItem: IPaymentTableIndicator = {
            id: +i.id,
            name: i.itemName,
          };

          return indicatorItem;
        }));

      this.infoModalIndicator.hide();
    } else {
      this.validateAllFormFields(this.indicatorForm);
    }
  }

  private fillIndicators(values: IPaymentTableIndicator[]) {
      for (const item of values) {
        this.indicatorRows.splice(0, 0, item);
      }

      this.indicatorRows = [...this.indicatorRows];
  }

  private setIndicatorsForm() {
    this.setSelectedIndicators();
    this.itemIndicator = {
      percentage: this.item.percentageIndicatorType,
      paymentTableType: this.item.tableType,
      goalTypeIndicator: this.item.thresholdType
    };

    this.indicatorForm.patchValue({
      goalTypeIndicator: this.item.thresholdType,
      paymentTableType: this.item.tableType,
      indicatorPercentage: this.item.percentageIndicatorType,
    });

    this.showHideIndicatorPercentage(this.itemIndicator.goalTypeIndicator);
  }

  private setUpGoalsGrid() {
    this.showIndicatorPercentage = this.isPercentageIndicator();
    this.showSpecificUnits = this.isSpecificUnitsIndicator();
    this.showThresold = this.isThresoldIndicator();

    if (this.showIndicatorPercentage) {
      this.goalDetailsColumns.push( { name: 'Porcentaje', prop: 'percentage' });
    }

    if (this.showSpecificUnits) {
      this.goalDetailsColumns.push( { name: '# Unidades', prop: 'unitNumber' });
    }

    if (this.showThresold) {
      this.goalDetailsColumns.push( { name: 'V. Inicial', prop: 'thresholdLow' });
      this.goalDetailsColumns.push( { name: 'V. Final', prop: 'thresholdUp' });
    }
  }

  setSelectedIndicators() {
    if (this.indicatorListMultiple.length > 0 && this.item && this.item.indicators) {
      const selected = this.item.indicators.map(p => {
        const catalog = this.indicatorListMultiple.find(c => c.id === p.id.toString());
        return catalog;
      });
      this.indicatorForm.patchValue({
        indicator: selected
      });
    }
  }

  onSelectGoalDetail(item: IThresholdDetail) {
    this.goalDetailSelected = item;
    this.goalDetailsForm.setValue({
      percentage: item.percentage,
      unitNumber: item.unitNumber,
      thresholdLow: item.thresholdLow,
      thresholdUp: item.thresholdUp,
    });
  }

  onSelectHierarchy(item: IPaymentTableHierarcy) {
    this.hierarchyForm.patchValue({
      hierarchy: item.hierarchyStructureId
    });
    this.loadHierarchyStructure(item.hierarchyStructureId, item.hierarchyStructureNodeId);
  }

  onDeleteGoalDetail(index: number) {
    if (index > -1) {
      this.goalDetailsRows.splice(index, 1);
      this.goalDetailsRows = [...this.goalDetailsRows];
    }
  }

  onDeleteHierarchy(index: number) {
    if (index > -1) {
      this.tableHierarchies.splice(index, 1);
      this.tableHierarchies = [...this.tableHierarchies];
    }
  }

  onSubmitGoals({ value, valid }: { value: IGoalPayment, valid: boolean }) {
    if (valid) {
      this.infoModalGoals.hide();
      this.indicatorRows[this.indicatorRowIndex].goalPayment = value;
    } else {
      this.validateAllFormFields(this.goalsForm);
    }
  }

  onSubmitGoalDetails({ value, valid }: { value: IThresholdDetail, valid: boolean }) {
    if (valid) {
      this.goalDetailsRows.splice(0, 0, value);
      this.goalDetailsRows = [...this.goalDetailsRows];
      this.goalDetailsForm.reset();
    } else {
      this.validateAllFormFields(this.goalDetailsForm);
    }
  }

  onSubmitHierarchy({ value, valid }: { value: IThresholdDetail, valid: boolean }) {
    if (valid) {
      const paymentHierarchy: IPaymentTableHierarcy = {
        hierarchyStructureId: this.hierarchyForm.get('hierarchy').value,
        hierarchyStructureNodeId: this.selectedNode.data.id,
        hierarchyStructure: this.hierarchyStructures.find(x => x.id.toString() === this.hierarchyForm.get('hierarchy').value),
        hierarchyStructureNode: this.selectedNode.data
      };

      this.tableHierarchies.splice(0, 0, paymentHierarchy);
      this.tableHierarchies = [...this.tableHierarchies];
      this.activeNodes = [];
      this.selectedNode = null;
      this.hierarchyForm.reset();
    } else {
      this.validateAllFormFields(this.hierarchyForm);
    }
  }


  onSubmitPaymentDetails({ value, valid }: { value: IThresholdDetail, valid: boolean }) {
    if (valid) {
      if (this.selectedGoal.length > 0) {
        this.selectedGoal[0].fixedValue = value.fixedValue;
        this.selectedGoal[0].percentageUnit = value.percentageUnit;
        this._ns.success('El cambio fue realizado!');
      } else {
        this._ns.warning('Debe seleccionar el umbral de la lista!');
      }
    } else {
      this.validateAllFormFields(this.paymentDetailsForm);
    }
  }

  onHierarcySelect() {
    this.hierarchySelectModal.show();
  }

  onChangeHierarchy(event: any) {
    this.loadHierarchyStructure(event.value);
  }

  onChangeGoalTypeIndicator(event: any) {
    this.showHideIndicatorPercentage(event.value);
  }

  onChangePaymentType(event: any) {
    this.showHideKindValues(event.value);
  }

  onChangeMaxLimit(event: any) {
    this.showHideMaxLimit(event.value);
  }

  private showHideIndicatorPercentage(value: number) {
    this.showIndicatorPercentage = value.toString() === this.percentageElement;
  }

  private showHideKindValues(value: number) {
    this.kindSelected = value.toString() === this.kindElement;
    this.showMaxLimit = !!this.percentageElements.find(x => x === value.toString());

    this.setRequired(this.goalsForm.controls['maxLimitTypeId'], this.showMaxLimit);
    this.setRequired(this.goalsForm.controls['percentage'], !this.kindSelected);
    this.setRequired(this.goalsForm.controls['goalKindId'], this.kindSelected);
    this.setRequired(this.goalsForm.controls['kindValue'], this.kindSelected);
  }

  private showHideMaxLimit(value: number) {
    if (value) {
      this.showPaymentMaxValue = value.toString() === this.maxLimitValueElemet;
      this.setRequired(this.goalsForm.controls['paymentMaxValue'], this.showPaymentMaxValue);
      this.setRequired(this.goalsForm.controls['percentage'], !this.showPaymentMaxValue);
    }
  }

  private getItemsCatalog() {

    this._catalogService.getCatalogItemById('TMT-01').subscribe(
      data => this.percentageElement = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TMT-02').subscribe(
      data => this.specificUnitsElement = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TMT-03').subscribe(
      data => this.thresoldElement = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TPG-05').subscribe(
      data => this.kindElement = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TPG-02').subscribe(
      data => this.fixedElements.push(data.id.toString())
    );

    this._catalogService.getCatalogItemById('TPG-04').subscribe(
      data => this.fixedElements.push(data.id.toString())
    );

    this._catalogService.getCatalogItemById('TPG-01').subscribe(
      data => this.percentageElements.push(data.id.toString())
    );

    this._catalogService.getCatalogItemById('TPG-03').subscribe(
      data => this.percentageElements.push(data.id.toString())
    );

    this._catalogService.getCatalogItemById('TPG-06').subscribe(
      data => this.percentageElements.push(data.id.toString())
    );

    this._catalogService.getCatalogItemById('TPG-07').subscribe(
      data => this.percentageElements.push(data.id.toString())
    );
  }

  private buildIndicatorTable() {
    const isThresoldIndicator = this.isThresoldIndicator();
    let isSpecificUnitsIndicator = false;
    let isPercentageIndicator = false;

    if (!isThresoldIndicator) {
      isSpecificUnitsIndicator = this.isSpecificUnitsIndicator();
      if (!isSpecificUnitsIndicator) {
        isPercentageIndicator = this.isPercentageIndicator();
      }
    }

    this.indicatorTable = [];
    this.indicatorTableCols = [ { header: 'Indicador', field: 'I' } ];

    if (isThresoldIndicator) {
      this.indicatorTableCols.push({ header: 'V. Inicial', field: 'M' });
      this.indicatorTableCols.push({ header: 'V. Final', field: 'X' });
    } else if (isSpecificUnitsIndicator) {
      this.indicatorTableCols.push({ header: '# Unidades', field: 'M' });
    } else if (isPercentageIndicator) {
      this.indicatorTableCols.push({ header: 'Porcentaje', field: 'M' });
    }

    this.indicatorTableCols.push({ 'header': 'Pago', field: 'P' });

    if (this.indicatorRows) {
      for (let i = 0; i < this.indicatorRows.length; i++) {
        if (this.indicatorRows[i].thresholdDetails) {
          for (let j = 0; j < this.indicatorRows[i].thresholdDetails.length; j++) {
            const threshold = this.indicatorRows[i].thresholdDetails[j];
            const row: {[k: string]: any} = { 'I' : this.indicatorRows[i].name };
            if (isThresoldIndicator) {
              row.M = threshold.thresholdLow;
              row.X = threshold.thresholdUp;
            } else if (isSpecificUnitsIndicator) {
              row.M = threshold.unitNumber;
            } else if (isPercentageIndicator) {
              row.M = threshold.percentage;
            }

            if (threshold.fixedValue) {
              row.P = threshold.fixedValue;
            } else if (threshold.percentageUnit) {
              row.P = threshold.percentageUnit;
            }

            this.indicatorTable.push(row);
          }
        }
      }
    }
  }

  private loadHierarchyStructure(id: number, selected?: number) {
    this._hierarchyService.getHierarchyStructureTree(id).subscribe(
      data => {
        this.activeNodes = data.nodes || [];
        if (selected) {
          this.selectedNode = this._hierarchyService.findStructureNodeById(data.nodes, selected);
        }
      }
    );
  }

  private isThresoldIndicator(): boolean {
    return this.itemIndicator &&
           this.itemIndicator.goalTypeIndicator &&
           this.itemIndicator.goalTypeIndicator.toString() === this.thresoldElement;
  }

  private isSpecificUnitsIndicator(): boolean {
    return this.itemIndicator &&
           this.itemIndicator.goalTypeIndicator &&
           this.itemIndicator.goalTypeIndicator.toString() === this.specificUnitsElement;
  }

  private isPercentageIndicator(): boolean {
    return this.itemIndicator &&
           this.itemIndicator.goalTypeIndicator &&
           this.itemIndicator.goalTypeIndicator.toString() === this.percentageElement;
  }
}
