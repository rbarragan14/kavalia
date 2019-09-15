import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndicatorListComponent } from '@app/views/indicators/indicator-list/indicator-list.component';
import { IndicatorDetailsComponent } from '@app/views/indicators/indicator-details/indicator-details.component';
import { FormulationComponent } from '@app/views/indicators/formulation/formulation.component';
import { VariablesListComponent } from '@app/views/indicators/variables-list/variables-list.component';
import { VariablesDetailsComponent } from '@app/views/indicators/variables-details/variables-details.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Indicadores'
    },
    children: [
      {
        path: 'indicators',
        component: IndicatorListComponent,
        data: {
          title: 'Indicadores'
        },
      },
      {
        path: 'indicator/new',
        component: IndicatorDetailsComponent,
        data: {
          title: 'Indicadores'
        },
      },
      {
        path: 'indicator/copy/:id',
        component: IndicatorDetailsComponent,
        data: {
          title: 'Indicadores'
        },
      },
      {
        path: 'indicator/:id',
        component: IndicatorDetailsComponent,
        data: {
          title: 'Indicadores'
        },
      },
      {
        path: 'indicator/:id/formulation',
        component: FormulationComponent,
        data: {
          title: 'Formulación Indicador'
        },
      },
      {
        path: 'variables',
        component: VariablesListComponent,
        data: {
          title: 'Definir Variables'
        },
      },
      {
        path: 'variable/new',
        component: VariablesDetailsComponent,
        data: {
          title: 'Definir Variables'
        },
      },
      {
        path: 'variable/version/:id',
        component: VariablesDetailsComponent,
        data: {
          title: 'Definir Variables'
        },
      },
      {
        path: 'variable/:id',
        component: VariablesDetailsComponent,
        data: {
          title: 'Definir Variables'
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorsRoutingModule { }
