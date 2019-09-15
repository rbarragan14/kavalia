using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApp.Core.Entities.Hierarchy
{
    public class HierarchyTreeNode : IEntityBase, IEquatable<HierarchyTreeNode>
  {
    public List<HierarchyTreeNode> ChildNodes { get; set; }

    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public int? ParentNodeId { get; set; }

    public int? StructureNodeId { get; set; }

    public HierarchyTreeNode ParentNode { get; set; }

    [JsonIgnore]
    public HierarchyStructureNode StructureNode { get; set; }

    public HierarchyTree ParentTree { get; set; }

    public string Value { get; set; }

    public bool Revisor { get; set; }

    public bool Equals(HierarchyTreeNode other)
    {
      if (other == null)
      {
        return false;
      }

      return string.Equals(this.Name, other.Name) && this.Revisor == other.Revisor
                                                  && (this.ParentNode?.Id ?? 0) == (other.ParentNode?.Id ?? 0)
                                                  && (this.ParentTree?.Id ?? 0) == (other.ParentTree?.Id ?? 0);
    }
  }
}
