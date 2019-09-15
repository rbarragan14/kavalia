import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IIndicator, IVariable } from '@app/core';

@Injectable()
export class IndicatorService {
    constructor(private _dataService: DataService) {
    }

    public getIndicatorDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IIndicator[]>(`/api/indicator`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getVariablesDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IVariable[]>(`/api/indicator/variable`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getVariables(): Observable<IVariable[]> {
        return this._dataService.get<IVariable[]>(`/api/indicator/variable`);
    }

    public getIndicators(): Observable<IIndicator[]> {
        return this._dataService.get<IIndicator[]>(`/api/indicator`);
    }

    public getIndicator(id: number): Observable<IIndicator> {
        return this._dataService.get<IIndicator>(`/api/indicator/${id}`);
    }
}
