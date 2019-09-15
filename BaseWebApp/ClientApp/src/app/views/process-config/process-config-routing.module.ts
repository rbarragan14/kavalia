import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessFileListComponent } from './process-file-list/process-file-list.component';
import { ProcessFileDetailsComponent } from './process-file-details/process-file-details.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Archivos'
      },
      children: [
        {
          path: 'files',
          component: ProcessFileListComponent,
          data: {
            title: 'Archivos'
          },
        },
        {
            path: 'files/new',
            component: ProcessFileDetailsComponent,
            data: {
                title: 'Nuevo Archivos'
            }
        },
        {
          path: 'files/:id',
          component: ProcessFileDetailsComponent,
          data: {
            title: 'Archivo'
          },
        },
      ]
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProcessConfigRoutingModule {}
