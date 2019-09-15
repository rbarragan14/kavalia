import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree-selection',
  templateUrl: './tree-selection.component.html',
  styleUrls: ['./tree-selection.component.scss']
})
export class TreeSelectionComponent implements OnInit {

  @Input() nodes: TreeNode[];
  selectedNode: TreeNode;
  selectedNodes: TreeNode[] = [];

  constructor() { }

  ngOnInit() {
  }

  onAdd() {
    if (this.selectedNode && !this.selectedNodes.includes(this.selectedNode)) {
      this.selectedNodes.push(this.selectedNode);
    }
  }

  onRemove() {
    if (this.selectedNode) {
      const index = this.selectedNodes.indexOf(this.selectedNode);
      if (index >= 0) {
        this.selectedNodes.splice(index, 1);
      }
    }
  }

}
