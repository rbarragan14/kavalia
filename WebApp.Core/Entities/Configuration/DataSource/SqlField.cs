using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class SqlField
    {
      [Key]
      public int Id { get; set; }

      public string Name { get; set; }

      public string Type { get; set; }
  }
}
