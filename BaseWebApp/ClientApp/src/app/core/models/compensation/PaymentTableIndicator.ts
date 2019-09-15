import { IGoalPayment, IThresholdDetail } from '@app/core';

export interface IPaymentTableIndicator {
    id: number;
    name: string;
    goalPayment?: IGoalPayment;
    indicator?: { id: string, name: string };
    thresholdDetails?: IThresholdDetail[];
}
