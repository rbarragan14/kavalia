namespace WebApp.Infrastructure.ViewModels.Catalog
{
    using System.Collections.Generic;

    using WebApp.Core.Entities.Configuration;

    public class CatalogAssociateViewModel
    {
        public int ChildCatalogId { get; set; }

        public int ParentCatalogId { get; set; }

        public int ParentCatalogItemId { get; set; }

        public List<CatalogItem> CatalogItems { get; set; }
    }
}
