import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';
import { IHierarchyTree } from '@app/core';

@Component({
  selector: 'app-hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.scss']
})
export class HierarchyListComponent implements OnInit {

  items: Array<IHierarchyTree>;
  constructor(private _router: Router, private _hierarchyService: HierarchyService) { }

  ngOnInit() {
    this._hierarchyService.getHierarchyList().subscribe(
      data => this.items = data
    );
  }

  onSelectVersion(item: IHierarchyTree): void {
    this._router.navigate(['/org-structure/hierarchy/version/', item.id]);
  }

  onSelect(item: IHierarchyTree): void {
    this._router.navigate(['/org-structure/hierarchy/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/org-structure/hierarchy/new']);
  }
}
