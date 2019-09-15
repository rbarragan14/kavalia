using WebApp.Core.Entities.Configuration.DataSource;

namespace WebApp.Core.Entities.Indicator
{
    using WebApp.Core.Context;

    public class AssociatedData: IEntityBaseEquatable<AssociatedData>
  {
    public void Update(AssociatedData other, IModelContext modelContext)
    {
      this.Name = other.Name;
      this.Description = other.Description;
      this.SqlDataSourceId = other.SqlDataSourceId;
      this.SqlFieldId = other.SqlFieldId;
    }

    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public SqlDataSource SqlDataSource { get; set; }

    public int SqlDataSourceId { get; set; }

    public SqlField SqlField { get; set; }

    public int SqlFieldId { get; set; }

    public Indicator Indicator { get; set; }

    public bool Equals(AssociatedData other)
    {
      if (other is null)
      {
        return false;
      }

      if (ReferenceEquals(this, other))
      {
        return true;
      }

      return this.Id == other.Id &&
             this.Name == other.Name &&
             this.Description == other.Description &&
             this.SqlDataSourceId == other.SqlDataSourceId &&
             this.SqlFieldId == other.SqlFieldId;
    }
  }
}
