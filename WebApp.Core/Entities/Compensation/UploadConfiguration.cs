using System.Collections.Generic;
using WebApp.Core.Entities.Configuration.DataSource;

namespace WebApp.Core.Entities.Compensation
{
    public class UploadConfiguration: IEntityBase
  {
    public int Id { get; set; }

    public UploadConfigurationType Type { get; set; }  //// 1 -> Incident, 2 -> PaySheet

    public string FileName { get; set; }

    public DataSourceType SourceTypeId { get; set; }

    public SqlDataSource SqlDataSource { get; set; }

    public int? SqlDataSourceId { get; set; }

    public FileDataSource FileDataSource { get; set; }

    public int? FileDataSourceId { get; set; }

    public List<UploadConfigurationField> UploadConfigurationFields { get; set; }
  }

  public enum UploadConfigurationType
  {
    Incident = 1,

    PaySheet = 2,

    Indicator = 3
  }
}
