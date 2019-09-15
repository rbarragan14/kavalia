import { IUploadConfigurationField } from '@app/core';

export interface IUploadConfiguration {
    sourceTypeId: number;
    type: number;
    fileName: string;
    sqlDataSourceId?: number;
    fileDataSourceId?: number;
    uploadConfigurationFields: IUploadConfigurationField[];
}
