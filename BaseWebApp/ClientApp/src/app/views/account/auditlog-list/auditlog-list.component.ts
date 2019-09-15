import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { IAuditLog, IAuditLogSearch } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-auditlog-list',
  templateUrl: './auditlog-list.component.html',
  styleUrls: ['./auditlog-list.component.scss']
})
export class AuditlogListComponent
  extends BaseFormComponent
  implements OnInit {

  logs: Array<IAuditLog> = [];
  errorMessage: any;
  searchForm: FormGroup;

  constructor(private _dataService: DataService, private _formBuilder: FormBuilder) {
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
    });

    this.getLogs(today, tomorrow);
  }

  onSubmit({ value, valid }: { value: IAuditLogSearch, valid: boolean }) {
    if (valid) {
      this.getLogs(value.startDate, value.endDate);
    }
  }

  getLogs(from: Date, to: Date ) {
    const p = { 'from': from, 'to': to };
    this._dataService.get<IAuditLog[]>('/api/account/auditlog', p ).subscribe(
      data => this.logs = data
    );
  }
}
