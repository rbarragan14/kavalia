// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ThresholdDetail.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ThresholdDetail type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Core.Entities.Compensation
{
    using WebApp.Core.Context;

    public class ThresholdDetail : IEntityBaseEquatable<ThresholdDetail>
  {
    public int Id { get; set; }

    public decimal? Percentage { get; set; }

    public int? UnitNumber { get; set; }

    public decimal? ThresholdLow { get; set; }

    public decimal? ThresholdUp { get; set; }

    public decimal? FixedValue { get; set; }

    public decimal? PercentageUnit { get; set; }

    public PaymentTableIndicator PaymentTableIndicator {get; set;}

    public bool Equals(ThresholdDetail other)
    {
      return this.Percentage == other.Percentage && this.UnitNumber == other.UnitNumber
                                                 && this.ThresholdLow == other.ThresholdLow
                                                 && this.ThresholdUp == other.ThresholdUp
                                                 && this.FixedValue == other.FixedValue
                                                 && this.PercentageUnit == other.PercentageUnit;
    }

    public void Update(ThresholdDetail other, IModelContext modelContext)
    {
      this.Percentage = other.Percentage;
      this.UnitNumber = other.UnitNumber;
      this.ThresholdLow = other.ThresholdLow;
      this.ThresholdUp = other.ThresholdUp;
      this.FixedValue = other.FixedValue;
      this.PercentageUnit = other.PercentageUnit;
    }
  }
}
