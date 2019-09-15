import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { ICatalog } from '@app/core';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})

export class CatalogListComponent implements OnInit {
  selectedCatalog: ICatalog;
  catalogs: Array<ICatalog> = [];
  loadingIndicator = true;
  reorderable = true;

  currentId = 0;
  serarchText = '';

  constructor(private _catalogService: DataService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
    }
    this.getCatalogs();
  }

  getCatalogs() {
    this._catalogService.get<ICatalog[]>('/api/catalog').subscribe(
      data => this.catalogs = data
    );
  }

  onSelect(catalog: ICatalog): void {
    this.selectedCatalog = catalog;
    this._router.navigate(['/config/catalogs/', catalog.id]);
  }
}
