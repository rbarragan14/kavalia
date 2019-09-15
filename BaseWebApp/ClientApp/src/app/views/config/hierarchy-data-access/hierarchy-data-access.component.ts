import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-hierarchy-data-access',
  templateUrl: './hierarchy-data-access.component.html',
  styleUrls: ['./hierarchy-data-access.component.scss']
})
export class HierarchyDataAccessComponent
  extends BaseFormComponent
  implements OnInit {

  detailForm: FormGroup;

  hierarchyList: Array<{ key: string, value: string }> =
    [
      { value: 'Organizacional', key: '1' },
      { value: 'Producto', key: '2' },
    ];

  nodes = [
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

  nodesProduct = [
    {
      label: 'Grupo - Producto',
      data: {
        id: 1,
        name: 'Región',
        value: 'Antioquia',
        revisor: false
      },
      children: [
        {
          label: 'Producto',
          data: {
            id: 2,
            name: 'Ciudad',
            value: 'Medellin'
          },
          children: [
            {
              label: 'Sub - Producto',
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

  activeNodes: TreeNode[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _ns: AppNotificationsService) {
    super();
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      hierarchy: [null],
    });
  }

  onReturn() {
    this._router.navigate(['/config/parameters']);
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onChangeHierarchy(event: any) {
    if (event.value === '1') {
      this.activeNodes = this.nodes;
    } else {
      this.activeNodes = this.nodesProduct;
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }
}
