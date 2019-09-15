import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HierarchyListComponent } from '@app/views/org-structure/hierarchy-list/hierarchy-list.component';
import { HierarchyDetailsComponent } from '@app/views/org-structure/hierarchy-details/hierarchy-details.component';
import { HierarchyStructureListComponent } from '@app/views/org-structure/hierarchy-structure-list/hierarchy-structure-list.component';
import {
  HierarchyStructureDetailsComponent
} from '@app/views/org-structure/hierarchy-structure-details/hierarchy-structure-details.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Estructura Organizacional'
    },
    children: [
      {
        path: 'hierarchy',
        component: HierarchyListComponent,
        data: {
          title: 'Jerarquía organizacional'
        },
      },
      {
        path: 'hierarchy/new',
        component: HierarchyDetailsComponent,
        data: {
          title: 'Jerarquía organizacional'
        },
      },
      {
        path: 'hierarchy/version/:id',
        component: HierarchyDetailsComponent,
        data: {
          title: 'Jerarquía organizacional'
        },
      },
      {
        path: 'hierarchy/:id',
        component: HierarchyDetailsComponent,
        data: {
          title: 'Jerarquía organizacional'
        },
      },
      {
        path: 'hierarchy-structure',
        component: HierarchyStructureListComponent,
        data: {
          title: 'Estructura Jerarquía'
        },
      },
      {
        path: 'hierarchy-structure/new',
        component: HierarchyStructureDetailsComponent,
        data: {
          title: 'Estructura Jerarquía'
        },
      },
      {
        path: 'hierarchy-structure/version/:id',
        component: HierarchyStructureDetailsComponent,
        data: {
          title: 'Estructura Jerarquía'
        },
      },
      {
        path: 'hierarchy-structure/:id',
        component: HierarchyStructureDetailsComponent,
        data: {
          title: 'Estructura Jerarquía'
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgStructureRoutingModule { }
