using WebApp.Core.Entities.Configuration.DataSource;

namespace WebApp.Core.Entities.Compensation
{
    public class UploadConfigurationField: IEntityBase
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public SqlDataSourceField SqlDataSourceField { get; set; }

    public int? SqlDataSourceFieldId { get; set; }

    public FileDataSourceField FileDataSourceField { get; set; }

    public int? FileDataSourceFieldId { get; set; }
  }
}
