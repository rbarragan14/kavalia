namespace WebApp.Infrastructure.Services
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using WebApp.Core.Entities.Hierarchy;
    using WebApp.Infrastructure.Repositories;

    public class HierarchyServices
    {
        private readonly UnitOfWork unitOfWork;

        public HierarchyServices(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<HierarchyStructure> GetHierarchyStructureAsync(int id)
        {
            var item = await this.unitOfWork.HierarchyStructureRepository.GetSingleAsync(id, s => s.ChildNodes);
            if (item == null)
            {
                return null;
            }

            foreach (var hierarchyStructureNode in item.ChildNodes)
            {
                await this.LoadRecursively(hierarchyStructureNode);
            }

            return item;
        }

        public async Task<bool> UpdateHierarchyStructureAsync(HierarchyStructure item, int id)
        {
            var hierarchy = await this.unitOfWork.HierarchyStructureRepository.GetSingleAsync(id, s => s.ChildNodes);
            if (hierarchy == null)
            {
                return false;
            }

            foreach (var hierarchyStructureNode in hierarchy.ChildNodes)
            {
                await this.LoadRecursively(hierarchyStructureNode);
            }

            hierarchy.Name = item.Name;
            hierarchy.Description = item.Description;
            hierarchy.StartDate = item.StartDate;
            hierarchy.FinalDate = item.FinalDate;
            hierarchy.ActiveStatus = item.ActiveStatus;
            hierarchy.GroupByPosition = item.GroupByPosition;
            hierarchy.PositionId = item.GroupByPosition ? item.PositionId : null;

            var originalNodes = this.GetPlainNodeList(hierarchy.ChildNodes);
            this.SetParentNodes(item, hierarchy, originalNodes);
            var modifiedNodes = this.GetPlainNodeList(item.ChildNodes);

            var deleted = originalNodes.Where(p => modifiedNodes.All(p2 => p2.Id != p.Id));
            var newNodes = modifiedNodes.Where(n => n.Id <= 0);

            foreach (var newNode in newNodes)
            {
                newNode.ChildNode = null;
                await this.unitOfWork.HierarchyStructureNodeRepository.AddAsync(newNode);
            }

            foreach (var originalNode in originalNodes)
            {
                var updated = modifiedNodes.FirstOrDefault(n => n.Id == originalNode.Id);
                if (updated != null && !updated.Equals(originalNode))
                {
                    originalNode.Name = updated.Name;

                    if (updated.ParentNodeId == 0)
                    {
                        originalNode.ParentNode = updated.ParentNode;
                        originalNode.ParentNodeId = null;
                    }
                    else
                    {
                        originalNode.ParentNode = null;
                        originalNode.ParentNodeId = updated.ParentNodeId;
                    }

                    originalNode.ParentStructure = updated.ParentStructure != null ? hierarchy : null;
                    this.unitOfWork.HierarchyStructureNodeRepository.Edit(originalNode);
                }
            }

            foreach (var deletedNode in deleted)
            {
                this.unitOfWork.HierarchyStructureNodeRepository.Delete(deletedNode);
            }

            this.unitOfWork.HierarchyStructureRepository.Edit(hierarchy);
            await this.unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> UpdateHierarchyTreeAsync(HierarchyTree item, int id)
        {
            var hierarchy = await this.unitOfWork.HierarchyTreeRepository.GetSingleAsync(id, s => s.ChildNodes);
            if (hierarchy == null)
            {
                return false;
            }

            foreach (var hierarchyStructureNode in hierarchy.ChildNodes)
            {
                await this.LoadRecursively(hierarchyStructureNode);
            }

            hierarchy.Name = item.Name;
            hierarchy.Description = item.Description;
            hierarchy.TimeId = item.TimeId;
            hierarchy.StartDate = item.StartDate;
            hierarchy.FinalDate = item.FinalDate;
            hierarchy.ActiveStatus = item.ActiveStatus;

            var originalNodes = this.GetPlainNodeList(hierarchy.ChildNodes);
            this.SetParentNodes(item, hierarchy, originalNodes);
            var modifiedNodes = this.GetPlainNodeList(item.ChildNodes);

            var deleted = originalNodes.Where(p => modifiedNodes.All(p2 => p2.Id != p.Id));
            var newNodes = modifiedNodes.Where(n => n.Id <= 0);

            foreach (var newNode in newNodes)
            {
                newNode.ChildNodes = null;
                await this.unitOfWork.HierarchyTreeNodeRepository.AddAsync(newNode);
            }

            foreach (var originalNode in originalNodes)
            {
                var updated = modifiedNodes.FirstOrDefault(n => n.Id == originalNode.Id);
                if (updated != null && !updated.Equals(originalNode))
                {
                    originalNode.Name = updated.Name;

                    if (updated.ParentNodeId == 0)
                    {
                        originalNode.ParentNode = updated.ParentNode;
                        originalNode.ParentNodeId = null;
                    }
                    else if (originalNode.ParentNodeId != updated.ParentNodeId)
                    {
                        originalNode.ParentNode = null;
                        originalNode.ParentNodeId = updated.ParentNodeId;
                    }

                    originalNode.Revisor = updated.Revisor;
                    originalNode.ParentTree = updated.ParentTree != null ? hierarchy : null;
                    this.unitOfWork.HierarchyTreeNodeRepository.Edit(originalNode);
                }
            }

            foreach (var deletedNode in deleted)
            {
                this.unitOfWork.HierarchyTreeNodeRepository.Delete(deletedNode);
            }

            this.unitOfWork.HierarchyTreeRepository.Edit(hierarchy);
            await this.unitOfWork.SaveAsync();

            return true;
        }

        private List<HierarchyStructureNode> GetPlainNodeList(IReadOnlyCollection<HierarchyStructureNode> childs)
        {
            var result = new List<HierarchyStructureNode>();
            if (childs != null)
            {
                foreach (var item in childs)
                {
                    result.Add(item);
                    if (item.ChildNode != null)
                    {
                        var childItems = this.GetPlainNodeList(new List<HierarchyStructureNode> { item.ChildNode });
                        result.AddRange(childItems);
                    }
                }
            }

            return result;
        }

        private List<HierarchyTreeNode> GetPlainNodeList(IReadOnlyCollection<HierarchyTreeNode> childs)
        {
            var result = new List<HierarchyTreeNode>();
            if (childs != null)
            {
                foreach (var item in childs)
                {
                    result.Add(item);
                    if (item.ChildNodes != null)
                    {
                        var childItems = this.GetPlainNodeList(item.ChildNodes);
                        result.AddRange(childItems);
                    }
                }
            }

            return result;
        }

        private async Task LoadRecursively(HierarchyStructureNode node)
        {
            node.ChildNode =
                await this.unitOfWork.HierarchyStructureNodeRepository.GetSingleAsync(n => n.ParentNodeId == node.Id);

            if (node.ChildNode != null)
            {
                await this.LoadRecursively(node.ChildNode);
            }
        }

        private async Task LoadRecursively(HierarchyTreeNode node)
        {
            node.ChildNodes =
                (await this.unitOfWork.HierarchyTreeNodeRepository.FindByAsync(n => n.ParentNodeId == node.Id))
                .ToList();

            if (node.ChildNodes != null)
            {
                foreach (var hierarchyTreeNode in node.ChildNodes)
                {
                    await this.LoadRecursively(hierarchyTreeNode);
                }
            }
        }

        private void SetParentNodeForNode(
            HierarchyStructureNode node,
            IReadOnlyCollection<HierarchyStructureNode> originalNodes)
        {
            if (node.ChildNode == null)
            {
                return;
            }

            node.ChildNode.ParentNode =
                node.Id == 0 ? node : originalNodes.FirstOrDefault(n => n.Id == node.Id) ?? node;
            node.ChildNode.ParentNodeId = node.ChildNode.ParentNode.Id;
            this.SetParentNodeForNode(node.ChildNode, originalNodes);
        }

        private void SetParentNodeForNode(HierarchyTreeNode node, IReadOnlyCollection<HierarchyTreeNode> originalNodes)
        {
            if (node.ChildNodes == null)
            {
                return;
            }

            foreach (var hierarchyTreeNode in node.ChildNodes)
            {
                hierarchyTreeNode.ParentNode =
                    node.Id == 0 ? node : originalNodes.FirstOrDefault(n => n.Id == node.Id) ?? node;
                hierarchyTreeNode.ParentNodeId = hierarchyTreeNode.ParentNode.Id;
                this.SetParentNodeForNode(hierarchyTreeNode, originalNodes);
            }
        }

        private void SetParentNodes(
            HierarchyStructure newStructure,
            HierarchyStructure originalStructure,
            IReadOnlyCollection<HierarchyStructureNode> originalNodes)
        {
            if (newStructure.ChildNodes == null)
            {
                return;
            }

            foreach (var newNode in newStructure.ChildNodes)
            {
                newNode.ParentNode = null;
                newNode.ParentStructure = originalStructure;
                this.SetParentNodeForNode(newNode, originalNodes);
            }
        }

        private void SetParentNodes(
            HierarchyTree newStructure,
            HierarchyTree originalStructure,
            IReadOnlyCollection<HierarchyTreeNode> originalNodes)
        {
            if (newStructure.ChildNodes == null)
            {
                return;
            }

            foreach (var newNode in newStructure.ChildNodes)
            {
                newNode.ParentNode = null;
                newNode.ParentTree = originalStructure;
                this.SetParentNodeForNode(newNode, originalNodes);
            }
        }
    }
}
