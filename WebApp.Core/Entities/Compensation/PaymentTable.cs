namespace WebApp.Core.Entities.Compensation
{
    using System;
    using System.Collections.Generic;

    public class PaymentTable : IEntityBase
    {
        public DateTime? FinalDate { get; set; }

        public int Id { get; set; }

        public int TableType { get; set; }

        public int ThresholdType { get; set; }

        public int? PercentageIndicatorType { get; set; }

        public int Version { get; set; }

        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public List<PaymentTableIndicator> Indicators { get; set; }

        public List<PaymentTableHierarchy> Hierarchies { get; set; }
    }
}
