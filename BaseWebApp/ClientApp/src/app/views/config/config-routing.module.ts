import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogDetailComponent } from './catalog-detail/catalog-detail.component';
import { ParameterListComponent } from '@app/views/config/parameter-list/parameter-list.component';
import { ParameterDetailComponent } from '@app/views/config/parameter-detail/parameter-detail.component';
import { CatalogAssociateListComponent } from '@app/views/config/catalog-associate-list/catalog-associate-list.component';
import { CatalogAssociateDetailsComponent } from '@app/views/config/catalog-associate-details/catalog-associate-details.component';
import { CompanyListComponent } from '@app/views/config/company-list/company-list.component';
import { CompanyDetailsComponent } from '@app/views/config/company-details/company-details.component';
import { HierarchyDataAccessComponent } from '@app/views/config/hierarchy-data-access/hierarchy-data-access.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Configuración'
      },
      children: [
        {
          path: 'catalogs',
          component: CatalogListComponent,
          data: {
            title: 'Catálogos'
          },
        },
        {
          path: 'associate',
          component: CatalogAssociateListComponent,
          data: {
            title: 'Asociación Catálogos'
          },
        },
        {
          path: 'associate/:parentCatalogItemId/:childCatalogId',
          component: CatalogAssociateDetailsComponent,
          data: {
            title: 'Asociación Catálogo'
          },
        },
        {
          path: 'associate/new',
          component: CatalogAssociateDetailsComponent,
          data: {
            title: 'Asociación Catálogo'
          },
        },
        {
          path: 'catalogs/:id',
          component: CatalogComponent,
          data: {
            title: 'Elementos'
          }
        },
        {
          path: 'catalogs/:id/new',
          component: CatalogDetailComponent,
          data: {
            title: 'Catálogos'
          }
        },
        {
          path: 'catalogs/:id/item/:itemId',
          component: CatalogDetailComponent,
          data: {
            title: 'Catálogo'
          }
        },
        {
          path: 'parameters',
          component: ParameterListComponent,
          data: {
            title: 'Parámetros'
          },
        },
        {
          path: 'parameters/new',
          component: ParameterDetailComponent,
          data: {
            title: 'Parámetros'
          },
        },
        {
          path: 'parameters/:id',
          component: ParameterDetailComponent,
          data: {
            title: 'Parámetros'
          },
        },
        {
          path: 'companies',
          component: CompanyListComponent,
          data: {
            title: 'Compañias'
          },
        },
        {
          path: 'companies/new',
          component: CompanyDetailsComponent,
          data: {
            title: 'Compañias'
          },
        },
        {
          path: 'companies/:id',
          component: CompanyDetailsComponent,
          data: {
            title: 'Compañias'
          },
        },
        {
          path: 'hierarchy-data-access',
          component: HierarchyDataAccessComponent,
          data: {
            title: 'Acceso a datos por Jerarquía'
          },
        },
      ]
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ConfigRoutingModule {}
