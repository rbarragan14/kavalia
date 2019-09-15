import { ISqlField } from './SqlField';

export interface ISqlDataTable {
    id: number;
    name: string;
    fields: ISqlField[];
}
