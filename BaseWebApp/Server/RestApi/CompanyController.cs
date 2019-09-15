// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CompanyController.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the CompanyController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
    using System.Threading.Tasks;

    using BaseWebApp.Server.Filters;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Localization;

    using WebApp.Core.Entities.Configuration;
    using WebApp.Infrastructure.Repositories;

  /// <summary>
    /// The company controller.
    /// </summary>
    [Auditable]
    [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class CompanyController : ApiController
    {
        private readonly UnitOfWork unitOfWork;

        public CompanyController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork)
          : base(localizer)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        [ActionDescription("Consulta lista de compañias")]
        public async Task<IActionResult> GetAllCompanies()
        {
            var items = await this.unitOfWork.CompaniesRepository.GetAllAsync();
            return this.Ok(items);
        }

        [HttpGet("{id}", Name = "GetCompany")]
        [ActionDescription("Consulta detalles de compañia")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var item = await this.unitOfWork.CompaniesRepository.GetSingleAsync(id);
            if (item == null)
            {
                return this.NotFound("Parameter not Found");
            }

            return this.Ok(item);
        }

        [HttpPost("{id}")]
        [ActionDescription("Modificar compañia")]
        public async Task<IActionResult> EditCompany([FromBody] Company item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var company = await this.unitOfWork.CompaniesRepository.GetSingleAsync(id);
            if (company == null)
            {
                return this.NotFound();
            }

            company.Name = item.Name;
            company.Identification = item.Identification;
            company.Address = item.Address;
            company.ActiveStatus = item.ActiveStatus;

            this.unitOfWork.CompaniesRepository.Edit(company);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        [HttpPut]
        [ActionDescription("Crear compañia")]
        public async Task<IActionResult> CreateCompany([FromBody] Company item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.CompaniesRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetCompany", new { id = item.Id }, item);
        }
    }
}
