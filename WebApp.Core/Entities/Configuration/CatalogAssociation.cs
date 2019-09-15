namespace WebApp.Core.Entities.Configuration
{
    public class CatalogAssociation
    {
        public CatalogItem ParentCatalogItem { get; set; }

        public int ParentCatalogItemId { get; set; }

        public CatalogItem ChildCatalogItem { get; set; }

        public int ChildCatalogItemId { get; set; }
    }
}