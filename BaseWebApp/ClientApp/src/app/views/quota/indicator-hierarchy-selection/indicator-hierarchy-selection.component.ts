import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-indicator-hierarchy-selection',
  templateUrl: './indicator-hierarchy-selection.component.html',
  styleUrls: ['./indicator-hierarchy-selection.component.scss']
})
export class IndicatorHierarchySelectionComponent
  extends BaseFormComponent
  implements OnInit {

  detailForm: FormGroup;
  indicators: TreeNode[];
  hierarchy: TreeNode[];
  selectedNode: TreeNode;

  hierarchyList: Array<{ id: string, itemName: string}> =
    [
      { itemName: 'Jerarquía 1', id: '1' },
      { itemName: 'Jerarquía 2', id: '2' },
    ];

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _router: Router) {
    super();
  }

  onSubmit() {
    if (this.detailForm.valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  ngOnInit() {
    this.mockData();
    this.detailForm = this._formBuilder.group({
      hierarchy: [null],
    });
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/']);
  }

  mockData() {
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
              'icon': 'fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Indicador 2',
              'icon': 'fa-file-code-o',
              'data': 'Resume Document'
            }
          ]
        },
        {
          'label': 'Grupo 2',
          'data': 'Home Folder',
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'selectable': false,
          'children': [
            {
              'label': 'Indicador 3',
              'icon': 'fa-file-code-o',
              'data': 'Invoices for this month'
            }
          ]
        }]
      },
      {
        'label': 'Indicadores',
        'data': 'Documents Folder',
        'expandedIcon': 'fa-folder-open',
        'collapsedIcon': 'fa-folder',
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
              'icon': 'fa-file-code-o',
              'data': 'Expenses Document'
            },
            {
              'label': 'Indicador 5',
              'icon': 'fa-file-code-o',
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
              'icon': 'fa-file-code-o',
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
  }
}
