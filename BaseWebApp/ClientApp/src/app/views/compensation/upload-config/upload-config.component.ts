import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { Validators } from '@angular/forms';
import { IUploadConfiguration, DataService, IUploadConfigurationField, ISqlField, IFileDataSourceField } from '@app/core';
import { DataSourceService } from '@app/core/services/models';

@Component({
  selector: 'app-upload-config',
  templateUrl: './upload-config.component.html',
  styleUrls: ['./upload-config.component.scss']
})
export class UploadConfigComponent
  extends BaseFormComponent
  implements OnInit {

  title: '';
  type: number;
  format: IUploadConfigurationField[] = [];
  item: IUploadConfiguration;
  sqlDatasourcesList: Array<{ key: string, value: string }>;
  fileDatasourcesList: Array<{ key: string, value: string }>;

  sqlFieldsList: Array<ISqlField>;
  fileFieldsList: Array<IFileDataSourceField>;

  sourceTypeList: Array<{ key: string, value: string }> =
    [
      { value: 'SQL', key: '1' },
      { value: 'Archivo', key: '2' },
    ];

  detailForm: FormGroup;
  sqlTypeSelected = false;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dataService: DataService,
    private _dataSourceService: DataSourceService,
    private _ns: AppNotificationsService) {
    super();
  }

  onSubmit({ value, valid }: { value: IUploadConfiguration, valid: boolean }) {
    if (this.detailForm.valid && this.validFormat()) {
      this.item.sourceTypeId = value.sourceTypeId;
      this.item.fileName = !this.sqlTypeSelected ? value.fileName : null;
      this.item.sqlDataSourceId = this.sqlTypeSelected ? value.sqlDataSourceId : null;
      this.item.fileDataSourceId = !this.sqlTypeSelected ? value.fileDataSourceId : null;

      this._dataService.post(`/api/compensation/upload-conf/${this.type}`, this.item).subscribe(
        () => this.onSuccess()
      );
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

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      sourceTypeId: [null, [Validators.required]],
      fileDataSourceId: [null],
      fileName: [null],
      sqlDataSourceId: [null]
    });

    this._route.data.subscribe(data => {
      this.title = data.title;
      this.type = data.UploadType;
      this.getItem(data.UploadType);
    });
  }

  onDataSourceTypeChange(event: any) {
    this.getDataSources(event.value);
  }

  onFileDataSourceChange(event: any) {
    this.getFileDataSourceFields(event.value);
  }

  onDataSourceChange(event: any) {
    this.getSqlDataSourceFields(event.value);
  }

  private getDataSources(type: number) {
    this.sqlTypeSelected = type.toString() === '1';
    this.setRequired(this.detailForm.controls['fileDataSourceId'], !this.sqlTypeSelected);
    this.setRequired(this.detailForm.controls['fileName'], !this.sqlTypeSelected);
    this.setRequired(this.detailForm.controls['sqlDataSourceId'], this.sqlTypeSelected);
    if (this.sqlTypeSelected) {
      this.getSqlDataSources();
    } else {
      this.getFileDataSources();
    }
  }

  private getSqlDataSourceFields(id: number) {
    this._dataSourceService.getSqlDataSourceFields(id).subscribe(
      data => {
        this.sqlFieldsList = data;
        this.format.filter(x => x.sqlDataSourceFieldId).forEach(x => {
          const selected = this.sqlFieldsList.find(s => s.id === x.sqlDataSourceFieldId);
          if (selected) {
            x.sqlDataSourceField = selected;
          }
        });
      });
  }

  private getFileDataSourceFields(id: number) {
    this._dataSourceService.getFileDataSourceFields(id).subscribe(
      data => {
        this.fileFieldsList = data;
        this.format.filter(x => x.fileDataSourceFieldId).forEach(x => {
          const selected = this.fileFieldsList.find(s => s.id === x.fileDataSourceFieldId);
          if (selected) {
            x.fileDataSourceField = selected;
          }
        });
      });
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

  private getItem(uploadType: number) {
    this._dataService.get<IUploadConfiguration>(`/api/compensation/upload-conf/${uploadType}`).subscribe(
      data => {
        this.item = data;
        this.format = data.uploadConfigurationFields;
        this.detailForm.patchValue({
          sourceTypeId: this.item.sourceTypeId,
          sqlDataSourceId: this.item.sqlDataSourceId,
          fileDataSourceId: this.item.fileDataSourceId,
          fileName: this.item.fileName
        });

        this.getDataSources(this.item.sourceTypeId);
        if (this.item.sqlDataSourceId) {
          this.getSqlDataSourceFields(this.item.sqlDataSourceId);
        } else if (this.item.fileDataSourceId) {
          this.getFileDataSourceFields(this.item.fileDataSourceId);
        }
      }
    );
  }

  private validFormat(): boolean {
    if (this.format.length === 0) {
      this._ns.warning('Definición inválida, se debe incluir por lo menos un dato');
      return false;
    }

    if (this.format.some(element => {
      return ((!this.sqlTypeSelected && !element.fileDataSourceField) || (this.sqlTypeSelected && !element.sqlDataSourceField));
    })) {
      this._ns.warning('Definición inválida!');
      return false;
    }

    return true;
  }
}
