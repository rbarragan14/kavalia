namespace WebApp.Core.Entities.Configuration.DataSource
{
    using System.ComponentModel.DataAnnotations;

    using WebApp.Core.Context;
    using WebApp.Core.Entities.Hierarchy;

    public class FileDataSourceField : IEntityBaseEquatable<FileDataSourceField>
    {
        public FileDataSource FileDataSource { get; set; }

        public HierarchyStructure HierarchyStructure { get; set; }

        public int? HierarchyStructureId { get; set; }

        public HierarchyStructureNode HierarchyStructureNode { get; set; }

        public int? HierarchyStructureNodeId { get; set; }

        [Key] public int Id { get; set; }

        public bool IsDate { get; set; }

        public string Name { get; set; }

        public int Position { get; set; }

        public bool Equals(FileDataSourceField other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return string.Equals(this.Name, other.Name) && this.IsDate.Equals(other.IsDate)
                                                        && this.HierarchyStructureId == other.HierarchyStructureId
                                                        && this.HierarchyStructureNodeId ==
                                                        other.HierarchyStructureNodeId
                                                        && this.Position == other.Position && this.Id == other.Id;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = this.Name != null ? this.Name.GetHashCode() : 0;
                hashCode = (hashCode * 397) ^ this.IsDate.GetHashCode();
                hashCode = (hashCode * 397) ^ (this.HierarchyStructureId != null ? this.HierarchyStructureId.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (this.HierarchyStructureNodeId != null ? this.HierarchyStructureNodeId.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ this.Position;
                hashCode = (hashCode * 397) ^ this.Id;
                return hashCode;
            }
        }

        public void Update(FileDataSourceField other, IModelContext modelContext)
        {
            this.Name = other.Name;
            this.IsDate = other.IsDate;
            this.HierarchyStructureId = other.HierarchyStructureId;
            this.HierarchyStructureNodeId = other.HierarchyStructureNodeId;
            this.Position = other.Position;
        }
    }
}
