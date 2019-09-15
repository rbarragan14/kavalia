
import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { Observable } from 'rxjs';
import { IFormula, IFormulaCheckResult } from '@app/core';

@Injectable()
export class CalculationService {
    constructor(private _dataService: DataService) {
    }

    public checkFormula(formula: IFormula): Observable<IFormulaCheckResult> {
        return this._dataService.post<IFormulaCheckResult>(`/api/calc/formula/check`, formula);
    }
}
