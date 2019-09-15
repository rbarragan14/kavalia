import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISqlDataSource, DataService } from '@app/core';

@Component({
  selector: 'app-sql-datasource-list',
  templateUrl: './sql-datasource-list.component.html',
  styleUrls: ['./sql-datasource-list.component.scss']
})
export class SqlDatasourceListComponent implements OnInit {

  items: Array<ISqlDataSource> = [];

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  onCreate() {
    this._router.navigate(['/datasource/sql/new']);
  }

  onSelect(item: any): void {
    this._router.navigate(['/datasource/sql/', item.id]);
  }

  getItems() {
    this._dataService.get<ISqlDataSource[]>('/api/datasource/sql').subscribe(
      data => this.items = data
    );
  }
}
