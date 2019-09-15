import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent } from './containers';
import { LoginComponent } from '@app/views/login/login.component';
import { LoginActivate } from '@app/core/services/login-activate.service';
import { LogoutComponent } from '@app/shared/components';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [LoginActivate],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'config',
        loadChildren: './views/config/config.module#ConfigModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'account',
        loadChildren: './views/account/account.module#AccountModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'task',
        loadChildren: './views/task/task.module#TaskModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'calc',
        loadChildren: './views/calc/calc.module#CalcModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'process-config',
        loadChildren: './views/process-config/process-config.module#ProcessConfigModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'org-structure',
        loadChildren: './views/org-structure/org-structure.module#OrgStructureModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'compensation',
        loadChildren: './views/compensation/compensation.module#CompensationModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'queries',
        loadChildren: './views/queries/queries.module#QueriesModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'datasource',
        loadChildren: './views/datasource/datasource.module#DatasourceModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'indicators',
        loadChildren: './views/indicators/indicators.module#IndicatorsModule',
        canActivate: [LoginActivate]
      },
      {
        path: 'quota',
        loadChildren: './views/quota/quota.module#QuotaModule',
        canActivate: [LoginActivate]
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
