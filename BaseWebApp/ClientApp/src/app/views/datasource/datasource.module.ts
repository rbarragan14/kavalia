import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlDatasourceListComponent } from './sql-datasource-list/sql-datasource-list.component';
import { SqlDatasourceDetailsComponent } from './sql-datasource-details/sql-datasource-details.component';
import { FileDatasourceUploadComponent } from './file-datasource-upload/file-datasource-upload.component';
import { DataSourceRoutingModule } from '@app/views/datasource/datasource-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '@app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PickListModule } from 'primeng/picklist';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { QueryBuilderModule } from 'angular2-query-builder';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataSourceRoutingModule,
    PickListModule,
    CollapseModule,
    QueryBuilderModule,
    TableModule,
    CheckboxModule,
    ModalModule,
    ButtonModule,
    DropdownModule,
    TabsModule.forRoot()
  ],
  declarations: [
    SqlDatasourceListComponent,
    SqlDatasourceDetailsComponent,
    FileDatasourceUploadComponent
]
})
export class DatasourceModule { }
