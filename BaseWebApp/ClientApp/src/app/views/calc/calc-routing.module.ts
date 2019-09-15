import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulaListComponent } from './formula-list/formula-list.component';
import { FormulaDetailsComponent } from './formula-details/formula-details.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Fórmulas'
      },
      children: [
        {
          path: 'formulas',
          component: FormulaListComponent,
          data: {
            title: 'Fórmulas'
          },
        },
        {
          path: 'formulas/new',
          component: FormulaDetailsComponent,
          data: {
              title: 'Nueva Fórmula'
          }
        },
        {
          path: 'formulas/:id',
          component: FormulaDetailsComponent,
          data: {
              title: 'Fórmula'
          }
        }
      ]
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CalcRoutingModule {}
