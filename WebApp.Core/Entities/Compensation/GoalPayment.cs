namespace WebApp.Core.Entities.Compensation
{
    using WebApp.Core.Context;
    using WebApp.Core.Entities.Configuration;

    public class GoalPayment : IEntityBaseEquatable<GoalPayment>
    {
        public int Id { get; set; }

        public int PaymentTypeId { get; set; }

        public CatalogItem PaymentType { get; set; }

        public decimal? Percentage { get; set; }

        public decimal? PaymentMaxValue { get; set; }

        public int? GoalKindId { get; set; }

        public CatalogItem GoalKind { get; set; }

        public int? MaxLimitTypeId { get; set; }

        public decimal? KindValue { get; set; }

        public bool Equals(GoalPayment other)
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
                   this.PaymentTypeId == other.PaymentTypeId &&
                   this.MaxLimitTypeId == other.MaxLimitTypeId &&
                   this.Percentage == other.Percentage &&
                   this.GoalKindId == other.GoalKindId &&
                   this.KindValue == other.KindValue;
        }

        public void Update(GoalPayment other, IModelContext context)
        {
            this.PaymentTypeId = other.PaymentTypeId;
            this.MaxLimitTypeId = other.MaxLimitTypeId;
            this.Percentage = other.Percentage;
            this.GoalKindId = other.GoalKindId;
            this.KindValue = other.KindValue;
        }
    }
}
