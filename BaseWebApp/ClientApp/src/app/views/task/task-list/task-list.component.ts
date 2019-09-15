import { Component, OnInit } from '@angular/core';
import { IScheduledTask, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  items: Array<IScheduledTask> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IScheduledTask): void {
    this._router.navigate(['/task/tasks/', item.id]);
  }

  onViewHistory(item: IScheduledTask): void {
    this._router.navigate(['/task/tasks/result/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/task/tasks/new']);
  }

  getItems() {
    this._dataService.get<IScheduledTask[]>('/api/task').subscribe(
      data => this.items = data
    );
  }
}
