// --------------------------------------------------------------------------------------------------------------------
// <copyright file="SqlDataSource.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the SqlDataSource type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class SqlDataSource : IEntityBase
    {
      [Key]
      public int Id { get; set; }

      public string Name { get; set; }

      public string Description { get; set; }

      public bool ActiveStatus { get; set; }

      public int SqlDataBaseId { get; set; }

      public SqlDataBase SqlDataBase { get; set; }

      public int SqlTableId { get; set; }

      public SqlTable SqlTable { get; set; }

      public int? SqlDateFieldId { get; set; }

      public SqlField SqlDateField { get; set; }

      public List<SqlDataSourceField> SqlFields { get; set; }

      public string Query { get; set; }
  }
}
