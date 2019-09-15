import { IHierarchyStructure, IHierarchyStructureNode } from "../hierarchy";

export interface IPaymentTableHierarcy {
    hierarchyStructure: IHierarchyStructure;
    hierarchyStructureId: number;
    hierarchyStructureNode: IHierarchyStructureNode;
    hierarchyStructureNodeId: number;
}