import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { IVariable, DataService } from '@app/core';
import { DataSourceService } from '@app/core/services/models';

@Component({
  selector: 'app-variables-details',
  templateUrl: './variables-details.component.html',
  styleUrls: ['./variables-details.component.scss']
})
export class VariablesDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  operatorsList: Array<{ key: string, value: string }> =
    [
      { value: 'Ninguno', key: '0' },
      { value: 'Conteo', key: '1' },
      { value: 'Suma', key: '2' },
      { value: 'Promedio', key: '3' },
      { value: 'Mínimo', key: '4' },
      { value: 'Máximo', key: '5' },
    ];

  sqlDatasourcesList: Array<{ key: string, value: string }>;
  fileDatasourcesList: Array<{ key: string, value: string }>;

  sqlFieldsList: Array<{ key: string, value: string }>;
  fileFieldsList: Array<{ key: string, value: string }>;

  item: IVariable = null;
  detailForm: FormGroup;
  editingStatus = false;
  showGroupField = false;
  versionNumber = 1;
  newVersion = false;
  currentId = 0;
  sqlTypeSelected = false;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _dataSourceService: DataSourceService,
    private _ns: AppNotificationsService
  ) {
    super();
  }

  sourceTypeList: Array<{ key: string, value: string }> =
    [
      { value: 'SQL', key: '1' },
      { value: 'Archivo', key: '2' },
    ];

  ngOnInit() {
    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'version');
    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      version: [{value: this.versionNumber, disabled: true}],
      description: [null, [Validators.required]],
      sqlFieldId: [null],
      sqlDataSourceId: [null],
      fileFieldId: [null],
      fileDataSourceId: [null],
      operatorId: [null, [Validators.required]],
      activeStatus: [false, [Validators.required]],
      groupPositions: [false, [Validators.required]],
      sourceTypeId: [null, [Validators.required]],
      sqlFieldGroupId: [null],
      fileFieldGroupId: [null],
      slqSentence: [{ value: '-', disabled: true }],
    });
  }

  onSubmit({ value, valid }: { value: IVariable, valid: boolean }) {
    if (valid) {
      value.version = this.versionNumber;
      if (this.editingStatus) {
        this._dataService.post(`/api/indicator/variable/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/indicator/variable', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onReturn() {
    this._router.navigate(['/indicators/variables']);
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  getItem(id: number) {
    this._dataService.get<IVariable>(`/api/indicator/variable/${id}`).subscribe(
      data =>  {
        this.versionNumber = this.newVersion ? data.version + 1 : data.version;
        this.item = data;
        this.detailForm.patchValue({
          name: this.item.name,
          version: this.versionNumber,
          description: this.item.description,
          activeStatus: this.item.activeStatus,
          groupPositions: this.item.groupPositions,
          sqlFieldId: this.item.sqlFieldId,
          sqlDataSourceId: this.item.sqlDataSourceId,
          sqlFieldGroupId: this.item.sqlFieldGroupId,
          fileFieldId: this.item.fileFieldId,
          fileDataSourceId: this.item.fileDataSourceId,
          fileFieldGroupId: this.item.fileFieldGroupId,
          operatorId: this.item.operatorId,
          sourceTypeId: this.item.sourceTypeId
        });

        this.showGroupField = data.groupPositions;
        this.onChangeAgrupar({ checked: this.item.groupPositions});
        this.getDataSources(this.item.sourceTypeId);

        if (this.sqlTypeSelected) {
          this.getSqlDataSourceFields(this.item.sqlDataSourceId);
        } else {
          this.getFileDataSourceFields(this.item.fileDataSourceId);
        }
      }
    );
  }

  onChangeAgrupar(event: any) {
    this.showGroupField = event.checked;
    this.setRequired(this.detailForm.controls['sqlFieldGroupId'], this.sqlTypeSelected && this.showGroupField );
    this.setRequired(this.detailForm.controls['fileFieldGroupId'], !this.sqlTypeSelected && this.showGroupField);
  }

  onDataSourceTypeChange(event: any) {
    this.getDataSources(event.value);
  }

  onDataSourceChange(event: any) {
    this.getSqlDataSourceFields(event.value);
  }

  onFileDataSourceChange(event: any) {
    this.getFileDataSourceFields(event.value);
  }

  private getDataSources(type: number) {
    this.sqlTypeSelected = type.toString() === '1';
    this.setRequired(this.detailForm.controls['sqlFieldId'], this.sqlTypeSelected);
    this.setRequired(this.detailForm.controls['sqlDataSourceId'], this.sqlTypeSelected);
    this.setRequired(this.detailForm.controls['fileFieldId'], !this.sqlTypeSelected);
    this.setRequired(this.detailForm.controls['fileDataSourceId'], !this.sqlTypeSelected);
    if (this.sqlTypeSelected) {
      this.getSqlDataSources();
    } else {
      this.getFileDataSources();
    }
  }

  private getSqlDataSources() {
    if (!this.sqlDatasourcesList) {
      this._dataSourceService.getSqlDataSourcesDictionary().subscribe(
        data => this.sqlDatasourcesList = data
      );
    }
  }

  private getFileDataSources() {
    if (!this.fileDatasourcesList) {
      this._dataSourceService.getFileDataSourceDictionary().subscribe(
        data => this.fileDatasourcesList = data
      );
    }
  }

  private getSqlDataSourceFields(id: number) {
    this._dataSourceService.getSqlDataSourceFieldsDictionary(id).subscribe(
      data => this.sqlFieldsList = data
    );
  }

  private getFileDataSourceFields(id: number) {
    this._dataSourceService.getFileDataSourceFieldsDictionary(id).subscribe(
      data => this.fileFieldsList = data
    );
  }

}
