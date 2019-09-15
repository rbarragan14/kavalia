using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class SqlDataBase : IEntityBase
    {
      [Key]
      public int Id { get; set; }

      public string Name { get; set; }

      public List<SqlTable> SqlTables { get; set; }

  }
}
