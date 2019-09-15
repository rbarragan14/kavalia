import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';
import { ICompensationResult, UtilityService, IBaseReportParams } from '@app/core';
import { CatalogService, CompensationService } from '@app/core/services/models';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})

export class IndividualComponent
  extends BaseFormComponent
  implements OnInit {

  positionElements: Array<{ id: string, itemName: string }> = [];
  logs: Array<ICompensationResult> = [];
  searchForm: FormGroup;
  schemaList: Array<{ key: string, value: string }>;
  userIdentification = localStorage.getItem('userId');

  identificationTypeList: Array<{ key: string, value: string }> =
    [
      { value: 'NIT', key: '1' },
      { value: 'Cédula de Ciudadanía', key: '2' },
    ];

  constructor(
    private _formBuilder: FormBuilder,
    private _us: UtilityService,
    private _cs: CompensationService,
    private _catalogService: CatalogService) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PSC').subscribe(
      data => this.positionElements = this.dictToMultiOptions(data)
    );

    this._cs.getCompensationSchemaDictionary().subscribe(
      data => this.schemaList = data.map(item => {
        const r = { key: item.value, value: item.value };
        return r;
      })
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
      identification: [{value: this.userIdentification, disabled: readOnly}],
      schema: [null],
      positions: [null],
    });
  }

  onSubmit({ value, valid }: { value: IBaseReportParams, valid: boolean }) {
    this.mockData(value);
  }

  mockData(value: IBaseReportParams) {
    this.logs = this._us.getMockDataReport(value.startDate, value.endDate, this.userIdentification || value.identification, value.schema);
  }
}
