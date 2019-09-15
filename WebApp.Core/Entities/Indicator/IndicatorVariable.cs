namespace WebApp.Core.Entities.Indicator
{
    using WebApp.Core.Context;

    public class IndicatorVariable : IEntityBaseEquatable<IndicatorVariable>
    {
        public void Update(IndicatorVariable other, IModelContext modelContext)
        {
            this.VariableId = other.VariableId;
            this.VariableFormula = other.VariableFormula;
            this.PeriodOffset = other.PeriodOffset;
        }

        public int Id { get; set; }

        public Indicator Indicator { get; set; }

        public Variable Variable { get; set; }

        public int VariableId { get; set; }

        public string VariableFormula { get; set; }

        public int PeriodOffset { get; set; }

        public bool Equals(IndicatorVariable other)
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
                   this.VariableId == other.VariableId;
        }
    }
}
