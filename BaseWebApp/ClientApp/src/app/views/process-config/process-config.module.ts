import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessFileListComponent } from './process-file-list/process-file-list.component';
import { ProcessFileDetailsComponent } from './process-file-details/process-file-details.component';
import { ProcessConfigRoutingModule } from './process-config-routing.module';
import { DataService } from '@app/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    imports: [
      CommonModule,
      ProcessConfigRoutingModule,
      NgxDatatableModule,
      SharedModule
    ],
    declarations: [
    ProcessFileListComponent,
    ProcessFileDetailsComponent],
    providers: [DataService]
  })
  export class ProcessConfigModule { }
