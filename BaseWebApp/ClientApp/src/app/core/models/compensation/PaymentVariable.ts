import { IPaymentTable } from '@app/core';

export interface IPaymentVariable {
    id: number;
    name: string;
    variable: number;
    valueReference?: number;
    paymentTables: IPaymentTable[];
    operator: number;
    aditional: boolean;
    adjustmentFactor?: number;
    indicator: number;
    fixedValue?: number;
}
