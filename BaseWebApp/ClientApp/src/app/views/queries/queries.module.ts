import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from '@app/shared/shared.module';
import { QueriesRoutingModule } from '@app/views/queries/queries-routing.module';
import { IndividualComponent } from './individual/individual.component';
import { IndividualTraceabilityComponent } from './individual-traceability/individual-traceability.component';
import { ChartsModule } from 'ng2-charts';
import { IndicatorResultsComponent } from './indicator-results/indicator-results.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { RecommendedQuotaComponent } from './recommended-quota/recommended-quota.component';
import { QuotaByClientComponent } from './quota-by-client/quota-by-client.component';
import { QuotaDistributionComponent } from './quota-distribution/quota-distribution.component';
import { TableModule } from 'primeng/table';
import { TrendPlainComponent } from '@app/views/queries/trend-plain/trend-plain.component';
import { TrendComponent } from '@app/views/queries/trend/trend.component';

@NgModule({
    imports: [
        CommonModule,
        QueriesRoutingModule,
        NgxDatatableModule,
        ReactiveFormsModule,
        SharedModule,
        ChartsModule,
        TableModule
    ],
    declarations: [
        IndividualComponent,
        IndividualTraceabilityComponent,
        TrendPlainComponent,
        TrendComponent,
        IndicatorResultsComponent,
        IncidentsComponent,
        RecommendedQuotaComponent,
        QuotaByClientComponent,
        QuotaDistributionComponent
    ],
    providers: [DataService]
})
export class QueriesModule { }
