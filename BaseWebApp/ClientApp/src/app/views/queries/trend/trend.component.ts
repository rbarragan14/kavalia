import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from '@app/core/services/models';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.scss']
})

export class TrendComponent  extends BaseFormComponent
implements OnInit {

  // lineChart
  public brandInfo = '#63c2de';
  public brandSuccess = '#4dbd74';

  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Valor total pagado'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Valor resultado indicador'},
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

  show = false;
  searchForm: FormGroup;
  logs: Array<any> = [];

  positionElements: Array<{ id: string, itemName: string }> = [];
  identificationTypeList: Array<{ key: string, value: string }> =
  [
    { value: 'NIT', key: '1' },
    { value: 'Cédula', key: '2' },
  ];

  constructor(private _formBuilder: FormBuilder,
    private _catalogService: CatalogService) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PSC').subscribe(
      data => this.positionElements = this.dictToMultiOptions(data)
    );

    const today: Date = new Date(new Date().toDateString());
    let tomorrow: Date = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow = new Date(tomorrow.toDateString());

    this.searchForm = this._formBuilder.group({
      startDate: [today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
      positions: [null],
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    // if (valid) {
      this.show = true;
      this.mockData();
    // }
  }

  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
    return rgba;
  }

  mockData() {
    this.logs = [
      {
        position: 'Director',
        schema: 'Esquema 1',
        thresold: 1,
        variableElement: 'Elemento 1',
        group: 'Bogotá',
        indicator: 'Indicador 1',
        identificationType: 'Cédula',
        indentification: '100839291',
        fullName: 'Juan García',
        period: 'Enero - 2018',
        valuePaid: 99.34,
        totalValue: 102.12,
        paymentTable: 'Tabla 1'
      },
      {
        position: 'Director',
        schema: 'Esquema 2',
        thresold: 1,
        variableElement: 'Elemento 1',
        group: 'Bogotá',
        indicator: 'Indicador 1',
        identificationType: 'Cédula',
        indentification: '90857993',
        fullName: 'Carlos Arias',
        period: 'Enero - 2018',
        valuePaid: 92.34,
        totalValue: 202.12,
        paymentTable: 'Tabla 1'
      },
    ];
  }

}
