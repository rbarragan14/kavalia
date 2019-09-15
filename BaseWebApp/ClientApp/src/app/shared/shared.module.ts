import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { TreeModule } from 'primeng/tree';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TreeDragDropService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ButtonDeleteComponent,
         WeekDaysComponent,
         BaseFormComponent,
         BaseInputComponent,
         FieldErrorDisplayComponent,
         TreeSelectionComponent,
         PeriodSelectorComponent,
         LogoutComponent } from '@app/shared/components';

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { HierarchyTreeComponent } from '@app/shared/components/hierarchy-tree/hierarchy-tree.component';
import { ButtonDeleteNgComponent } from '@app/shared/components/button-delete-ng/button-delete-ng.component';
import { FormulaDefinitionComponent } from './components/formula-definition/formula-definition.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    FileUploadModule,
    CalendarModule,
    TreeModule,
    ModalModule,
    NgxDatatableModule,
    TabsModule,
    ToolbarModule,
    ConfirmationPopoverModule.forRoot()
  ],
  declarations: [
    ButtonDeleteComponent,
    ButtonDeleteNgComponent,
    FieldErrorDisplayComponent,
    BaseFormComponent,
    BaseInputComponent,
    LogoutComponent,
    WeekDaysComponent,
    TreeSelectionComponent,
    PeriodSelectorComponent,
    HierarchyTreeComponent,
    FormulaDefinitionComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDeleteComponent,
    ButtonDeleteNgComponent,
    BaseInputComponent,
    NgxDatatableModule,
    WeekDaysComponent,
    FormulaDefinitionComponent,
    TreeSelectionComponent,
    PeriodSelectorComponent,
    HierarchyTreeComponent,
    LogoutComponent
  ],
  providers: [
    TreeDragDropService
  ]
})
export class SharedModule { }
