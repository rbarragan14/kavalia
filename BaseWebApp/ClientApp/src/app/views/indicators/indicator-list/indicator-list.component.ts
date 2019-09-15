import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IIndicator, DataService } from '@app/core';

@Component({
  selector: 'app-indicator-list',
  templateUrl: './indicator-list.component.html',
  styleUrls: ['./indicator-list.component.scss']
})
export class IndicatorListComponent implements OnInit {

  items: Array<IIndicator> = [];

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  onCreate() {
    this._router.navigate(['/indicators/indicator/new']);
  }

  onSelect(item: IIndicator): void {
    this._router.navigate(['/indicators/indicator/', item.id]);
  }

  onFormulaSelect(item: IIndicator): void {
    this._router.navigate(['/indicators/indicator/' + item.id + '/formulation']);
  }

  onCopy(item: IIndicator): void {
    this._router.navigate(['/indicators/indicator/copy/' + item.id]);
  }

  getItems() {
    this._dataService.get<IIndicator[]>('/api/indicator').subscribe(
      data => this.items = data
    );
  }
}
