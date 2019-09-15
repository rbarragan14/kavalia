export interface IScheduledTask {
    id: number;
    taskTypeId: number;
    executionTypeId: number;
    name: string;
    startDate: Date;
    startTime: Date;
    activeStatus: boolean;
    days: number;
    processId?: number;
    processDate?: Date;
    sqlDataSourceId?: number;
    dependencyTaskId?: number;
}
