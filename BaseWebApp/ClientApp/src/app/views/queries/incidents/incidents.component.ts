import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent
  extends BaseFormComponent
  implements OnInit {

  indicatorList: Array<{ key: string, value: string }> =
  [
    { value: 'Indicador 1', key: '1' },
    { value: 'Indicador 2', key: '2' },
    { value: 'Indicador 3', key: '3' },
  ];

  statusList: Array<{ key: string, value: string }> =
  [
    { value: 'Abierto', key: '1' },
    { value: 'Cerrado', key: '2' },
    { value: 'Re-abierto', key: '3' },
  ];

  searchForm: FormGroup;
  logs: Array<any> = [];

  constructor(private _formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    const today: Date = new Date(new Date().toDateString());
    let tomorrow: Date = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow = new Date(tomorrow.toDateString());

    this.searchForm = this._formBuilder.group({
      startDate: [today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
      indicator: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.mockData();
  }

  mockData() {
    this.logs = [
      {
        indicator: 'Indicador 1',
        hierarchy: 'Bogotá',
        validationDate: '2018-04-01',
        result: '23212',
        semaphore: 'green',
        generationDate: '2018-04-01',
        resolution: 'N/A',
        status: 'Abierta',
      },
      {
        indicator: 'Indicador 2',
        hierarchy: 'Bogotá',
        validationDate: '2018-04-01',
        result: '5423',
        semaphore: 'red',
        generationDate: '2018-04-01',
        resolution: 'N/A',
        status: 'Abierta',
      },
      {
        indicator: 'Indicador 3',
        hierarchy: 'Sur',
        validationDate: '2018-04-02',
        result: '98654',
        semaphore: 'red',
        generationDate: '2018-04-01',
        resolution: 'N/A',
        status: 'Cerrada',
      },
    ];
  }
}
