import { Component, OnInit } from '@angular/core';
import { IParameter, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {

  items: Array<IParameter> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IParameter): void {
    this._router.navigate(['/config/parameters/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/config/parameters/new']);
  }

  getItems() {
    this._dataService.get<IParameter[]>('/api/parameter').subscribe(
      data => this.items = data
    );
  }
}
