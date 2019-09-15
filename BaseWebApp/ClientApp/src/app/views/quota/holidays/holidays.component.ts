import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { UtilityService } from '@app/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('hierarchySelectModal') hierarchySelectModal: ModalDirective;

  selectedNode: TreeNode;
  es: any;
  detailForm: FormGroup;
  holidays: Array<Date> = [];

  hierarchyList: Array<{ key: string, value: string }> = [
    { value: 'Geográfica', key: '1' },
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

  activeNodes: TreeNode[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _us: UtilityService,
    private _router: Router) {
    super();
    this.es = this._us.calendarSpanish;
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      hierarchy: [null],
      hierarchyText: [{value: null, disabled: true}],
    });
  }

  onHierarcySelect() {
    this.hierarchySelectModal.show();
  }

  onChangeHierarchy(event: any) {
    if (event.value === '1') {
      this.activeNodes = this.nodes;
    }
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

  onSelectDate(value: Date) {
    const date = this.holidays.find(item => item.toISOString() === value.toISOString());
    if (!date) {
      this.holidays.push(value);
    } else {
      const index = this.holidays.indexOf(date);
      this.holidays.splice(index, 1);
    }
  }

  isHoliday(value: any): boolean {
    return !!this.holidays.find(item => {
      return item.getDate() === value.day
        && item.getFullYear() === value.year
        && item.getMonth() === value.month;
    });
  }

  onSelectDateHierarchy() {
    if (this.selectedNode) {
      this.detailForm.patchValue({hierarchyText: this.selectedNode.label});
    }
    this.hierarchySelectModal.hide();
  }
}
