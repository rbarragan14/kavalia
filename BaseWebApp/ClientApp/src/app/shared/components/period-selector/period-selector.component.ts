import { Component, Input, forwardRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { UtilityService } from '@app/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodSelectorComponent),
      multi: true
    }
  ]
})

export class PeriodSelectorComponent implements ControlValueAccessor {

  @ViewChild('hierarchySelectModal') infoModalPaymentVariable: ModalDirective;
  @Input() showHierarchy = true;

  detailForm: FormGroup;
  monthList: Array<{ key: string, value: string }>;
  quarterList: Array<{ key: string, value: string }>;

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
    private _us: UtilityService) {
      this.detailForm = this._formBuilder.group({
        day: [null],
        year: [2018],
        month: ['1'],
        quarter: [null],
        hierarchy: [null],
      });
      this.monthList = this._us.monthList;
      this.quarterList = this._us.quarterList;
  }

  onChange = (rating: string) => {};
  onTouched = () => {};

  set value(val) {
    this.onChange(val);
    this.onTouched();
  }

  get value(): string {
    return this.detailForm.get('year').value + '-' + this.detailForm.get('month').value;
  }

  change(event: any) {
    this.onChange(this.value);
  }

  writeValue(value: string) {
    if (value) {
      const split = value.split('-');
      if (split.length === 2) {
        this.detailForm.patchValue({ year: split[0], month: split[1] });
      }
    }
    this.onChange(this.value);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  onHierarcySelect() {
    this.infoModalPaymentVariable.show();
  }

  onChangeHierarchy(event: any) {
    if (event.value === '1') {
      this.activeNodes = this.nodes;
    }
  }
}
