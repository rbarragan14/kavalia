import { IPaymentTableIndicator, IPaymentTableHierarcy } from '@app/core';

export interface IPaymentTable {
    id: number;
    version: number;
    name: string;
    tableType: number;
    thresholdType: number;
    percentageIndicatorType?: number;
    startDate: Date;
    finalDate?: Date;
    activeStatus: boolean;
    indicators: IPaymentTableIndicator[];
    hierarchies: IPaymentTableHierarcy[];
}
