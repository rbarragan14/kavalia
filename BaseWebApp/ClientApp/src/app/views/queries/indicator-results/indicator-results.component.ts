import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndicatorService } from '@app/core/services/models';

@Component({
  selector: 'app-indicator-results',
  templateUrl: './indicator-results.component.html',
  styleUrls: ['./indicator-results.component.scss']
})
export class IndicatorResultsComponent
  extends BaseFormComponent
  implements OnInit {

  searchForm: FormGroup;
  logs: Array<any> = [];
  show = false;
  thresoldQuery = false;
  indicatorList: Array<{ key: string, value: string }> = [];

  // lineChart
  public brandInfo = '#63c2de';
  public brandSuccess = '#4dbd74';

  public lineChartData: Array<any> = [
    {data: [45, 59, 90, 81, 56, 55, 40], label: 'Indicador 1'},
    {data: [38, 58, 2, 19, 66, 97, 40], label: 'Indicador 2'},
  ];
  public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: this.brandInfo,
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: this.convertHex(this.brandSuccess, 10),
      borderColor: this.brandSuccess,
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  // lineChart


  constructor(private _formBuilder: FormBuilder, private _indicatorService: IndicatorService) {
    super();
  }

  ngOnInit() {
    const today: Date = new Date(new Date().toDateString());
    let tomorrow: Date = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow = new Date(tomorrow.toDateString());

    this._indicatorService.getIndicatorDictionary().subscribe(
      data => {
        this.indicatorList = data;
      }
    );

    this.searchForm = this._formBuilder.group({
      startDate: [today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
      indicator: [null, [Validators.required]],
      thresold: [false, [Validators.required]],
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.thresoldQuery = value.thresold;
    this.show = true;
    this.mockData();
  }

  mockData() {
    this.logs = [
      {
        indicator: 'Indicador 1',
        hierarchy: 'Bogotá',
        validationDate: '2018-04-01',
        thresoldMin: 12,
        thresoldMax: 45,
        result: '89',
        semaphore: 'red',
      },
      {
        indicator: 'Indicador 2',
        hierarchy: 'Bogotá',
        validationDate: '2018-04-01',
        thresoldMin: 1,
        thresoldMax: 4,
        result: '8',
        semaphore: 'red',
      },
      {
        indicator: 'Indicador 3',
        hierarchy: 'Sur',
        validationDate: '2018-04-02',
        thresoldMin: 12,
        thresoldMax: 455,
        result: '300',
        semaphore: 'green',
      },
    ];
  }

  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
    return rgba;
  }

}
