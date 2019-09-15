import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from '@app/shared/shared.module';
import { CompensationRoutingModule } from '@app/views/compensation/compensation-routing.module';
import { PaymentTableListComponent } from './payment-table-list/payment-table-list.component';
import { PaymentTableDetailsComponent } from './payment-table-details/payment-table-details.component';
import { PaymentTableSelectionComponent } from './payment-table-selection/payment-table-selection.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BusinessRuleListComponent } from './business-rule-list/business-rule-list.component';
import { BusinessRuleDetailsComponent } from './business-rule-details/business-rule-details.component';
import { CompensationSchemaDetailsComponent } from './compensation-schema-details/compensation-schema-details.component';
import { CompensationSchemaListComponent } from './compensation-schema-list/compensation-schema-list.component';
import { UploadConfigComponent } from './upload-config/upload-config.component';

@NgModule({
    imports: [
      CommonModule,
      CompensationRoutingModule,
      NgxDatatableModule,
      ReactiveFormsModule,
      SharedModule,
      ToolbarModule,
      TableModule,
      ButtonModule,
      DropdownModule,
      ModalModule.forRoot(),
    ],
    declarations: [
    PaymentTableListComponent,
    PaymentTableDetailsComponent,
    PaymentTableSelectionComponent,
    BusinessRuleListComponent,
    BusinessRuleDetailsComponent,
    CompensationSchemaDetailsComponent,
    CompensationSchemaListComponent,
    UploadConfigComponent
    ],
    providers: [ DataService ]
  })
  export class CompensationModule { }
