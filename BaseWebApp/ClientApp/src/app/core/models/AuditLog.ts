export interface IAuditLog {
    id: number;
    userId: string;
    date: Date;
    sourceAddress: string;
    relatedInformation: string;
}
