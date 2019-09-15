import { ISqlDataSource } from '@app/core';

export interface IAssociatedData {
    id: number;
    name: string;
    description: string;
    variableFormula: string;
    sqlDataSourceId: number;
    sqlDataSource?: ISqlDataSource;
    sqlFieldId: number;
    sqlFieldGroupId?: number;
}
