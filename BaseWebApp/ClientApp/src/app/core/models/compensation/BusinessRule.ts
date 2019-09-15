import { IPaymentTable } from '@app/core';

export interface IBusinessRule {
    id: number;
    startDate: Date;
    incidentTypeId: number;
    paymentTableId: number;
    paymentTable: IPaymentTable;
    version: number;
    salaryPercentage: number;
    additional: boolean;
    paymentVariableElements: Array<{ id: string, itemName: string }>;
}
