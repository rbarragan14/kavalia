import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ReactiveFormsModule } from '@angular/forms';

import { TaskRoutingModule } from './task-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { TaskResultsListComponent } from './task-results-list/task-results-list.component';

@NgModule({
    imports: [
      CommonModule,
      TaskRoutingModule,
      ReactiveFormsModule,
      SharedModule
    ],
    declarations: [
    TaskListComponent,
    TaskDetailsComponent,
    TaskResultsListComponent],
    providers: [ DataService ]
  })
  export class TaskModule { }
