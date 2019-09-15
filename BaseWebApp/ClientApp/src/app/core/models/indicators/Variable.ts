import { ISqlDataSource, IFileDataSource } from '@app/core';

export interface IVariable {
    id: number;
    name: string;
    version: number;
    description: string;
    operatorId: number;
    sourceTypeId: number;
    sqlDataSourceId: number;
    sqlDataSource?: ISqlDataSource;
    sqlFieldId: number;
    sqlFieldGroupId?: number;
    fileDataSourceId: number;
    fileDataSource?: IFileDataSource;
    fileFieldId: number;
    fileFieldGroupId?: number;
    activeStatus: boolean;
    groupPositions: boolean;
}
