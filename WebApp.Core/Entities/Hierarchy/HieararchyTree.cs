using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Hierarchy
{
    public class HierarchyTree : IEntityBase
  {
    public bool ActiveStatus { get; set; }

    public List<HierarchyTreeNode> ChildNodes { get; set; }

    public string Description { get; set; }

    public DateTime? FinalDate { get; set; }

    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public DateTime StartDate { get; set; }

    public HierarchyStructure HierarchyStructure { get; set; }

    public int HierarchyStructureId { get; set; }

    public int Version { get; set; }

    public CatalogItem Time { get; set; }

    public int TimeId { get; set; }

    public Company Company { get; set;}
  }
}
