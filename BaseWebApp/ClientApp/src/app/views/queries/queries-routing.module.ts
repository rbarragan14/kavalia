import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualComponent } from '@app/views/queries/individual/individual.component';
import { IndividualTraceabilityComponent } from '@app/views/queries/individual-traceability/individual-traceability.component';
import { IndicatorResultsComponent } from '@app/views/queries/indicator-results/indicator-results.component';
import { IncidentsComponent } from '@app/views/queries/incidents/incidents.component';
import { RecommendedQuotaComponent } from '@app/views/queries/recommended-quota/recommended-quota.component';
import { QuotaByClientComponent } from '@app/views/queries/quota-by-client/quota-by-client.component';
import { QuotaDistributionComponent } from '@app/views/queries/quota-distribution/quota-distribution.component';
import { TrendPlainComponent } from '@app/views/queries/trend-plain/trend-plain.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consultas'
    },
    children: [
      {
        path: 'individual',
        component: IndividualComponent,
        data: {
          title: 'Consulta Individual'
        },
      },
      {
        path: 'individual-traceability',
        component: IndividualTraceabilityComponent,
        data: {
          title: 'Consulta Individual Trazabilidad'
        },
      },
      {
        path: 'trend',
        component: TrendPlainComponent,
        data: {
          title: 'Tendencia'
        },
      },
      {
        path: 'indicators',
        component: IndicatorResultsComponent,
        data: {
          title: 'Resultado Indicadores'
        },
      },
      {
        path: 'incidents',
        component: IncidentsComponent,
        data: {
          title: 'Incidencias'
        },
      },
      {
        path: 'recommended-quota',
        component: RecommendedQuotaComponent,
        data: {
          title: 'Cuota Recomendada'
        },
      },
      {
        path: 'quota-by-client',
        component: QuotaByClientComponent,
        data: {
          title: 'Cuota por Cliente'
        },
      },
      {
        path: 'quota-distribution',
        component: QuotaDistributionComponent,
        data: {
          title: 'Cuotas por Periodo de Disribución'
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueriesRoutingModule { }
