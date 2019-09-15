import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { DataService, IScheduledTaskResult, IAuditLogSearch } from '@app/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-results-list',
  templateUrl: './task-results-list.component.html',
  styleUrls: ['./task-results-list.component.scss']
})
export class TaskResultsListComponent
  extends BaseFormComponent
  implements OnInit {

  currentId = 0;
  logs: Array<IScheduledTaskResult> = [];
  searchForm: FormGroup;

  constructor(private _activatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private _formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    if ('id' in this._activatedRoute.snapshot.params) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
    }

    const today: Date = new Date(new Date().toDateString());
    let tomorrow: Date = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow = new Date(tomorrow.toDateString());

    this.searchForm = this._formBuilder.group({
      startDate: [today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
    });

    this.getLogs(this.currentId, today, tomorrow);
  }

  getLogs(taskId: number, from: Date, to: Date ) {
    const p = { 'from': from, 'to': to };
    this._dataService.get<IScheduledTaskResult[]>(`/api/task/result/${taskId}`, p ).subscribe(
      data => this.logs = data
    );
  }

  onSubmit({ value, valid }: { value: IAuditLogSearch, valid: boolean }) {
    if (valid) {
      this.getLogs(this.currentId, value.startDate, value.endDate);
    }
  }
}
