import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  IIndicator,
  DataService,
  UtilityService,
  IHierarchyStructureTreeNode,
  IFormula,
  IParameterFormula,
  IIndicatorVariable,
  IIndicatorIndicator } from '@app/core';

import { DataSourceService, IndicatorService, HierarchyService, CalculationService } from '@app/core/services/models';
import { ActivatedRoute } from '@angular/router';
import { IAssociatedData } from '@app/core/models/indicators/AssociatedData';
import { IFormulation } from '@app/core/models/indicators/Formulation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-formulation',
  templateUrl: './formulation.component.html',
  styleUrls: ['./formulation.component.scss']
})
export class FormulationComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModal') infoModal: ModalDirective;
  @ViewChild('infoModalDatasource') infoModalDatasource: ModalDirective;
  @ViewChild('infoModalVariable') infoModalVariable: ModalDirective;
  @ViewChild('infoModalIndicator') infoModalIndicator: ModalDirective;

  periodType: string;
  selectedVariablesList: IIndicatorVariable[] = [];
  selectedIndicatorsList: IIndicatorIndicator[] = [];
  selectedVariable: IIndicatorVariable[] = [];
  selectedIndicator: IIndicatorIndicator[] = [];

  indicatorId: number;
  indicator: IIndicator;

  hierarchy: IHierarchyStructureTreeNode[];
  formulaVariables: IParameterFormula[] = [];

  detailForm: FormGroup;
  paramDatasourceForm: FormGroup;
  paramForm: FormGroup;
  variableForm: FormGroup;
  indicatorForm: FormGroup;

  selected: IParameterFormula[] = [];
  selectedDatasource: IAssociatedData[] = [];
  selectedNode: TreeNode;

  rows: IParameterFormula[] = [];
  rowsDatasource: IAssociatedData[] = [];

  hierarchyList: Array<{ key: string, value: string }>;
  variablesList: Array<{ key: string, value: string }>;
  indicatorsList: Array<{ key: string, value: string }>;
  fieldsList: Array<{ key: string, value: string }>;
  datasourcesList: Array<{ key: string, value: string }>;

  constructor(private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _hierarchyService: HierarchyService,
    private _ns: AppNotificationsService,
    private _us: UtilityService,
    private _dataService: DataService,
    private _dataSourceService: DataSourceService,
    private _indicatorService: IndicatorService,
    private _cs: CalculationService,
    private _router: Router) {
    super();
  }

  ngOnInit() {
    this._dataSourceService.getSqlDataSourcesDictionary().subscribe(
      data => this.datasourcesList = data
    );

    this._indicatorService.getVariablesDictionary().subscribe(
      data =>  {
        this.variablesList = data;
      }
    );

    this._indicatorService.getIndicatorDictionary().subscribe(
      data => {
        this.indicatorsList = data;
      }
    );

    this._hierarchyService.getHierarchyStructureDictionary().subscribe(
      data => this.hierarchyList = data
    );

    if ('id' in this._activatedRoute.snapshot.params) {
      this.indicatorId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
    }

    this.detailForm = this._formBuilder.group({
      name: [{ value: null, disabled: true }],
      description: [{ value: null, disabled: true }],
      formula: [null, [Validators.required]],
      hierarchy: [null],
    });

    this.paramForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

    this.paramDatasourceForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      sqlDataSourceId: [null, [Validators.required]],
      sqlFieldId: [null, [Validators.required]],
    });

    this.paramForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

    this.variableForm = this._formBuilder.group({
      variableId: [null, [Validators.required]],
      periodOffset: [null, [Validators.required]],
      variableFormula: [null, [Validators.required]],
    });

    this.indicatorForm = this._formBuilder.group({
      indicatorChildId: [null, [Validators.required]],
      periodOffset: [null, [Validators.required]],
      variableFormula: [null, [Validators.required]],
    });

    this._indicatorService.getIndicator(this.indicatorId).subscribe(
      data => {
        this.indicator = data;
        this.setHierarchy(data.hierarchyStructureId, data.hierarchyStructureNodeId);

        this.detailForm.patchValue({
          name: data.name,
          description: data.description,
          formula: data.formula,
          hierarchy: data.hierarchyStructureId
        });

        this.rows = data.generalData;
        this.rowsDatasource = data.associatedData;
        this.selectedVariablesList = data.variables;
        this.selectedIndicatorsList = data.indicators;
        this.periodType = this.getPeriodLabel(data.periodicity);
      }
    );
  }

  onSubmit({ value, valid }: { value: IFormulation, valid: boolean }) {
    if (valid) {
      this.checkFormulaSyntax(value).subscribe(
        result => {
          if (result) {
            this.indicator.formula = value.formula;
            this.indicator.hierarchyStructureId = value.hierarchy;
            this.indicator.hierarchyStructureNodeId = this.selectedNode && this.selectedNode.data ? this.selectedNode.data.id : null;
            this.indicator.variables = this.selectedVariablesList;
            this.indicator.indicators = this.selectedIndicatorsList;
            this.indicator.generalData = this.rows;
            this.indicator.associatedData = this.rowsDatasource;
            this._dataService.post(`/api/indicator/${this.indicatorId}/formulation`, this.indicator).subscribe(
              () => this.onSuccess()
            );
          }
        }
      );
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/indicators/indicators']);
  }

  onClickModal() {
    this.selected = [];
    this.paramForm.reset();
    this.infoModal.show();
  }

  onClickDatasourceModal() {
    this.selectedDatasource = [];
    this.paramDatasourceForm.reset();
    this.infoModalDatasource.show();
  }

  onClickVariable() {
    this.selectedVariable = [];
    this.variableForm.reset();
    this.infoModalVariable.show();
  }

  onClickIndicator() {
    this.selectedIndicator = [];
    this.indicatorForm.reset();
    this.infoModalIndicator.show();
  }

  onSubmitParam({ value, valid }: { value: IParameterFormula, valid: boolean }) {
    if (valid) {
      if (this.selected.length > 0) {
        this.selected[0].name = value.name;
        this.selected[0].value = value.value;
      } else {
        this.rows.splice(0, 0, value);
      }

      this.rows = [...this.rows];
      this.infoModal.hide();
    }
  }

  onSubmitDatasourceParam({ value, valid }: { value: IAssociatedData, valid: boolean }) {
    if (valid) {
      if (this.selectedDatasource.length > 0) {
        this.selectedDatasource[0].name = value.name;
        this.selectedDatasource[0].description = value.description;
        this.selectedDatasource[0].sqlDataSourceId = value.sqlDataSourceId;
        this.selectedDatasource[0].sqlFieldId = value.sqlFieldId;
      } else {
        this.rowsDatasource.splice(0, 0, value);
      }

      this.rowsDatasource = [...this.rowsDatasource];
      this.infoModalDatasource.hide();
    }
  }

  onSubmitVariableFormula({ value, valid }: { value: IIndicatorVariable, valid: boolean }) {
    if (valid) {
      value.variable = {
        id: value.variableId,
        name: this._us.getElementValueFromDictionary(this.variablesList, value.variableId.toString())
      };
      if (this.selectedVariable.length > 0) {
        this.selectedVariable[0].variable = value.variable;
        this.selectedVariable[0].periodOffset = value.periodOffset;
        this.selectedVariable[0].variableId = value.variableId;
        this.selectedVariable[0].variableFormula = value.variableFormula;
      } else {
        this.selectedVariablesList.splice(0, 0, value);
      }

      this.selectedVariablesList = [...this.selectedVariablesList];
      this.infoModalVariable.hide();
    } else {
      this.validateAllFormFields(this.variableForm);
    }
  }

  onSubmitIndicatorFormula({ value, valid }: { value: IIndicatorIndicator, valid: boolean }) {
    if (valid) {
      value.indicatorChildName = this._us.getElementValueFromDictionary(this.indicatorsList, value.indicatorChildId.toString());
      value.indicatorChild = {
        id: value.indicatorChildId,
        name: value.indicatorChildName
      };
      if (this.selectedIndicator.length > 0) {
        this.selectedIndicator[0].indicatorChild = value.indicatorChild;
        this.selectedIndicator[0].indicatorChildName = value.indicatorChildName;
        this.selectedIndicator[0].periodOffset = value.periodOffset;
        this.selectedIndicator[0].indicatorChildId = value.indicatorChildId;
        this.selectedIndicator[0].variableFormula = value.variableFormula;
      } else {
        this.selectedIndicatorsList.splice(0, 0, value);
      }

      this.selectedIndicatorsList = [...this.selectedIndicatorsList];
      this.infoModalIndicator.hide();
    } else {
      this.validateAllFormFields(this.indicatorForm);
    }
  }

  onSelect() {
    this.paramForm.setValue({
      name: this.selected[0].name,
      value: this.selected[0].value
    });

    this.infoModal.show();
  }

  onSelectVariable() {
    this.variableForm.patchValue({
      variableId: this.selectedVariable[0].variableId,
      periodOffset: this.selectedVariable[0].periodOffset,
      variableFormula: this.selectedVariable[0].variableFormula,
    });

    this.infoModalVariable.show();
  }

  onSelectIndicator() {
    this.indicatorForm.patchValue({
      indicatorChildId: this.selectedIndicator[0].indicatorChildId,
      periodOffset: this.selectedIndicator[0].periodOffset,
      variableFormula: this.selectedIndicator[0].variableFormula,
    });

    this.infoModalIndicator.show();
  }

  onDatasourceSelect() {
    this.paramDatasourceForm.setValue({
      name: this.selectedDatasource[0].name,
      description: this.selectedDatasource[0].description,
      sqlDataSourceId: this.selectedDatasource[0].sqlDataSourceId,
      sqlFieldId: this.selectedDatasource[0].sqlFieldId,
    });

    this.getDataSource(this.selectedDatasource[0].sqlDataSourceId);
    this.infoModalDatasource.show();
  }

  onSyntaxCheck({ value }: { value: IFormulation, valid: boolean }) {
    this.checkFormulaSyntax(value).subscribe();
  }

  onDeleteParam() {
    this.deleteItem(this.rows, this.selected[0], this.infoModal);
    this.rows = [...this.rows];
  }

  onDeleteDatasourceParam() {
    this.deleteItem(this.rowsDatasource, this.selectedDatasource[0], this.infoModalDatasource);
    this.rowsDatasource = [...this.rowsDatasource];
  }

  onDeleteVariable() {
    this.deleteItem(this.selectedVariablesList, this.selectedVariable[0], this.infoModalVariable);
    this.selectedVariablesList = [...this.selectedVariablesList];
  }

  onDeleteIndicator() {
    this.deleteItem(this.selectedIndicatorsList, this.selectedIndicator[0], this.infoModalIndicator);
    this.selectedIndicatorsList = [...this.selectedIndicatorsList];
  }

  private deleteItem(datasource: {}[], selected: {}, modal: ModalDirective) {
    const index = datasource.indexOf(selected, 0);

    if (index > -1) {
      datasource.splice(index, 1);
    }

    modal.hide();
    this._ns.success('El cambio fue realizado!');
  }

  onDataSourceChange(event: any) {
    this.getDataSource(event.value);
  }

  onChangeHierarchy(event: any) {
    this.setHierarchy(event.value);
  }

  onFormulaSelect() {
    this.setFormulaVariables();
  }

  /*
  private completeSelectedList(dictionary: Array<{ key: string, value: string }>, list: Array<{ id: number, name: string }>) {
    if (dictionary && list && list.length > 0) {
      list.forEach(x => x.name = this._us.getElementValueFromDictionary(dictionary, x.id.toString()));
    }
  }
  */

  private setHierarchy(id: number, selected?: number) {
    if (id) {
      this._hierarchyService.getHierarchyStructureTree(id).subscribe(
        data => {
          this.hierarchy = data.nodes;
          this._us.expandTree(this.hierarchy);
          if (selected) {
            this.selectedNode = this._hierarchyService.findStructureNodeById(data.nodes, selected);
          }
        }
      );
    }
  }

  private getDataSource(id: number) {
    this._dataSourceService.getSqlDataSourceFieldsDictionary(id).subscribe(
      data => {
        this.fieldsList = data;
      });
  }

  private setFormulaVariables() {
    this.formulaVariables = [];
    this.selectedIndicatorsList.forEach(x => this.formulaVariables.push({ id: 1, name: x.variableFormula, value: x.indicatorChildName }));
    this.selectedVariablesList.forEach(x => this.formulaVariables.push({ id: 1, name: x.variableFormula, value: x.variable.name }));
    this.rows.forEach(x => this.formulaVariables.push({ id: 1, name: x.name, value: x.name }));
    this.rowsDatasource.forEach(x => this.formulaVariables.push({ id: 1, name: x.name, value: x.name }));
  }

  private checkFormulaSyntax(value: IFormulation): Observable<boolean> {
    if (this.selectedIndicatorsList.length === 0 && this.selectedVariablesList.length === 0) {
      this._ns.warning('La fórmula debe contener la menos un indicador o una variable');
      return Observable.create(() => false);
    }

    if (value.formula.length === 0) {
      this.validateAllFormFields(this.detailForm);
      return Observable.create(() => false);
    }

    this.setFormulaVariables();
    const formula: IFormula = { id: 0, name: '', body: value.formula, parameters: this.formulaVariables };
    return this._cs.checkFormula(formula).pipe(map(
      data => {
        if (data.isValid) {
          if (!data.parameters ||
            (data.parameters.filter(x => this.selectedIndicatorsList.find(y => y.variableFormula === x.name)).length === 0 &&
              data.parameters.filter(x => this.selectedVariablesList.find(y => y.variableFormula === x.name)).length === 0)) {
            this._ns.warning('La fórmula debe contener la menos un indicador o una variable');
            return false;
          }
          this._ns.success('Sintaxis correcta!');
          return true;
        } else {
          this._ns.warning(`Fórmula inválida:\n ${data.error}`);
        }
        return false;
      })
    );
  }

  onSelectVariableFormula(variable: IParameterFormula) {
    this.detailForm.patchValue({
      formula: ( this.detailForm.value.formula || '' ) + variable.name + ' '
    });
  }

  private getPeriodLabel(periodicity: {name: string}): string {
    return  `Periodo actual (${periodicity.name}) menos`;
  }
}
