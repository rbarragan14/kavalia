namespace WebApp.Core.Entities.Indicator
{
    using WebApp.Core.Context;

    public class IndicatorIndicator : IEntityBaseEquatable<IndicatorIndicator>
    {
        public void Update(IndicatorIndicator other, IModelContext modelContext)
        {
            this.IndicatorChildId = other.IndicatorChildId;
            this.VariableFormula = other.VariableFormula;
            this.PeriodOffset = other.PeriodOffset;
        }

        public int Id { get; set; }

        public Indicator Indicator { get; set; }

        public Indicator IndicatorChild { get; set; }

        public int IndicatorChildId { get; set; }

        public string IndicatorChildName => IndicatorChild?.Name;

        public string VariableFormula { get; set; }

        public int PeriodOffset { get; set; }

        public bool Equals(IndicatorIndicator other)
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
                   this.VariableFormula == other.VariableFormula &&
                   this.PeriodOffset == other.PeriodOffset &&
                   this.IndicatorChildId == other.IndicatorChildId;
        }
    }
}
