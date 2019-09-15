import { Component, OnInit } from '@angular/core';
import { ICatalogAssociate, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog-associate-list',
  templateUrl: './catalog-associate-list.component.html',
  styleUrls: ['./catalog-associate-list.component.scss']
})
export class CatalogAssociateListComponent implements OnInit {

  items: Array<ICatalogAssociate> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: ICatalogAssociate): void {
    this._router.navigate(['/config/associate/', item.parentCatalogItem.id, item.childCatalog.id]);
  }

  onCreate() {
    this._router.navigate(['/config/associate/new']);
  }

  getItems() {
    this._dataService.get<ICatalogAssociate[]>('/api/catalog/associate').subscribe(
      data => this.items = data
    );
  }
}
