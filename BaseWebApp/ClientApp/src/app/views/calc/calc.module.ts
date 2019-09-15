import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaListComponent } from './formula-list/formula-list.component';
import { FormulaDetailsComponent } from './formula-details/formula-details.component';
import { CalcRoutingModule } from './calc-routing.module';
import { DataService } from '@app/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CalcRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot()
  ],
  declarations: [
    FormulaListComponent,
    FormulaDetailsComponent],
  providers: [ DataService ]

})
export class CalcModule { }
