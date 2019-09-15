import { ISqlDataTable } from './SqlDataTable';

export interface ISqlDataBase {
    id: number;
    name: string;
    sqlTables: ISqlDataTable[];
}
