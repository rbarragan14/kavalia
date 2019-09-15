import { Component, OnInit } from '@angular/core';
import { IHierarchyStructure } from '@app/core';
import { Router } from '@angular/router';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';

@Component({
  selector: 'app-hierarchy-structure-list',
  templateUrl: './hierarchy-structure-list.component.html',
  styleUrls: ['./hierarchy-structure-list.component.scss']
})
export class HierarchyStructureListComponent implements OnInit {

  items: Array<IHierarchyStructure>;

  constructor(private _router: Router, private _hierarchyService: HierarchyService) { }

  ngOnInit() {
    this._hierarchyService.getHierarchyStructureList().subscribe(
      data => this.items = data
    );
  }

  onSelectVersion(item: IHierarchyStructure): void {
    this._router.navigate(['/org-structure/hierarchy-structure/version/', item.id]);
  }

  onSelect(item: IHierarchyStructure): void {
    this._router.navigate(['/org-structure/hierarchy-structure/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/org-structure/hierarchy-structure/new']);
  }
}
