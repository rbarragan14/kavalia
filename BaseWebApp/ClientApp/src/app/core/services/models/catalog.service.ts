import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { ICatalog, ICatalogItem } from '@app/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CatalogService {
    constructor(private _dataService: DataService) {
    }

    public getCatalogDictionary(id: string): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<ICatalog>(`/api/catalog/name/${id}`).pipe(
            map(res => res.catalogItems.map((item: ICatalogItem) => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getCatalogItems(id: string): Observable<Array<ICatalogItem>> {
        return this._dataService.get<ICatalog>(`/api/catalog/name/${id}`).pipe(map(res => res.catalogItems));
    }

    public getCatalogItemById(id: string): Observable<ICatalogItem> {
        return this._dataService.get<ICatalogItem>(`/api/catalog/item/${id}`);
    }

    public getCatalog(id: number): Observable<ICatalog> {
        return this._dataService.get<ICatalog>(`/api/catalog/${id}`);
    }
}
