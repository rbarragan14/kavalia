import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { UtilityService } from '@app/core';

@Component({
  selector: 'app-quota-review',
  templateUrl: './quota-review.component.html',
  styleUrls: ['./quota-review.component.scss']
})
export class QuotaReviewComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('hierarchySelectModal') infoModalPaymentVariable: ModalDirective;
  detailForm: FormGroup;
  showTable = false;

  monthList: Array<{ key: string, value: string }>;
  quarterList: Array<{ key: string, value: string }>;

  hierarchyList: Array<{ key: string, value: string }> = [
    { value: 'Organizacional', key: '1' },
    { value: 'Producto', key: '2' },
  ];
  nodes = [
    {
      label: 'País',
      data: {
        id: 1,
        name: 'País'
      },
      children: [
        {
          label: 'Región',
          data: {
            id: 2,
            name: 'Región'
          },
          children: [
            {
              label: 'Ciudad',
              data: {
                id: 5,
                name: 'Ciudad'
              }
            }
          ]
        }
      ]
    }
  ];
  nodesProduct = [
    {
      label: 'Producto',
      data: {
        id: 1,
        name: 'Producto'
      },
      children: [
        {
          label: 'Sub-Producto',
          data: {
            id: 2,
            name: 'Sub-Producto'
          },
        }
      ]
    }
  ];
  activeNodes: TreeNode[] = [];

  tableNodes = [
    {
      label: 'País - Colombia',
      data: {
        id: 1,
        name: 'País',
        value: 'TOTAL',
        revisor: false
      }
    },
    {
      label: 'País - Colombia',
      data: {
        id: 1,
        name: 'País',
        value: 'AVVT01',
        revisor: false
      }
    },
  ];

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _us: UtilityService,
    private _router: Router) {
    super();
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      day: [null],
      year: [2018],
      month: ['1'],
      quarter: [null],
      hierarchy: [null],
    });

    this.monthList = this._us.monthList;
    this.quarterList = this._us.quarterList;
    this._us.expandTree(this.tableNodes);
  }

  onHierarcySelect() {
    this.infoModalPaymentVariable.show();
  }

  onSearch() {
    this.showTable = true;
  }

  onChangeHierarchy(event: any) {
    if (event.value === '1') {
      this.activeNodes = this.nodes;
    } else {
      this.activeNodes = this.nodesProduct;
    }
  }

  onSubmit() {
    if (this.detailForm.valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/']);
  }
}
