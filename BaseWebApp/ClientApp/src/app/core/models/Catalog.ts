import { ICatalogItem } from './CatalogItem';

export interface ICatalog {
    id: number;
    catalogId: string;
    name: string;
    canBeEdited: boolean;
    catalogItems: ICatalogItem[];
}
