import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ICatalog, ICatalogItem} from '@app/core';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  catalog: ICatalog = null;
  currentId = 0;
  errorMessage: any;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _catalogService: DataService) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getCatalog(this.currentId);
    }
  }

  getCatalog(id: number)  {
    this._catalogService.get<ICatalog>('/api/catalog/' + id).subscribe(
      data => this.catalog = data
    );
  }

  onSelect(catalogItem: ICatalogItem) {
    this._router.navigate(['/config/catalogs/' + this.currentId + '/item/' + catalogItem.id]);
  }

  onReturn() {
    this._router.navigate(['/config/catalogs/']);
  }

  onCreate() {
    this._router.navigate(['/config/catalogs/' + this.currentId + '/new']);
  }
}
