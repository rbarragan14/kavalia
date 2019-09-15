import { IHierarchyStructureTree } from '@app/core';

export interface IHierarchyTree {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    finalDate: Date;
    version: number;
    activeStatus: boolean;
    timeId: number;
    hierarchyStructure: number;
    structure: IHierarchyStructureTree;
    nodes: IHierarchyTreeNode[];
}

export interface IHierarchyTreeNode {
    label: string;
    data: IHierarchyDataTreeNode;
    children: IHierarchyTreeNode[];
}

export interface IHierarchyDataTreeNode {
    id: number;
    name: string;
    revisor: boolean;
    structureNodeId: number;
}
