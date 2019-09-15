import { IParameterFormula } from '@app/core';

export interface IFormulaCheckResult {
    error: string;
    isValid: boolean;
    result: string;
    parameters: IParameterFormula[];
}
