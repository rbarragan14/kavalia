namespace WebApp.Core.Entities.Compensation
{
    using System.Collections.Generic;
    using System.Linq;

    using WebApp.Core.Context;

    public class PaymentTableIndicator : IEntityBaseEquatable<PaymentTableIndicator>
    {
        public int PaymentTableId { get; set; }

        public PaymentTable PaymentTable { get; set; }

        public int Id { get; set; }

        public Indicator.Indicator Indicator { get; set; }

        public GoalPayment GoalPayment { get; set; }

        public int? GoalPaymentId { get; set; }

        public List<ThresholdDetail> ThresholdDetails { get; set; }

        private bool ThresholdDetailsEquals(IList<ThresholdDetail> other)
        {
            var currentIds = this.ThresholdDetails?.Select(x => x.Id).ToArray() ?? new int[] { };
            var newIds = other?.Select(x => x.Id).ToArray() ?? new int[] { };

            var firstNotSecond = currentIds.Except(newIds).ToList();
            var secondNotFirst = newIds.Except(currentIds).ToList();

            if (firstNotSecond.Any() || secondNotFirst.Any())
            {
                return false;
            }

            if (this.ThresholdDetails != null && other != null)
            {
                foreach (var thresholdDetail in this.ThresholdDetails)
                {
                    var otherThreshold = other.FirstOrDefault(i => i.Id == thresholdDetail.Id);

                    if (otherThreshold == null || !otherThreshold.Equals(thresholdDetail))
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        /// <summary>
        /// The equals.
        /// </summary>
        /// <param name="other">
        /// The other.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public bool Equals(PaymentTableIndicator other)
        {
            if (this.GoalPayment is null && !(other.GoalPayment is null))
            {
                return false;
            }

            if (this.GoalPayment is null && other.GoalPayment is null)
            {
                return true;
            }

            return this.GoalPayment.Equals(other.GoalPayment) && this.ThresholdDetailsEquals(other.ThresholdDetails);
        }

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="other">
        /// The other.
        /// </param>
        /// <param name="context">
        /// The context.
        /// </param>
        public void Update(PaymentTableIndicator other, IModelContext context)
        {
            if ((this.GoalPayment is null && !(other.GoalPayment is null))
                || !this.GoalPayment.Equals(other.GoalPayment))
            {
                if (this.GoalPayment is null || other.GoalPayment is null)
                {
                    this.GoalPayment = other.GoalPayment;
                    context.SetModified(this);
                }
                else
                {
                    this.GoalPayment.Update(other.GoalPayment, context);
                    context.SetModified(this.GoalPayment);
                }
            }

            if (!this.ThresholdDetailsEquals(other.ThresholdDetails))
            {
                other.ThresholdDetails?.ForEach(t => t.PaymentTableIndicator = this);
                context.AddRemoveUpdateCollectionItems(this.ThresholdDetails, other.ThresholdDetails, k => k.Id);
            }
        }
    }
}
