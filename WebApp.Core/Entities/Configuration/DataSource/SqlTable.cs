using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class SqlTable : IEntityBase
    {
      [Key]
      public int Id { get; set; }

      public string Name { get; set; }

      public SqlDataBase SqlDataBase { get; set; }

      public List<SqlField> Fields { get; set; }
  }
}
