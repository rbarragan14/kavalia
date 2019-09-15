import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndicatorHierarchySelectionComponent } from './indicator-hierarchy-selection/indicator-hierarchy-selection.component';
import { GlobalGoalComponent } from './global-goal/global-goal.component';
import { ApplyFormulaComponent } from './apply-formula/apply-formula.component';
import { OpenQuotaComponent } from './open-quota/open-quota.component';
import { QuotaReviewComponent } from './quota-review/quota-review.component';
import { DataImportComponent } from './data-import/data-import.component';
import { WeightDaysComponent } from '@app/views/quota/weight-days/weight-days.component';
import { HolidaysComponent } from '@app/views/quota/holidays/holidays.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cuotas'
    },
    children: [
      {
        path: 'selection',
        component: IndicatorHierarchySelectionComponent,
        data: {
          title: 'Selección'
        },
      },
      {
        path: 'global-goal',
        component: GlobalGoalComponent,
        data: {
          title: 'Meta Global'
        },
      },
      {
        path: 'apply-formula',
        component: ApplyFormulaComponent,
        data: {
          title: 'Fórmula de Distribución'
        },
      },
      {
        path: 'open-quota',
        component: OpenQuotaComponent,
        data: {
          title: 'Abrir Cuotas'
        },
      },
      {
        path: 'quota-review',
        component: QuotaReviewComponent,
        data: {
          title: 'Revisar Cuotas'
        },
      },
      {
        path: 'data-import',
        component: DataImportComponent,
        data: {
          title: 'Importar Cuotas'
        },
      },
      {
        path: 'weight-days',
        component: WeightDaysComponent,
        data: {
          title: 'Pesos por período'
        },
      },
      {
        path: 'holidays',
        component: HolidaysComponent,
        data: {
          title: 'Días no laborables'
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotaRoutingModule { }
