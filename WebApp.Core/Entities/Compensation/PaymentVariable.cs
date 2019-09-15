namespace WebApp.Core.Entities.Compensation
{
    using System.Collections.Generic;
    using System.Linq;

    using WebApp.Core.Context;

    public class PaymentVariable : IEntityBaseEquatable<PaymentVariable>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Variable { get; set; }

        public decimal? ValueReference { get; set; }

        public bool Aditional { get; set; }

        public decimal? AdjustmentFactor { get; set; }

        public decimal? FixedValue { get; set; }

        public CompensationSchema CompensationSchema { get; set; }

        public List<CompensationPaymentVariablePaymentTable> PaymentTables { get; set; }

        public int? Operator { get; set; }

        public int Indicator { get; set; }

        public bool Equals(PaymentVariable other)
        {
            return string.Equals(this.Name, other.Name) && this.Variable == other.Variable
                                                        && this.ValueReference == other.ValueReference
                                                        && this.Aditional == other.Aditional
                                                        && this.AdjustmentFactor == other.AdjustmentFactor
                                                        && this.FixedValue == other.FixedValue
                                                        && this.PaymentTableEquals(other.PaymentTables)
                                                        && this.Operator == other.Operator
                                                        && this.Indicator == other.Indicator && this.Id == other.Id;
        }

        private bool PaymentTableEquals(IEnumerable<CompensationPaymentVariablePaymentTable> otherPaymentTables)
        {
            var currentIds = this.PaymentTables?.Select(x => x.Id).ToArray() ?? new int[] { };
            var newIds = otherPaymentTables?.Select(x => x.Id).ToArray() ?? new int[] { };

            var firstNotSecond = currentIds.Except(newIds).ToList();
            var secondNotFirst = newIds.Except(currentIds).ToList();

            return !firstNotSecond.Any() && !secondNotFirst.Any();
        }

        public void Update(PaymentVariable other, IModelContext context)
        {
            this.Name = other.Name;
            this.Variable = other.Variable;
            this.ValueReference = other.ValueReference;
            this.Aditional = other.Aditional;
            this.AdjustmentFactor = other.AdjustmentFactor;
            this.FixedValue = other.FixedValue;
            this.Operator = other.Operator;
            this.Indicator = other.Indicator;

            context.SetModified(this);

            if (!this.PaymentTableEquals(other.PaymentTables))
            {
                if (this.PaymentTables == null)
                {
                    this.PaymentTables = new List<CompensationPaymentVariablePaymentTable>();
                }

                if (other.PaymentTables != null)
                {
                    other.PaymentTables.ForEach(t => t.PaymentVariable = this);
                    context.AddRemoveCollectionItems(this.PaymentTables, other.PaymentTables, table => table.Id);
                }
            }
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = (this.Name != null ? this.Name.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ this.Variable.GetHashCode();
                hashCode = (hashCode * 397) ^ this.ValueReference.GetHashCode();
                hashCode = (hashCode * 397) ^ this.Aditional.GetHashCode();
                hashCode = (hashCode * 397) ^ this.AdjustmentFactor.GetHashCode();
                hashCode = (hashCode * 397) ^ this.FixedValue.GetHashCode();
                hashCode = (hashCode * 397) ^ this.Id.GetHashCode();
                hashCode = (hashCode * 397) ^ (this.PaymentTables != null ? this.PaymentTables.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (this.Operator != null ? this.Operator.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ this.Indicator;
                return hashCode;
            }
        }
    }
}
