import { IPaymentVariable } from '@app/core';

export interface ICompensationSchema {
    id: number;
    name: string;
    startDate: Date;
    finalDate: Date;
    positions: Array<{ id: string, itemName: string }>;
    paymentVariables: IPaymentVariable[];
    periodicityId: number;
}
