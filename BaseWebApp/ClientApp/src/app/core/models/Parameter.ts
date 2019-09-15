export interface IParameter {
    id: number;
    parameterId: string;
    name: string;
    value: string;
    type: string;
    resource?: string;
    resourceName?: string;
    options?: string;
}
