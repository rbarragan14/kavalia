import { Component, OnInit } from '@angular/core';
import { IScheduledTask, DataService, UtilityService } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';
import { CatalogService, DataSourceService } from '@app/core/services/models';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  item: IScheduledTask = null;
  currentId = 0;
  taskTypes: Array<{ key: string, value: string }> = [];
  executionTypes: Array<{ key: string, value: string }> = [];
  sqlDataSources: Array<{ key: string, value: string }> = [];
  dependencyTaks: Array<{ key: string, value: string }> = [];

  detailForm: FormGroup;
  editingStatus = false;
  typeSelected: string = null;

  uploadTaskId = 'TRE-01';
  deliveryTaskId = 'TRE-02';
  processingTaskId = 'TRE-03';

  processTypes: Array<{ key: string, value: string }> =
  [
    { value: 'Cálculo de compensación', key: '1' },
    { value: 'Cálculo de indicadores', key: '2' },
    { value: 'Cálculo de cuotas', key: '3' },
  ];

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _catalogService: CatalogService,
    private _dataSourceService: DataSourceService,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _utilityService: UtilityService) {
      super();
    }

  ngOnInit() {
    this._catalogService.getCatalogItemById('TRE-01').subscribe(
      data => this.uploadTaskId = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TRE-02').subscribe(
      data => this.deliveryTaskId = data.id.toString()
    );

    this._catalogService.getCatalogItemById('TRE-03').subscribe(
      data => this.processingTaskId = data.id.toString()
    );

    this._catalogService.getCatalogDictionary('TRE').subscribe(
      data => this.taskTypes = data
    );

    this._catalogService.getCatalogDictionary('TEJ').subscribe(
      data => this.executionTypes = data
    );

    this._dataSourceService.getSqlDataSourcesDictionary().subscribe(
      data => this.sqlDataSources = data
    );

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this._dataService.get<IScheduledTask[]>('/api/task').subscribe(
      data => this.dependencyTaks = data.filter(x => x.id !== this.currentId).map(item => { return { key: item.id.toString(), value: item.name }})
    );

    this.detailForm = this._formBuilder.group({
      taskTypeId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      executionTypeId: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      days: [0, [Validators.required]],
      processId: [null],
      dependencyTaskId: [null],
      processDate: [null],
      activeStatus: [true],
      sqlDataSourceId: [null],
    });
  }

  onReturn() {
    this._router.navigate(['/task/tasks']);
  }

  onSubmit({ value, valid }: { value: IScheduledTask, valid: boolean }) {
    if (valid) {
      value.startDate = this._utilityService.convertToUtc(value.startDate);
      value.startTime = this._utilityService.convertToUtc(value.startTime);
      if (this.editingStatus) {
        this._dataService.post(`/api/task/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/task', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onDelete() {
    this._dataService.delete(`/api/task/${this.currentId}`).subscribe(
      () => this.onSuccess()
    );
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  getItem(id: number) {
    this._dataService.get<IScheduledTask>(`/api/task/${id}`).subscribe(
        data =>  {
          this.item = data;
          this.typeSelected = this.item.taskTypeId.toString();
          this.detailForm.setValue({
            taskTypeId: this.item.taskTypeId,
            processId: this.item.processId,
            processDate: this.item.processDate ? new Date(this.item.processDate) : null,
            sqlDataSourceId: this.item.sqlDataSourceId,
            name: this.item.name,
            dependencyTaskId: this.item.dependencyTaskId,
            executionTypeId: this.item.executionTypeId,
            startTime: new Date(this.item.startTime),
            startDate: new Date(this.item.startDate),
            activeStatus: this.item.activeStatus,
            days: this.item.days,
          });
          this.setRequiredFields()
        }
      );
  }

  onChangeType(event: any) {
    this.typeSelected = event.value;
    this.setRequiredFields()
  }

  private setRequiredFields() {
    this.setRequired(this.detailForm.controls['sqlDataSourceId'], this.typeSelected === this.deliveryTaskId || this.typeSelected === this.uploadTaskId );
    this.setRequired(this.detailForm.controls['processId'], this.typeSelected === this.processingTaskId );
    this.setRequired(this.detailForm.controls['processDate'], this.typeSelected === this.processingTaskId || this.typeSelected === this.deliveryTaskId );
  }

}
