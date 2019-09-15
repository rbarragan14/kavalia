import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { IndicatorListComponent } from './indicator-list/indicator-list.component';
import { IndicatorsRoutingModule } from '@app/views/indicators/indicators-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { IndicatorDetailsComponent } from './indicator-details/indicator-details.component';
import { FormulationComponent } from './formulation/formulation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VariablesListComponent } from './variables-list/variables-list.component';
import { VariablesDetailsComponent } from './variables-details/variables-details.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    TableModule,
    ButtonModule,
    IndicatorsRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    IndicatorListComponent,
    IndicatorDetailsComponent,
    FormulationComponent,
    VariablesListComponent,
    VariablesDetailsComponent
]
})
export class IndicatorsModule { }
