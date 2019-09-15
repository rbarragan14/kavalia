import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from '@app/core/services/models';
import { UtilityService, IBaseReportParams } from '@app/core';

@Component({
  selector: 'app-individual-traceability',
  templateUrl: './individual-traceability.component.html',
  styleUrls: ['./individual-traceability.component.scss']
})

export class IndividualTraceabilityComponent extends BaseFormComponent
  implements OnInit {

  positionElements: Array<{ id: string, itemName: string }> = [];
  logs: Array<any> = [];
  searchForm: FormGroup;
  userIdentification = localStorage.getItem('userId');

  identificationTypeList: Array<{ key: string, value: string }> =
  [
    { value: 'NIT', key: '1' },
    { value: 'Cédula', key: '2' },
  ];

  constructor(private _formBuilder: FormBuilder,
    private _us: UtilityService,
    private _catalogService: CatalogService) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PSC').subscribe(
      data => this.positionElements = this.dictToMultiOptions(data)
    );

    const today: Date = new Date(2018, 6, 1);
    const tomorrow: Date = new Date(2018, 9, 30);

    var readOnly = true;
    if (this.userIdentification !== '54000902')
    {
      readOnly = false;
      this.userIdentification = null;
    }

    this.searchForm = this._formBuilder.group({
      startDate: [today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
      identificationType: [null, [Validators.required]],
      identification: [{value: this.userIdentification, disabled: readOnly}],
      positions: [null],
    });
  }

  onSubmit({ value, valid }: { value: IBaseReportParams, valid: boolean }) {
    this.mockData(value);
  }

  mockData(value: IBaseReportParams) {
    this.logs = this._us.getMockDataTraceabilityReport(value.startDate, value.endDate, this.userIdentification || value.identification, value.schema);
  }
}
