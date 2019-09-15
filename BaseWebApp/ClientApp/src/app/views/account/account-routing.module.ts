import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { AuditlogListComponent } from '@app/views/account/auditlog-list/auditlog-list.component';
import { UserDelegateListComponent } from '@app/views/account/user-delegate-list/user-delegate-list.component';
import { UserDelegateDetailComponent } from '@app/views/account/user-delegate-detail/user-delegate-detail.component';
import { UserDataAccessComponent } from '@app/views/account/user-data-access/user-data-access.component';
import { UserPasswordComponent } from './user-password/user-password.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Usuarios'
        },
        children: [
            {
                path: 'users',
                component: UserListComponent,
                data: {
                    title: 'Usuarios'
                },
            },
            {
                path: 'users/new',
                component: UserDetailComponent,
                data: {
                    title: 'Nuevo Usuario'
                }
            },
            {
                path: 'users/:id',
                component: UserDetailComponent,
                data: {
                    title: 'Usuario'
                }
            },
            {
                path: 'roles',
                component: RoleListComponent,
                data: {
                    title: 'Roles'
                }
            },
            {
                path: 'roles/new',
                component: RoleDetailComponent,
                data: {
                    title: 'Nuevo Rol'
                }
            },
            {
                path: 'roles/:id',
                component: RoleDetailComponent,
                data: {
                    title: 'Rol'
                }
            },
            {
                path: 'delegate',
                component: UserDelegateListComponent,
                data: {
                    title: 'Delegar'
                }
            },
            {
                path: 'delegate/new',
                component: UserDelegateDetailComponent,
                data: {
                    title: 'Delegar'
                }
            },
            {
                path: 'delegate/:id',
                component: UserDelegateDetailComponent,
                data: {
                    title: 'Delegar'
                }
            },
            {
                path: 'auditlogs',
                component: AuditlogListComponent,
                data: {
                    title: 'Auditoría'
                }
            },
            {
                path: 'data-access/:id',
                component: UserDataAccessComponent,
                data: {
                    title: 'Acceso a Datos'
                },
            },
            {
                path: 'set-password',
                component: UserPasswordComponent,
                data: {
                    title: 'Cambiar Contraseña'
                },
            },
            {
                path: 'set-password/:id',
                component: UserPasswordComponent,
                data: {
                    title: 'Cambiar Contraseña'
                },
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
