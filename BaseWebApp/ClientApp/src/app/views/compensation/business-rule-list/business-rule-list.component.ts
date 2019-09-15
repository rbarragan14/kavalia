import { Component, OnInit } from '@angular/core';
import { IBusinessRule, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-rule-list',
  templateUrl: './business-rule-list.component.html',
  styleUrls: ['./business-rule-list.component.scss']
})
export class BusinessRuleListComponent implements OnInit {

  items: Array<IBusinessRule> = [];
  editingStatus = false;

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IBusinessRule): void {
    this._router.navigate(['/compensation/business-rules/', item.id]);
  }

  onSelectVersion(item: IBusinessRule): void {
    this._router.navigate(['/compensation/business-rules/version/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/compensation/business-rules/new']);
  }

  getItems() {
    this._dataService.get<IBusinessRule[]>('/api/compensation/businessrule').subscribe(
      data => this.items = data
    );
  }
}
