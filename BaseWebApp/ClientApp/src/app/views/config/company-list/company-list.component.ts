import { Component, OnInit } from '@angular/core';
import { ICompany } from '@app/core/models/Company';
import { Router } from '@angular/router';
import { DataService } from '@app/core';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  items: Array<ICompany> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: ICompany): void {
    this._router.navigate(['/config/companies/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/config/companies/new']);
  }

  getItems() {
    this._dataService.get<ICompany[]>('/api/company').subscribe(
      data => this.items = data
    );
  }
}