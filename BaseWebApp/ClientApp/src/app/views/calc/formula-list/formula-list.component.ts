import { Component, OnInit } from '@angular/core';
import { DataService, IFormula } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formula-list',
  templateUrl: './formula-list.component.html',
  styleUrls: ['./formula-list.component.scss']
})
export class FormulaListComponent implements OnInit {

  items: Array<IFormula> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IFormula): void {
    this._router.navigate(['/calc/formulas/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/calc/formulas/new']);
  }

  getItems() {
    this._dataService.get<IFormula[]>('/api/calc/formula').subscribe(
      data => this.items = data
    );
  }
}
