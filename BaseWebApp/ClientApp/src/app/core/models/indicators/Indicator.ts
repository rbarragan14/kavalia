import { IParameterFormula, IIndicatorIndicator, IIndicatorVariable } from '@app/core';
import { IAssociatedData } from '@app/core/models/indicators/AssociatedData';

export interface IIndicator {
    id: number;
    startDate: Date;
    finalDate?: Date;
    indicatorTypeId: number;
    indicatorType?: { id: string, name: string };
    name: string;
    comments: string;
    formula: string;
    description: string;
    thresholdMin?: number;
    thresholdMid?: number;
    thresholdMax?: number;
    periodicityId: number;
    periodicity?: { id: string, name: string };
    ussageId: number;
    dataInputId: number;
    activeStatus: boolean;
    variables: IIndicatorVariable[];
    indicators: IIndicatorIndicator[];
    generalData: IParameterFormula[];
    associatedData: IAssociatedData[];
    hierarchyStructureId?: number;
    hierarchyStructureNodeId?: number;
}
