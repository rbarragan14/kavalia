import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaymentTable, ICompensationSchema } from '@app/core';

@Injectable()
export class CompensationService {
    constructor(private _dataService: DataService) {
    }

    public getPaymentTableDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IPaymentTable[]>(`/api/compensation/paymenttable`).pipe(
            map((res: IPaymentTable[]) => res.map((item: IPaymentTable) => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getCompensationSchemaDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<ICompensationSchema[]>(`/api/compensation/schema`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }
}
