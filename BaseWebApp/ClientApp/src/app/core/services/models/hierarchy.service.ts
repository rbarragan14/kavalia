import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { Observable } from 'rxjs';
import { IHierarchyStructure } from '@app/core/models/hierarchy';
import { map } from 'rxjs/internal/operators/map';
import { IHierarchy } from '@app/core/models/hierarchy/Hierarchy';
import {
    IHierarchyStructureTree,
    IHierarchyStructureTreeNode,
    IHierarchyStructureNode,
    IHierarchyTree,
    IHierarchyTreeNode,
    IHierarchyNode
} from '@app/core';

@Injectable()
export class HierarchyService {
    constructor(private _dataService: DataService) {
    }

    public getHierarchyStructureList(): Observable<IHierarchyStructure[]> {
        return this._dataService.get<IHierarchyStructure[]>(`/api/hierarchy/structure`);
    }

    public getHierarchyStructureDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this.getHierarchyStructureList().pipe(
            map((res: IHierarchyStructure[]) => res.map((item: IHierarchyStructure) => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getHierarchyStructure(id: number): Observable<IHierarchyStructure> {
        return this._dataService.get<IHierarchyStructure>(`/api/hierarchy/structure/${id}`);
    }

    public createHierarchyStructureTree(tree: IHierarchyStructureTree): Observable<IHierarchyStructure> {
        return this._dataService.put<IHierarchyStructure>(`/api/hierarchy/structure`, this.mapHierarchyStructureTree(tree));
    }

    public updateHierarchyStructureTree(id: number, tree: IHierarchyStructureTree): Observable<IHierarchyStructure> {
        return this._dataService.post<IHierarchyStructure>(`/api/hierarchy/structure/${id}`, this.mapHierarchyStructureTree(tree));
    }

    public createHierarchyTree(tree: IHierarchyTree): Observable<IHierarchy> {
        return this._dataService.put<IHierarchy>(`/api/hierarchy`, this.mapHierarchyTree(tree));
    }

    public updateHierarchyTree(id: number, tree: IHierarchyTree): Observable<IHierarchy> {
        return this._dataService.post<IHierarchy>(`/api/hierarchy/${id}`, this.mapHierarchyTree(tree));
    }

    public getHierarchyList(): Observable<IHierarchyTree[]> {
        return this._dataService.get<IHierarchyTree[]>(`/api/hierarchy`);
    }

    public getHierarchyDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IHierarchyTree[]>(`/api/hierarchy`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getHierarchyStructureTree(id: number): Observable<IHierarchyStructureTree> {
        return this._dataService.get<IHierarchyStructure>(`/api/hierarchy/structure/${id}`).pipe(
            map(res => this.mapHierarchyStructureToHierarchyStructureTree(res)));
    }

    private mapHierarchyStructureToHierarchyStructureTree(hierarchyStructure: IHierarchyStructure): IHierarchyStructureTree {
        return {
            id: hierarchyStructure.id,
            name: hierarchyStructure.name,
            description: hierarchyStructure.description,
            startDate: hierarchyStructure.startDate,
            finalDate: hierarchyStructure.finalDate,
            activeStatus: hierarchyStructure.activeStatus,
            groupByPosition: hierarchyStructure.groupByPosition,
            version: hierarchyStructure.version,
            positionId: hierarchyStructure.positionId,
            nodes: hierarchyStructure.childNodes != null && hierarchyStructure.childNodes.length > 0 ?
                hierarchyStructure.childNodes.map(node => this.mapHierarchyStructureNode(node)) :
                null
        };
    }

    public getHierarchyTree(id: number): Observable<IHierarchyTree> {
        return this._dataService.get<IHierarchy>(`/api/hierarchy/${id}`).pipe(
            map(res => {
                const tree = {
                    id: res.id,
                    name: res.name,
                    description: res.description,
                    startDate: res.startDate,
                    finalDate: res.finalDate,
                    version: res.version,
                    timeId: res.timeId,
                    hierarchyStructure: res.hierarchyStructureId,
                    groupByPosition: true,
                    activeStatus: res.activeStatus,
                    structure: res.hierarchyStructure != null ?
                        this.mapHierarchyStructureToHierarchyStructureTree(res.hierarchyStructure) :
                        null,
                    nodes: res.childNodes != null && res.childNodes.length > 0 ?
                        res.childNodes.map(node => this.mapHierarchyNode(node, res.hierarchyStructure)) :
                        null
                };

                return tree;
            }));
    }

    private mapHierarchyStructureTree(tree: IHierarchyStructureTree): IHierarchyStructure {
        return {
            id: tree.id,
            name: tree.name,
            description: tree.description,
            startDate: tree.startDate,
            finalDate: tree.finalDate,
            activeStatus: tree.activeStatus,
            version: tree.version,
            groupByPosition: tree.groupByPosition,
            positionId: tree.positionId,
            childNodes: tree.nodes != null && tree.nodes.length > 0 ?
                tree.nodes.map(node => this.mapHierarchyStructureTreeNode(node)) :
                null
        };
    }

    private mapHierarchyStructureTreeNode(node: IHierarchyStructureTreeNode): IHierarchyStructureNode {
        return {
            id: (node.data.id || 0) <= 0 ? 0 : node.data.id,
            name: node.data.name,
            revisor: !!node.data.revisor,
            childNode: node.children != null && node.children.length > 0 ?
                this.mapHierarchyStructureTreeNode(node.children[0]) :
                null
        };
    }

    private mapHierarchyTree(tree: IHierarchyTree): IHierarchy {
        return {
            id: tree.id,
            name: tree.name,
            description: tree.description,
            startDate: tree.startDate,
            finalDate: tree.finalDate,
            activeStatus: tree.activeStatus,
            version: tree.version,
            timeId: tree.timeId,
            hierarchyStructureId: tree.hierarchyStructure,
            childNodes: tree.nodes != null && tree.nodes.length > 0 ?
                tree.nodes.map(node => this.mapHierarchyTreeNode(node)) :
                null
        };
    }

    private mapHierarchyTreeNode(node: IHierarchyTreeNode): IHierarchyNode {
        return {
            id: (node.data.id || 0) <= 0 ? 0 : node.data.id,
            name: node.data.name,
            revisor: !!node.data.revisor,
            structureNodeId: node.data.structureNodeId,
            childNodes: node.children != null && node.children.length > 0 ?
                node.children.map(n => this.mapHierarchyTreeNode(n)) :
                null
        };
    }

    private mapHierarchyStructureNode(node: IHierarchyStructureNode): IHierarchyStructureTreeNode {
        return {
            label: node.name,
            data: { id: node.id, name: node.name, revisor: node.revisor },
            children: node.childNode != null ?
                [this.mapHierarchyStructureNode(node.childNode)] :
                null
        };
    }

    private mapHierarchyNode(node: IHierarchyNode, structure: IHierarchyStructure): IHierarchyTreeNode {
        const label = this.getNodeLabel(node, structure);
        return {
            label: label,
            data: { id: node.id, name: node.name, revisor: node.revisor, structureNodeId: node.structureNodeId },
            children: node.childNodes != null && node.childNodes.length > 0 ?
                node.childNodes.map(n => this.mapHierarchyNode(n, structure)) :
                null
        };
    }


    private getNodeLabel(node: IHierarchyNode, structure: IHierarchyStructure): string {
        if (!structure || !structure.childNodes || !node.structureNodeId) {
            return node.name;
        }

        const structureNode = this.findNodeById(structure.childNodes, node);
        if (structureNode) {
            return `${structureNode.name} - ${node.name}`;
        }

        return node.name;
    }


    private findNodeById(nodes: IHierarchyStructureNode[], node: IHierarchyNode): IHierarchyStructureNode {
        const structureNode = nodes.find(n => n.id === node.structureNodeId);

        if (structureNode) {
            return structureNode;
        }

        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].childNode) {
                const childNode = this.findNodeById([nodes[index].childNode], node);
                if (childNode) {
                    return childNode;
                }
            }
        }

        return null;
    }

    public findStructureNodeById(nodes: IHierarchyStructureTreeNode[], node: number): IHierarchyStructureTreeNode {
        const structureNode = nodes.find(n => n.data.id === node);

        if (structureNode) {
            return structureNode;
        }

        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].children) {
                const childNode = this.findStructureNodeById(nodes[index].children, node);
                if (childNode) {
                    return childNode;
                }
            }
        }

        return null;
    }

    public getLeafNode(nodes: IHierarchyStructureTreeNode[]): IHierarchyStructureTreeNode {
        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].children) {
                return this.getLeafNode(nodes[index].children);
            } else {
                return nodes[index];
            }
        }

        return null;
    }
}
