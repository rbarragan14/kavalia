using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Hierarchy
{
    public class HierarchyStructure : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? FinalDate { get; set; }

        public Boolean ActiveStatus { get; set;}

        public Boolean Revisor { get; set;}

        public List<HierarchyStructureNode> ChildNodes { get; set; }

        public Company Company { get; set;}

        public int Version { get; set; }

        public bool GroupByPosition { get; set; }

        public CatalogItem Position { get; set; }

        public int? PositionId { get; set; }

    }
}
