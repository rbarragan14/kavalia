import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SqlDatasourceListComponent } from '@app/views/datasource/sql-datasource-list/sql-datasource-list.component';
import { SqlDatasourceDetailsComponent } from '@app/views/datasource/sql-datasource-details/sql-datasource-details.component';
import { FileDatasourceUploadComponent } from '@app/views/datasource/file-datasource-upload/file-datasource-upload.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Fuente de datos'
    },
    children: [
      {
        path: 'sql',
        component: SqlDatasourceListComponent,
        data: {
          title: 'Fuente de datos SQL'
        },
      },
      {
        path: 'sql/new',
        component: SqlDatasourceDetailsComponent,
        data: {
          title: 'Fuente de datos SQL'
        },
      },
      {
        path: 'sql/:id',
        component: SqlDatasourceDetailsComponent,
        data: {
          title: 'Fuente de datos SQL'
        },
      },
      {
        path: 'file/upload',
        component: FileDatasourceUploadComponent,
        data: {
          title: 'Archivos Carga/Descarga'
        },
        runGuardsAndResolvers: 'always',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSourceRoutingModule { }
