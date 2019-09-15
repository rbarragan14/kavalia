import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core';
import { HierarchyListComponent } from './hierarchy-list/hierarchy-list.component';
import { HierarchyDetailsComponent } from './hierarchy-details/hierarchy-details.component';
import { OrgStructureRoutingModule } from '@app/views/org-structure/org-structure-routing.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HierarchyStructureListComponent } from './hierarchy-structure-list/hierarchy-structure-list.component';
import { HierarchyStructureDetailsComponent } from './hierarchy-structure-details/hierarchy-structure-details.component';

@NgModule({
    imports: [
      CommonModule,
      OrgStructureRoutingModule,
      ReactiveFormsModule,
      SharedModule,
      CollapseModule.forRoot()
    ],
    declarations: [
    HierarchyListComponent,
    HierarchyDetailsComponent,
    HierarchyStructureListComponent,
    HierarchyStructureDetailsComponent
],
    providers: [ DataService ]
  })
  export class OrgStructureModule { }
