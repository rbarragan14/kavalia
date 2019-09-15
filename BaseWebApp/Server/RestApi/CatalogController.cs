// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CatalogController.cs" company="">
//
// </copyright>
// <summary>
//   Defines the CatalogController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
    using System.ComponentModel;
    using System.Linq;
    using System.Threading.Tasks;

    using BaseWebApp.Server.Filters;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Localization;

    using WebApp.Core.Entities.Configuration;
    using WebApp.Infrastructure.Repositories;
    using WebApp.Infrastructure.ViewModels.Catalog;

  /// <summary>
    /// The catalog controller.
    /// </summary>
    [Auditable]
    [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class CatalogController : ApiController
    {
        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

      /// <summary>
      /// Initializes a new instance of the <see cref="CatalogController"/> class.
      /// </summary>
      /// <param name="unitOfWork">
      /// The unit of work.
      /// </param>
      public CatalogController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork)
        : base(localizer)
      {
        this.unitOfWork = unitOfWork;
      }

      /// <summary>
        /// The get all catalogs.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet]
        [ActionDescription("Consulta lista de catálogos")]
        public async Task<IActionResult> GetAllCatalogs()
        {
            var catalogs = await this.unitOfWork.CatalogRepository.GetAllAsync(new SortExpression<Catalog>(c => c.Name, ListSortDirection.Ascending));
            return this.Ok(catalogs);
        }

        /// <summary>
        /// The get catalog by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("{id}")]
        [ActionDescription("Consulta detalles de catálogo")]
        public async Task<IActionResult> GetCatalogById(int id)
        {
            var catalog = await this.unitOfWork.CatalogRepository.GetSingleAsync(id, c => c.CatalogItems);

            if (catalog == null)
            {
                return this.NotFound("Catalogs not Found");
            }

            return this.Ok(catalog);
        }

        /// <summary>
        /// The get catalog item by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <param name="itemId">
        /// The item id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("{id}/item/{itemId}", Name = "GetCatalogItem")]
        [ActionDescription("Consulta elemento de catálogo")]
        public async Task<IActionResult> GetCatalogItemById(int id, int itemId)
        {
            var catalogItem = await this.unitOfWork.CatalogItemRepository.GetSingleAsync(itemId, i => i.Catalog);

            if (catalogItem == null || catalogItem.Catalog.Id != id)
            {
                return this.NotFound("Catalog Item not Found");
            }

            return this.Ok(catalogItem);
        }


        [HttpGet("name/{id}")]
        [AuditIgnore]
        [AllowAnonymous]
        public async Task<IActionResult> GetCatalogByNameId(string id)
        {
            var catalog = await this.unitOfWork.CatalogRepository.GetSingleAsync(item => item.CatalogId == id, c => c.CatalogItems);
            if (catalog == null)
            {
                return this.NotFound("Catalogs not Found");
            }

            return this.Ok(catalog);
        }


      [HttpGet("item/{id}")]
      [AuditIgnore]
      [AllowAnonymous]
      public async Task<IActionResult> GetCatalogItemByNameId(string id)
      {
        var catalog = await this.unitOfWork.CatalogItemRepository.GetSingleAsync(item => item.CatalogItemId == id);
        if (catalog == null)
        {
          return this.NotFound("Catalog item not Found");
        }

        return this.Ok(catalog);
      }


        /// <summary>
        /// The create catalog item.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut("{id}/item")]
        [ActionDescription("Crear elemento de catálogo")]
        public async Task<IActionResult> CreateCatalogItem([FromBody] CatalogItem item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.CatalogItemRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetCatalogItem", new { id = item.CatalogId, itemId = item.Id }, item);
        }

        /// <summary>
        /// The edit catalog item.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <param name="itemId">
        /// The item id.
        /// </param>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("{id}/item/{itemId}")]
        [ActionDescription("Modificar elemento de catálogo")]
        public async Task<IActionResult> EditCatalogItem(int id, int itemId, [FromBody] CatalogItem item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var catalogItem = await this.unitOfWork.CatalogItemRepository.GetSingleAsync(itemId, i => i.Catalog);
            if (catalogItem == null || catalogItem.CatalogId != id)
            {
                return this.NotFound();
            }

            catalogItem.Name = item.Name;
            catalogItem.CatalogItemId = item.CatalogItemId;

            this.unitOfWork.CatalogItemRepository.Edit(catalogItem);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The delete catalog item.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <param name="itemId">
        /// The item id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpDelete("{id}/item/{itemId}")]
        [ActionDescription("Borrar elemento de catálogo")]
        public async Task<IActionResult> DeleteCatalogItem(int id, int itemId)
        {
            var catalogItem = await this.unitOfWork.CatalogItemRepository.GetSingleAsync(itemId, i => i.Catalog);
            if (catalogItem == null || catalogItem.CatalogId != id)
            {
                return this.NotFound();
            }

            this.unitOfWork.CatalogItemRepository.Delete(catalogItem);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The get catalogs association.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("associate")]
        [ActionDescription("Consulta asociación de catálogos")]
        public async Task<IActionResult> GetCatalogsAssociation()
        {
            var catalogsAssociation =
                await this.unitOfWork.CatalogAssociationRepository
                .GetQuery()
                .Select(x => new { ParentCatalog = x.ParentCatalogItem.Catalog, x.ParentCatalogItem, ChildCatalog = x.ChildCatalogItem.Catalog })
                .Distinct()
                .ToListAsync();

            return this.Ok(catalogsAssociation);
        }

        /// <summary>
        /// The get catalogs association.
        /// </summary>
        /// <param name="parentCatalogItemId">
        /// The parent catalog item id.
        /// </param>
        /// <param name="childCatalogId">
        /// The child catalog id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("associate/{parentCatalogItemId}/{childCatalogId}")]
        [ActionDescription("Consulta asociación de catálogos")]
        public async Task<IActionResult> GetCatalogsAssociation(int parentCatalogItemId, int childCatalogId)
        {
            var catalogsAssociation = await this.GatalogAssociateModel(parentCatalogItemId, childCatalogId);
            return this.Ok(catalogsAssociation);
        }

        /// <summary>
        /// The create catalog association.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut("associate")]
        [ActionDescription("Crear asociación de catálogos")]
        public async Task<IActionResult> CreateCatalogAssociation([FromBody] CatalogAssociateViewModel item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            foreach (var catalogItem in item.CatalogItems)
            {
                await this.unitOfWork.CatalogAssociationRepository.AddAsync(
                    new CatalogAssociation
                        {
                            ParentCatalogItemId = item.ParentCatalogItemId,
                            ChildCatalogItemId = catalogItem.Id
                        });
            }

            await this.unitOfWork.SaveAsync();
            return this.CreatedAtRoute("GetCatalogItem", new { id = 1, itemId = 1 }, item);
        }

        /// <summary>
        /// The edit catalog association.
        /// </summary>
        /// <param name="parentCatalogItemId">
        /// The parent catalog item id.
        /// </param>
        /// <param name="childCatalogId">
        /// The child catalog id.
        /// </param>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("associate/{parentCatalogItemId}/{childCatalogId}")]
        [ActionDescription("Modificar elemento de catálogo")]
        public async Task<IActionResult> EditCatalogAssociation(
            int parentCatalogItemId,
            int childCatalogId,
            [FromBody] CatalogAssociateViewModel item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var catalogsAssociation = await this.GatalogAssociateModel(parentCatalogItemId, childCatalogId);
            if (catalogsAssociation == null)
            {
                return this.NotFound();
            }

            var currentValues = await this.unitOfWork.CatalogAssociationRepository.GetQuery().Where(
                                    x => x.ParentCatalogItemId == parentCatalogItemId
                                         && x.ChildCatalogItem.CatalogId == childCatalogId).ToListAsync();

            var newValues = item.CatalogItems.Select(x =>
                new CatalogAssociation { ChildCatalogItemId = x.Id, ParentCatalogItemId = parentCatalogItemId });


            this.unitOfWork.CatalogAssociationRepository.TryUpdateManyToMany(
                currentValues,
                newValues,
                x => $"{x.ParentCatalogItemId}-{x.ChildCatalogItemId}");

            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The gatalog associate model.
        /// </summary>
        /// <param name="parentCatalogItemId">
        /// The parent catalog item id.
        /// </param>
        /// <param name="childCatalogId">
        /// The child catalog id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        private async Task<CatalogAssociateViewModel> GatalogAssociateModel(int parentCatalogItemId, int childCatalogId)
        {
            var currentValues = await this.unitOfWork.CatalogAssociationRepository.GetQuery().Where(
                                    x => x.ParentCatalogItemId == parentCatalogItemId
                                         && x.ChildCatalogItem.CatalogId == childCatalogId).Include(
                                             x => x.ChildCatalogItem).Include(
                                                 x => x.ParentCatalogItem).ToListAsync();

            var catalogsAssociation = currentValues.GroupBy(x => new { x.ParentCatalogItem, x.ChildCatalogItem.CatalogId }).Select(
                                              g => new CatalogAssociateViewModel
                                                       {
                                                           ParentCatalogId = g.Key.ParentCatalogItem.CatalogId,
                                                           ParentCatalogItemId = g.Key.ParentCatalogItem.Id,
                                                           ChildCatalogId = g.Key.CatalogId,
                                                           CatalogItems = g.Select(c => c.ChildCatalogItem).ToList()
                                                       }).FirstOrDefault();
            return catalogsAssociation;
        }
    }
}
