namespace WebApp.Core.Entities.Hierarchy
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class HierarchyStructureNode : IEntityBase, IEquatable<HierarchyStructureNode>
  {
    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public HierarchyStructureNode ChildNode { get; set; }

    public int? ParentNodeId { get; set; }

    public HierarchyStructureNode ParentNode { get; set; }

    public HierarchyStructure ParentStructure { get; set; }

    public bool Revisor { get; set; }

    public bool Equals(HierarchyStructureNode other)
    {
      if (other == null)
      {
        return false;
      }

      return string.Equals(this.Name, other.Name) && this.Revisor == other.Revisor
                                                  && (this.ParentNode?.Id ?? 0) == (other.ParentNode?.Id ?? 0)
                                                  && (this.ParentStructure?.Id ?? 0) == (other.ParentStructure?.Id ?? 0);
    }
  }
}
