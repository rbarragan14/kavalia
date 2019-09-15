export interface IPaymentTableIndicatorForm {
    indicator?: Array<{ id: string, itemName: string }>;
    percentage: number;
    paymentTableType: number;
    goalTypeIndicator: number;
    indicatorPercentage?: number;
}
