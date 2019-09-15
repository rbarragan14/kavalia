using WebApp.Core.Entities.Configuration;
using WebApp.Core.Entities.Configuration.DataSource;

namespace WebApp.Core.Entities.Indicator
{
    public class Variable : IEntityBase
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public int Version { get; set; }

    public string Description { get; set; }

    public bool ActiveStatus { get; set; }

    public bool GroupPositions { get; set; }

    public int OperatorId { get; set; }

    public DataSourceType SourceTypeId { get; set; }

    public SqlDataSource SqlDataSource { get; set; }

    public int? SqlDataSourceId { get; set; }

    public SqlField SqlField { get; set; }

    public int? SqlFieldId { get; set; }

    public SqlField SqlFieldGroup { get; set; }

    public int? SqlFieldGroupId { get; set; }

    public FileDataSource FileDataSource { get; set; }

    public int? FileDataSourceId { get; set; }

    public FileDataSourceField FileField { get; set; }

    public int? FileFieldId { get; set; }

    public int? FileFieldGroupId { get; set; }

    public Company Company { get; set;}
  }
}
