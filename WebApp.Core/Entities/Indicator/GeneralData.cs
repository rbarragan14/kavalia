namespace WebApp.Core.Entities.Indicator
{
    using WebApp.Core.Context;

    public class GeneralData: IEntityBaseEquatable<GeneralData>
  {
    public void Update(GeneralData other, IModelContext modelContext)
    {
      this.Name = other.Name;
      this.Value = other.Value;
    }

    public int Id { get; set; }

    public string Name { get; set; }

    public string Value { get; set; }

    public Indicator Indicator { get; set; }

    public bool Equals(GeneralData other)
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
             this.Value == other.Value;
    }
  }
}
