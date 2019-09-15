import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormBuilder } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { UtilityService, IWeightDay } from '@app/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-weight-days',
  templateUrl: './weight-days.component.html',
  styleUrls: ['./weight-days.component.css']
})
export class WeightDaysComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('hierarchySelectModal') infoModalPaymentVariable: ModalDirective;
  detailForm: FormGroup;
  showTable = false;

  monthList: Array<{ key: string, value: string }>;
  quarterList: Array<{ key: string, value: string }>;

  data: IWeightDay[][];
  cols: any[];

  hierarchyList: Array<{ key: string, value: string }> = [
    { value: 'Organizacional', key: '1' },
    { value: 'Producto', key: '2' },
  ];
  nodes = [
    {
      label: 'País - Colombia',
      data: {
        id: 1,
        name: 'País',
        value: 'Colombia',
        revisor: false
      },
      children: [
        {
          label: 'Región - Antioquia',
          data: {
            id: 1,
            name: 'Región',
            value: 'Antioquia',
            revisor: false
          },
          children: [
            {
              label: 'Ciudad - Medellin',
              data: {
                id: 2,
                name: 'Ciudad',
                value: 'Medellin'
              }
            },
            {
              label: 'Cuidad - Envigado',
              data: {
                id: 3,
                name: 'Cuidad',
                value: 'Envigado'
              }
            }
          ]
        },
        {
          label: 'Región - Cundinamarca',
          data: {
            id: 4,
            name: 'Región',
            value: 'Cundinamarca'
          },
          children: [
            {
              label: 'Ciudad - Chia',
              data: {
                id: 5,
                name: 'Ciudad',
                value: 'Chia'
              }
            },
            {
              label: 'Ciudad - Bogotá',
              data: {
                id: 6,
                name: 'Cuidad',
                value: 'Bogotá'
              },
              children: [
                {
                  label: 'Localidad - Usaquén',
                  data: {
                    id: 7,
                    name: 'Localidad',
                    value: 'Usaquén'
                  }
                }
              ]
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

    this.cols = [
      { header: 'Lu' },
      { header: 'Ma' },
      { header: 'Mi' },
      { header: 'Ju' },
      { header: 'Vi' },
      { header: 'Sa' },
      { header: 'Do' }
    ];
  }

  onSubmit() {
    this.onSuccess();
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/']);
  }

  onHierarcySelect() {
    this.infoModalPaymentVariable.show();
  }

  onChangeHierarchy(event: any) {
    if (event.value === '1') {
      this.activeNodes = this.nodes;
    } else {
      this.activeNodes = this.nodesProduct;
    }
  }

  onSearch() {
    const year = this.detailForm.get('year').value;
    const month = this.detailForm.get('month').value;

    this.data = this.getInitialData(year, month);
    this.showTable = true;
  }

  private getInitialData(year: number, month: number): IWeightDay[][] {
    const jsMonth = month - 1;
    const initialDate = new Date(year, jsMonth);
    const data: IWeightDay[][] = [];

    do {
      const weekData: IWeightDay[] = Array(7);
      let dayNumber: number;

      do {
        dayNumber = (initialDate.getDay() + 6) % 7;
        weekData[dayNumber] = { dayNumber: initialDate.getDate() };
        initialDate.setDate(initialDate.getDate() + 1);
      } while (dayNumber !== 6 && jsMonth === initialDate.getMonth());

      data.push(weekData);
    } while (jsMonth === initialDate.getMonth());

    return data;
  }
}
