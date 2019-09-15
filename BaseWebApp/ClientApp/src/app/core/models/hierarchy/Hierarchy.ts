import { IHierarchyStructure } from '@app/core';

export interface IHierarchy {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    finalDate: Date;
    version: number;
    activeStatus: boolean;
    timeId: number;
    hierarchyStructureId: number;
    childNodes: IHierarchyNode[];
    hierarchyStructure?: IHierarchyStructure;
}

export interface IHierarchyNode {
    id: number;
    name: string;
    revisor: boolean;
    structureNodeId: number;
    parentNodeId?: number;
    childNodes: IHierarchyNode[];
}
