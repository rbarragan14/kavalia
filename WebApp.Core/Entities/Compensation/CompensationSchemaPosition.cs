using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Compensation
{
    public class CompensationSchemaPosition
    {
      public int CompensationSchemaId { get; set; }

      public CompensationSchema CompensationSchema { get; set; }

      public int Id { get; set; }

      public CatalogItem Position { get; set; }
    }
}
