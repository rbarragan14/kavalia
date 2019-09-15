export interface INavigationItem {
    name: string;
    url: string;
    icon: string;
    divider: boolean;
    title: boolean;
    children: INavigationItem[];
    class: string;
}
