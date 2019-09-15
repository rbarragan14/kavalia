import { ISqlField, IFileDataSourceField } from '@app/core';

export interface IUploadConfigurationField {
    id: number;
    name: string;
    sqlDataSourceField?: ISqlField;
    sqlDataSourceFieldId?: number;
    fileDataSourceField?: IFileDataSourceField;
    fileDataSourceFieldId?: number;
}
