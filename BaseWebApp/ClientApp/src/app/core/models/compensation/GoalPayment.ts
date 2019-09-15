export interface IGoalPayment {
    id: number;
    paymentTypeId: number;
    maxLimitTypeId: number;
    paymentMaxValue: number;
    percentage: number;
    goalKindId: number;
    kindValue: number;
}
