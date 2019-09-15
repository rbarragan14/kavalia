import { ICatalogItem, ICatalog } from '@app/core';

export interface ICatalogAssociate {
    parentCatalog: ICatalog;
    parentCatalogId: number;
    childCatalog: ICatalog;
    childCatalogId: number;
    parentCatalogItem: ICatalogItem;
    parentCatalogItemId: number;
    catalogItems: ICatalogItem[];
}
