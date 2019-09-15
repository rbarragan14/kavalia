import { Component, OnInit } from '@angular/core';
import { IVariable, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-variables-list',
  templateUrl: './variables-list.component.html',
  styleUrls: ['./variables-list.component.scss']
})
export class VariablesListComponent implements OnInit {

  items: Array<IVariable>;

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  onCreate() {
    this._router.navigate(['/indicators/variable/new']);
  }

  onSelect(item: IVariable): void {
    this._router.navigate(['/indicators/variable/', item.id]);
  }

  onSelectVersion(item: IVariable): void {
    this._router.navigate(['/indicators/variable/version/', item.id]);
  }

  getItems() {
    this._dataService.get<IVariable[]>('/api/indicator/variable').subscribe(
      data => this.items = data
    );
  }
}
