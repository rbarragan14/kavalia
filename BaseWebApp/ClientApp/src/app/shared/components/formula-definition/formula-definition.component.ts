import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppNotificationsService } from '../../../core/services/app-notifications.service';
import { IVariable } from '../../../core/models/indicators/Variable';
import { IParameterFormula } from '@app/core';

@Component({
  selector: 'app-formula-definition',
  templateUrl: './formula-definition.component.html',
  styleUrls: ['./formula-definition.component.scss']
})
export class FormulaDefinitionComponent implements OnInit {

  @ViewChild('infoModal') infoModal: ModalDirective;
  @ViewChild('infoModalDatasource') infoModalDatasource: ModalDirective;

  detailForm: FormGroup;
  paramForm: FormGroup;
  paramDatasourceForm: FormGroup;

  variables: TreeNode[];
  indicators: TreeNode[];
  hierarchy: TreeNode[];
  formulaVariables: IParameterFormula[] = [];

  selected: IParameterFormula[] = [];
  rows: IParameterFormula[] = [];
  rowsDatasource: IVariable[] = [];

  selectedDatasource: IVariable[] = [];

  hierarchyList: Array<{ key: string, value: string }> =
    [
      { value: 'Jerarquía 1', key: '1' },
      { value: 'Jerarquía 2', key: '2' },
    ];

  fieldsList: Array<{ key: string, value: string }> =
    [
      { value: 'Campo 1', key: '1' },
      { value: 'Campo 2', key: '2' },
      { value: 'Campo 3', key: '3' },
    ];

  datasourcesList: Array<{ key: string, value: string }> =
    [
      { value: 'Fuente 1', key: '1' },
      { value: 'Fuente 2', key: '2' },
      { value: 'Fuente 3', key: '3' },
    ];

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) { }

  ngOnInit() {
    this.mockData();
    this.detailForm = this._formBuilder.group({
      formula: [null, [Validators.required]],
      formulaValidation: [null, [Validators.required]],
      hierarchy: [null, [Validators.required]],
    });

    this.paramForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

    this.paramDatasourceForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      datasource: [null, [Validators.required]],
      field: [null, [Validators.required]],
    });
  }

  onClickModal() {
    this.selected = [];
    this.paramForm.setValue({
      name: '',
      value: ''
    });

    this.infoModal.show();
  }

  onClickDatasourceModal() {
    this.selectedDatasource = [];
    this.paramDatasourceForm.setValue({
      name: '',
      description: '',
      datasource: null,
      field: null,
    });

    this.infoModalDatasource.show();
  }

  onSelect() {
    this.paramForm.setValue({
      name: this.selected[0].name,
      value: this.selected[0].value
    });

    this.infoModal.show();
  }

  onDatasourceSelect() {
    this.paramDatasourceForm.setValue({
      name: this.selectedDatasource[0].name,
      description: this.selectedDatasource[0].description,
      datasource: this.selectedDatasource[0].sqlDataSourceId,
      field: this.selectedDatasource[0].sqlFieldId,
    });

    this.infoModalDatasource.show();
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

  onSubmitDatasourceParam({ value, valid }: { value: IVariable, valid: boolean }) {
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

  onDeleteParam() {
    const index = this.rows.indexOf(this.selected[0], 0);
    if (index > -1) {
      this.rows.splice(index, 1);
      this.rows = [...this.rows];
    }

    this.infoModal.hide();
    this._ns.success('El cambio fue realizado!');
  }

  onDeleteDatasourceParam() {
    const index = this.rowsDatasource.indexOf(this.selectedDatasource[0], 0);
    if (index > -1) {
      this.rowsDatasource.splice(index, 1);
      this.rowsDatasource = [...this.rowsDatasource];
    }

    this.infoModalDatasource.hide();
    this._ns.success('El cambio fue realizado!');
  }

  onSyntaxCheck() {
    this._ns.success('Sintaxis correcta!');
  }

  mockData() {
    this.variables = [
      {
        'label': 'Productos',
        'data': 'Documents Folder',
        'expandedIcon': 'fa-folder-open',
        'collapsedIcon': 'fa-folder',
        'selectable': false,
        'children': [{
          'label': 'Grupo 1',
          'data': 'Work Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Variable 1',
              'icon': 'fa fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Variable 2',
              'icon': 'fa fa-file-code-o',
              'data': 'Resume Document'
            }
          ]
        },
        {
          'label': 'Grupo 2',
          'data': 'Home Folder',
          'expandedIcon': 'fa fa-folder-open',
          'collapsedIcon': 'fa fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Variable 3',
              'icon': 'fa fa-file-code-o',
              'data': 'Invoices for this month'
            }
          ]
        }]
      },
      {
        'label': 'Variables',
        'data': 'Documents Folder',
        'expandedIcon': 'fa fa-folder-open',
        'collapsedIcon': 'fa fa-folder',
        'selectable': false,
        'children': [{
          'label': 'Grupo 3',
          'data': 'Work Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Variable 4',
              'icon': 'fa fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Variable 5',
              'icon': 'fa fa-file-code-o',
              'data': 'Resume Document'
            }
          ]
        },
        {
          'label': 'Grupo 4',
          'data': 'Home Folder',
          'expandedIcon': 'fa fa-folder-open',
          'collapsedIcon': 'fa fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Variable 6',
              'icon': 'fa fa-file-code-o',
              'data': 'Invoices for this month'
            }
          ]
        }]
      },
    ];

    this.indicators = [
      {
        'label': 'Productos',
        'data': 'Documents Folder',
        'expandedIcon': 'fa-folder-open',
        'collapsedIcon': 'fa-folder',
        'selectable': false,
        'children': [{
          'label': 'Grupo 1',
          'data': 'Work Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Indicador 1',
              'icon': 'fa fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Indicador 2',
              'icon': 'fa fa-file-code-o',
              'data': 'Resume Document'
            }
          ]
        },
        {
          'label': 'Grupo 2',
          'data': 'Home Folder',
          'expandedIcon': 'fa fa-folder-open',
          'collapsedIcon': 'fa fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Indicador 3',
              'icon': 'fa fa-file-code-o',
              'data': 'Invoices for this month'
            }
          ]
        }]
      },
      {
        'label': 'Indicadores',
        'data': 'Documents Folder',
        'expandedIcon': 'fa fa-folder-open',
        'collapsedIcon': 'fa fa-folder',
        'selectable': false,
        'children': [{
          'label': 'Grupo 3',
          'data': 'Work Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Indicador 4',
              'icon': 'fa fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Indicador 5',
              'icon': 'fa fa-file-code-o',
              'data': 'Resume Document'
            }
          ]
        },
        {
          'label': 'Grupo 4',
          'data': 'Home Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Indicador 6',
              'icon': 'fa fa-file-code-o',
              'data': 'Invoices for this month'
            }
          ]
        }]
      },
    ];

    this.hierarchy = [
      {
        label: 'País',
        data: {
          id: 1,
          name: 'Región',
          value: 'Antioquia',
          revisor: false
        },
        children: [
          {
            label: 'Región',
            data: {
              id: 2,
              name: 'Ciudad',
              value: 'Medellin'
            },
            children: [
              {
                label: 'Ciudad',
                data: {
                  id: 5,
                  name: 'Ciudad',
                  value: 'Chia'
                }
              }
            ]
          }
        ]
      }
    ];

    this.formulaVariables = [
      { id: 1, name: 'AAAA', value: 'Variable 1' },
      { id: 2, name: 'AAAA1', value: 'Variable 2' },
      { id: 3, name: 'AAAA2', value: 'Variable 3' },
    ];
  }

}
