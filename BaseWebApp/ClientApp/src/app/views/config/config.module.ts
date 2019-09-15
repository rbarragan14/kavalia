import { NgModule } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { SharedModule } from '@app/shared/shared.module';

import { ConfigRoutingModule } from './config-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { CatalogDetailComponent } from './catalog-detail/catalog-detail.component';
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import { ParameterDetailComponent } from './parameter-detail/parameter-detail.component';
import { CatalogAssociateDetailsComponent } from './catalog-associate-details/catalog-associate-details.component';
import { CatalogAssociateListComponent } from './catalog-associate-list/catalog-associate-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { HierarchyDataAccessComponent } from './hierarchy-data-access/hierarchy-data-access.component';
import { TreeModule } from 'primeng/tree';

@NgModule({
  imports: [
    ConfigRoutingModule,
    SharedModule,
    TreeModule
  ],
  declarations: [
    CatalogComponent,
    CatalogListComponent,
    CatalogDetailComponent,
    ParameterListComponent,
    ParameterDetailComponent,
    CatalogAssociateDetailsComponent,
    CatalogAssociateListComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    HierarchyDataAccessComponent
  ],
  providers: [DataService]
})
export class ConfigModule { }
