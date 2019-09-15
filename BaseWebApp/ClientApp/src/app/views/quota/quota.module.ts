import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotaRoutingModule } from '@app/views/quota/quota-routing.module';
import { IndicatorHierarchySelectionComponent } from './indicator-hierarchy-selection/indicator-hierarchy-selection.component';
import { GlobalGoalComponent } from './global-goal/global-goal.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { TreeModule } from 'primeng/tree';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TreeTableModule } from 'primeng/treetable';
import { ApplyFormulaComponent } from './apply-formula/apply-formula.component';
import { OpenQuotaComponent } from './open-quota/open-quota.component';
import { QuotaReviewComponent } from './quota-review/quota-review.component';
import { DataImportComponent } from './data-import/data-import.component';
import { WeightDaysComponent } from './weight-days/weight-days.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    SharedModule,
    TreeModule,
    QuotaRoutingModule,
    TreeTableModule,
    CalendarModule,
    TableModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    IndicatorHierarchySelectionComponent,
    GlobalGoalComponent,
    ApplyFormulaComponent,
    OpenQuotaComponent,
    QuotaReviewComponent,
    DataImportComponent,
    WeightDaysComponent,
    HolidaysComponent
]
})
export class QuotaModule { }
