import { NgModule } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { AuditlogListComponent } from './auditlog-list/auditlog-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserDelegateListComponent } from './user-delegate-list/user-delegate-list.component';
import { UserDelegateDetailComponent } from './user-delegate-detail/user-delegate-detail.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { UserDataAccessComponent } from './user-data-access/user-data-access.component';
import { UserPasswordComponent } from './user-password/user-password.component';

@NgModule({
  imports: [
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    RoleListComponent,
    RoleDetailComponent,
    AuditlogListComponent,
    UserDelegateListComponent,
    UserDelegateDetailComponent,
    ApplicationListComponent,
    UserPasswordComponent,
    ApplicationDetailsComponent,
    UserDataAccessComponent
  ],
  providers: [DataService]
})
export class AccountModule { }
