using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class FileDataSource : IEntityBase
    {
      [Key]
      public int Id { get; set; }

      public string Name { get; set; }

      public int FileFormat { get; set; }

      public int FileType { get; set; }

      public Indicator.Indicator Indicator { get; set; }

      public List<FileDataSourceField> FileDataSourceFields { get; set; }
  }
}
