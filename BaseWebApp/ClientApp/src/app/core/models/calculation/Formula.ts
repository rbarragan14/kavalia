export interface IFormula {
    id: number;
    name: string;
    body: string;
    parameters: IParameterFormula[];
}

export interface IParameterFormula {
    id: number;
    name: string;
    value: string;
}
