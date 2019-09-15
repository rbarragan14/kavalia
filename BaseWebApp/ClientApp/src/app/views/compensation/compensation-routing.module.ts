import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentTableListComponent } from '@app/views/compensation/payment-table-list/payment-table-list.component';
import { PaymentTableDetailsComponent } from '@app/views/compensation/payment-table-details/payment-table-details.component';
import { BusinessRuleListComponent } from '@app/views/compensation/business-rule-list/business-rule-list.component';
import { BusinessRuleDetailsComponent } from '@app/views/compensation/business-rule-details/business-rule-details.component';
import { PaymentTableSelectionComponent } from '@app/views/compensation/payment-table-selection/payment-table-selection.component';
import { CompensationSchemaListComponent } from '@app/views/compensation/compensation-schema-list/compensation-schema-list.component';
import {
  CompensationSchemaDetailsComponent } from '@app/views/compensation/compensation-schema-details/compensation-schema-details.component';
import { UploadConfigComponent } from '@app/views/compensation/upload-config/upload-config.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Compensación'
    },
    children: [
      {
        path: 'payment-table',
        component: PaymentTableListComponent,
        data: {
          title: 'Tablas de Pago'
        },
      },
      {
        path: 'payment-table/new',
        component: PaymentTableDetailsComponent,
        data: {
          title: 'Tablas de Pago'
        },
      },
      {
        path: 'payment-table/version/:id',
        component: PaymentTableDetailsComponent,
        data: {
          title: 'Tablas de Pago'
        },
      },
      {
        path: 'payment-table/copy/:id',
        component: PaymentTableDetailsComponent,
        data: {
          title: 'Tablas de Pago'
        },
      },
      {
        path: 'payment-table/:id',
        component: PaymentTableDetailsComponent,
        data: {
          title: 'Tablas de Pago'
        },
      },
      {
        path: 'payment-table-selection',
        component: PaymentTableSelectionComponent,
        data: {
          title: 'Selección tabla de pagos'
        },
      },
      {
        path: 'schema',
        component: CompensationSchemaListComponent,
        data: {
          title: 'Esquema Compensación'
        },
      },
      {
        path: 'schema/new',
        component: CompensationSchemaDetailsComponent,
        data: {
          title: 'Esquema Compensación'
        },
      },
      {
        path: 'schema/:id',
        component: CompensationSchemaDetailsComponent,
        data: {
          title: 'Esquema Compensación'
        },
      },
      {
        path: 'business-rules',
        component: BusinessRuleListComponent,
        data: {
          title: 'Reglas de negocio'
        },
      },
      {
        path: 'business-rules/new',
        component: BusinessRuleDetailsComponent,
        data: {
          title: 'Reglas de negocio'
        },
      },
      {
        path: 'business-rules/version/:id',
        component: BusinessRuleDetailsComponent,
        data: {
          title: 'Reglas de negocio'
        },
      },
      {
        path: 'business-rules/:id',
        component: BusinessRuleDetailsComponent,
        data: {
          title: 'Reglas de negocio'
        },
      },
      {
        path: 'incidents-upload-config',
        component: UploadConfigComponent,
        data: {
          title: 'Configuración Carga Incidencia',
          UploadType: 1
        },
      },
      {
        path: 'paysheet-upload-config',
        component: UploadConfigComponent,
        data: {
          title: 'Configuración Carga Lista de Empleados',
          UploadType: 2
        },
      },
      {
        path: 'indicator-upload-config',
        component: UploadConfigComponent,
        data: {
          title: 'Configuración Carga de Indicadores',
          UploadType: 3
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationRoutingModule { }
