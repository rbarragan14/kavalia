import { IRolePermission } from './RolePermission';

export interface IRole {
    id: number;
    name: string;
    description: string;
    permissions: Array<IRolePermission>;
}
