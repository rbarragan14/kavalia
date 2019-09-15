export interface IIndicatorVariable {
    id: number;
    variable?:  { id: number, name: string };
    variableId: number;
    periodOffset: number;
    variableFormula: string;
}
