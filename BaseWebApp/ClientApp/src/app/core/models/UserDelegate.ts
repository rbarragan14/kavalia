export interface IUserDelegate {
    id: number;
    userId: number;
    name: string;
    delegateUserId: number;
    startDate: Date;
    finalDate: Date;
    activeStatus: boolean;
}
