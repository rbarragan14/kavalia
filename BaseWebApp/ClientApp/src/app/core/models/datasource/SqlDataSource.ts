import { ISqlDataBase } from './SqlDataBase';
import { ISqlDataTable } from './SqlDataTable';
import { ISqlField } from '@app/core';

export interface ISqlDataSource {
    id: number;
    name: string;
    description: string;
    sqlDataBaseId: number;
    sqlDataBase: ISqlDataBase;
    sqlTableId: number;
    sqlTable: ISqlDataTable;
    sqlFields: ISqlField[];
    activeStatus: boolean;
    query: string;
}
