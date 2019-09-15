import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BaseFormComponent } from '../base-form';
import { INode, IHierarchyStructureTree, IHierarchyStructureTreeNode } from '@app/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hierarchy-tree',
  templateUrl: './hierarchy-tree.component.html',
  styleUrls: ['./hierarchy-tree.component.scss']
})
export class HierarchyTreeComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModal') infoModal: ModalDirective;

  @Input() nodes: TreeNode[];
  @Input() showToolbar = false;
  @Input() showExtendedButton = false;
  @Input() selectionMode = 'single';
  @Input() allowDragAndDrop = false;
  @Input() singleInput = false;
  @Input() structure: IHierarchyStructureTree;

  @Input() selectedNode: TreeNode;
  @Output() selectedNodeChange = new EventEmitter();
  @Output() extendedButtonClick = new EventEmitter();

  newNodeIndex = 0;
  rootNode = false;
  nodeEditingStatus = false;
  nodeForm: FormGroup;
  structureNode: IHierarchyStructureTreeNode;

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
    super();
  }

  ngOnInit() {
    const validators = this.singleInput ? null : Validators.compose([Validators.required]);
    this.nodeForm = this._formBuilder.group({
      name: [null, validators],
      value: [{ value: null, disabled: true }],
      revisor: [false]
    });
  }

  onClickModal(edit: boolean, rootNode: boolean) {
    const selected = this.selectedNode;
    let level = this.getNodeLevel(selected);

    if (edit) {
      if (selected) {
        this.nodeEditingStatus = true;
        const revisorValue = selected.data.revisor ? true : false;
        this.nodeForm.patchValue({
          name: selected.data.name,
          revisor: revisorValue
        });
      } else {
        this._ns.warning('Debe seleccionar el nodo a modificar!');
        return;
      }
    } else {
      if (this.singleInput && rootNode && this.nodes.length > 0) {
        this._ns.warning('Solo un nodo raiz es permitido para esta estructura!');
        return;
      }
      if (!rootNode && selected === undefined) {
        this._ns.warning('Debe seleccionar el nodo padre!');
        return;
      }
      if (this.singleInput && !rootNode && (selected.children && selected.children.length > 0)) {
        this._ns.warning('El nodo ya tiene un nodo hijo!');
        return;
      }

      this.rootNode = rootNode;
      this.nodeEditingStatus = false;
      this.nodeForm.reset();
      level = rootNode ? 1 : level + 1;
    }

    if (!this.singleInput) {
      this.structureNode = this.getStructureNode(level);
      if (!this.structureNode) {
        this._ns.warning('Nivel no válido en la estructura!');
        return;
      }
      this.nodeForm.patchValue(
        { value: this.structureNode.label }
      );
    }

    this.infoModal.show();
  }

  onSubmitNode({ value, valid }: { value: INode, valid: boolean }) {
    if (valid) {
      const selected = this.selectedNode;
      value.value = this.structureNode ? this.structureNode.label : '';
      if (this.nodeEditingStatus) {
        selected.label = this.getLabel(value);
        selected.data.name = value.name;
        selected.data.value = value.value;
        selected.data.revisor = value.revisor;
      } else {
        if (this.rootNode) {
          this.addNode(null, value);
        } else {
          this.addNode(selected, value);
        }
      }
      this.infoModal.hide();
    } else {
      this.validateAllFormFields(this.nodeForm);
    }
  }

  addNode(node: TreeNode, value: INode) {
    const newNode = {
      label: this.getLabel(value),
      data: {
        id: this.newNodeIndex--,
        name: value.name,
        value: value.value,
        revisor: value.revisor,
        structureNodeId: this.structureNode ? this.structureNode.data.id : null
      }
    };

    if (node === null) {
      this.nodes.push(newNode);
    } else {
      if (!node.children) {
        node.children = new Array();
      }
      node.children.push(newNode);
    }
  }

  deleteSelectedNode() {
    const selected = this.selectedNode;
    if (selected) {
      this.deleteNode(selected);
      this.selectedNode = null;
    } else {
      this._ns.warning('Debe seleccionar el nodo a borrar!');
    }
  }

  deleteNode(node: TreeNode): void {
    let array: TreeNode[];
    if (node.parent != null) {
      array = node.parent.children;
    } else {
      array = this.nodes;
    }

    array.splice(array.indexOf(node), 1);
  }

  private getLabel(value: INode): string {
    if (!value.value) {
      return value.name;
    }
    return `${value.value} - ${value.name}`;
  }

  private getStructureNode(level: number): IHierarchyStructureTreeNode {
    if (this.structure == null || this.structure.nodes == null || this.structure.nodes.length === 0) {
      return null;
    }

    let rootNode = this.structure.nodes[0];
    for (let index = 1; index < level; index++) {
      if (rootNode == null || rootNode.children == null || rootNode.children.length === 0) {
        return null;
      }
      rootNode = rootNode.children[0];
    }

    return rootNode;
  }

  private getNodeLevel(node: TreeNode): number {
    if (node == null) {
      return 0;
    }

    if (node.parent == null) {
      return 1;
    }
    return this.getNodeLevel(node.parent) + 1;
  }

  onSelectionChange(value: any) {
    this.selectedNode = value;
    this.selectedNodeChange.emit(value);
  }

  onExtendedButtonClick(value: any) {
    this.extendedButtonClick.emit(value);
  }

}
