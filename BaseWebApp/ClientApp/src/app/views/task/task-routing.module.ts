import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskResultsListComponent } from '@app/views/task/task-results-list/task-results-list.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Tareas'
      },
      children: [
        {
          path: 'tasks',
          component: TaskListComponent,
          data: {
            title: 'Tareas Programadas'
          },
        },
        {
            path: 'tasks/new',
            component: TaskDetailsComponent,
            data: {
                title: 'Nueva Tarea'
            }
        },
        {
          path: 'tasks/:id',
          component: TaskDetailsComponent,
          data: {
            title: 'Tarea'
          },
        },
        {
          path: 'tasks/result/:id',
          component: TaskResultsListComponent,
          data: {
            title: 'Tarea'
          },
        },
      ]
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TaskRoutingModule {}
