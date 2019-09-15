namespace WebApp.Core.Entities.Compensation
{
    using WebApp.Core.Entities.Hierarchy;

    public class PaymentTableHierarchy : IEntityBase
    {
        public int PaymentTableId { get; set; }

        public HierarchyStructure HierarchyStructure { get; set; }

        public int HierarchyStructureId { get; set; }

        public HierarchyStructureNode HierarchyStructureNode { get; set; }

        public int HierarchyStructureNodeId { get; set; }

        public int Id { get; set; }
    }
}
