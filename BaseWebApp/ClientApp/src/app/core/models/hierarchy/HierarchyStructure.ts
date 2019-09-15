export interface IHierarchyStructure {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    finalDate?: Date;
    activeStatus: boolean;
    version: number;
    groupByPosition: boolean;
    positionId: number;
    childNodes: IHierarchyStructureNode[];
}

export interface IHierarchyStructureNode {
    id: number;
    name: string;
    revisor: boolean;
    parentNodeId?: number;
    childNode?: IHierarchyStructureNode;
}
