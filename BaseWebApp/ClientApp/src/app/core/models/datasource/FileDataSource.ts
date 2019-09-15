import { IFileDataSourceField } from './FileDataSourceField';

export interface IFileDataSource {
    id: number;
    name: string;
    fileFormat: number;
    fileType: number;
    fileDataSourceFields: IFileDataSourceField[];
}
