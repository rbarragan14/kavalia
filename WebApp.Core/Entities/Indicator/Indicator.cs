using System;
using System.Collections.Generic;
using WebApp.Core.Entities.Configuration;
using WebApp.Core.Entities.Hierarchy;

namespace WebApp.Core.Entities.Indicator
{
    public class Indicator : IEntityBase
    {
        public DateTime? FinalDate { get; set; }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Comments { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public int IndicatorTypeId { get; set; }

        public CatalogItem IndicatorType { get; set; }

        public decimal? ThresholdMin { get; set; }

        public decimal? ThresholdMid { get; set; }

        public decimal? ThresholdMax { get; set; }

        public CatalogItem Periodicity { get; set; }

        public int PeriodicityId { get; set; }

        public int UssageId { get; set; }

        public int DataInputId { get; set; }

        public bool ActiveStatus { get; set; }

        public string Formula { get; set; }

        public List<IndicatorVariable> Variables { get; set; }

        public List<IndicatorIndicator> Indicators { get; set; }

        public List<GeneralData> GeneralData { get; set; }

        public List<AssociatedData> AssociatedData { get; set; }

        public HierarchyStructure HierarchyStructure { get; set; }

        public int? HierarchyStructureId { get; set; }

        public HierarchyStructureNode HierarchyStructureNode { get; set; }

        public int? HierarchyStructureNodeId { get; set; }

        public Company Company { get; set;}
    }
}
