export interface IHierarchyStructureTree {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    finalDate?: Date;
    activeStatus: boolean;
    version: number;
    groupByPosition: boolean;
    positionId: number;
    nodes: IHierarchyStructureTreeNode[];
}

export interface IHierarchyStructureTreeNode {
    label: string;
    data: IHierarchyStructureDataTreeNode;
    children: IHierarchyStructureTreeNode[];
}

export interface IHierarchyStructureDataTreeNode {
    id: number;
    name: string;
    revisor: boolean;
}
