export interface IIndicatorIndicator {
    idx: number;
    indicatorChildId: number;
    indicatorChildName: string;
    indicatorChild?:  { id: number, name: string };
    periodOffset: number;
    variableFormula: string;
}
