namespace BaseWebApp.Server.RestApi
{
  using System.Linq;
  using System.Threading.Tasks;

  using BaseWebApp.Server.Filters;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.Extensions.Localization;

  using WebApp.Core.Entities.Hierarchy;
  using WebApp.Infrastructure.Repositories;
  using WebApp.Infrastructure.Services;

  /// <summary>
  /// The parameter controller.
  /// </summary>
  [Auditable]

  //// [Authorize("HasPermission")]
  [Route("api/[controller]")]
  public class HierarchyController : ApiController
  {
    /// <summary>
    /// The unit of work.
    /// </summary>
    private readonly UnitOfWork unitOfWork;

    /// <summary>
    /// The hierarchy services.
    /// </summary>
    private readonly HierarchyServices hierarchyServices;

    public HierarchyController(
      IStringLocalizer<RestApiResource> localizer,
      UnitOfWork unitOfWork,
      HierarchyServices hierarchyServices)
      : base(localizer)
    {
      this.unitOfWork = unitOfWork;
      this.hierarchyServices = hierarchyServices;
    }

    [HttpPut("structure")]
    [ActionDescription("Crear estructura de jerarquía")]
    public async Task<IActionResult> CreateStructure([FromBody] HierarchyStructure item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      if (item.ChildNodes != null)
      {
        foreach (var node in item.ChildNodes)
        {
          this.SetNodeRecursively(node);
        }
      }

      await this.unitOfWork.HierarchyStructureRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetStructure", new { id = item.Id }, item);
    }

    [HttpPut]
    [ActionDescription("Crear estructura de jerarquía")]
    public async Task<IActionResult> Create([FromBody] HierarchyTree item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      if (item.ChildNodes != null)
      {
        foreach (var node in item.ChildNodes)
        {
          this.SetNodeRecursively(node);
        }
      }

      await this.unitOfWork.HierarchyTreeRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetStructure", new { id = item.Id }, item);
    }


    [HttpPost("{id}")]
    [ActionDescription("Modificar jerarquía")]
    public async Task<IActionResult> Update([FromBody] HierarchyTree item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var updated = await this.hierarchyServices.UpdateHierarchyTreeAsync(item, id);
      if (!updated)
      {
        return this.NotFound();
      }

      return new NoContentResult();
    }


    [HttpPost("structure/{id}")]
    [ActionDescription("Modificar estructura de jerarquía")]
    public async Task<IActionResult> UpdateStructure([FromBody] HierarchyStructure item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var updated = await this.hierarchyServices.UpdateHierarchyStructureAsync(item, id);
      if (!updated)
      {
        return this.NotFound();
      }

      return new NoContentResult();
    }

    [HttpGet("structure")]
    [ActionDescription("Consulta lista de estructuras de jerarquía")]
    public async Task<IActionResult> GetAllStructures()
    {
      var items = await this.unitOfWork.HierarchyStructureRepository.GetAllAsync();
      return this.Ok(items);
    }

    [HttpGet("structure/{id}", Name = "GetStructure")]
    [ActionDescription("Consulta detalles de estructura de jerarquía")]
    public async Task<IActionResult> GetStructureById(int id)
    {
      var item = await this.hierarchyServices.GetHierarchyStructureAsync(id);
      if (item == null)
      {
        return this.NotFound("Structure not Found");
      }

      return this.Ok(item);
    }

    [HttpGet]
    [ActionDescription("Consulta lista de jerarquías")]
    public async Task<IActionResult> GetAllHierarchy()
    {
      var items = await this.unitOfWork.HierarchyTreeRepository.GetAllAsync();
      return this.Ok(items);
    }


    [HttpGet("{id}", Name = "GetHierarchy")]
    [ActionDescription("Consulta detalles de jerarquía")]
    public async Task<IActionResult> GetHierarchyById(int id)
    {
      var item = await this.unitOfWork.HierarchyTreeRepository.GetSingleAsync(id, s => s.ChildNodes);
      if (item == null)
      {
        return this.NotFound("Hierarchy not Found");
      }

      item.HierarchyStructure = await this.hierarchyServices.GetHierarchyStructureAsync(item.HierarchyStructureId);
      foreach (var hierarchyNode in item.ChildNodes)
      {
        await this.LoadRecursively(hierarchyNode);
      }

      return this.Ok(item);
    }

    private async Task LoadRecursively(HierarchyTreeNode node)
    {
      node.ChildNodes = this.unitOfWork.HierarchyTreeNodeRepository.FindBy(n => n.ParentNodeId == node.Id).ToList();
      if (node.ChildNodes != null)
      {
        foreach (var childNode in node.ChildNodes)
        {
          await this.LoadRecursively(childNode);
        }
      }
    }

    private void SetNodeRecursively(HierarchyStructureNode node)
    {
      node.Id = 0;
      if (node.ChildNode != null)
      {
        this.SetNodeRecursively(node.ChildNode);
      }
    }

    private void SetNodeRecursively(HierarchyTreeNode node)
    {
      node.Id = 0;
      if (node.ChildNodes != null)
      {
        foreach (var item in node.ChildNodes)
        {
          this.SetNodeRecursively(item);
        }
      }
    }
  }
}
