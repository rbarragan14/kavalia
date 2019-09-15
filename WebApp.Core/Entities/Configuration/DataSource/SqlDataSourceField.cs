namespace WebApp.Core.Entities.Configuration.DataSource
{
    public class SqlDataSourceField
    {
      public int SqlDataSourceId { get; set; }

      public SqlDataSource SqlDataSource { get; set; }

      public int Id { get; set; }

      public SqlField SqlField { get; set; }

      public string Name => this.SqlField?.Name ?? string.Empty;
  }
}
