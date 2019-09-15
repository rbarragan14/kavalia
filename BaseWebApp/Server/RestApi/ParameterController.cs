// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ParameterController.cs" company="">
//
// </copyright>
// <summary>
//   The parameter controller.
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
    /// The parameter controller.
    /// </summary>
    [Auditable]
    [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class ParameterController : ApiController
    {

        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

        /// <summary>
        /// Initializes a new instance of the <see cref="ParameterController"/> class.
        /// </summary>
        /// <param name="unitOfWork">
        /// The unit of work.
        /// </param>
        public ParameterController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork)
          : base(localizer)
        {
            this.unitOfWork = unitOfWork;
        }

        /// <summary>
        /// The get all parameters.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet]
        [ActionDescription("Consulta lista de parámetros")]
        public async Task<IActionResult> GetAllParameters()
        {
            var items = await this.unitOfWork.ParameterRepository.GetAllAsync();
            return this.Ok(items);
        }

        /// <summary>
        /// The get parameter by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("{id}", Name = "GetParameter")]
        [ActionDescription("Consulta detalles de parámetro")]
        public async Task<IActionResult> GetParameterById(int id)
        {
            var item = await this.unitOfWork.ParameterRepository.GetSingleAsync(id);
            if (item == null)
            {
                return this.NotFound("Parameter not Found");
            }

            return this.Ok(item);
        }

        /// <summary>
        /// The edit catalog item.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("{id}")]
        [ActionDescription("Modificar parámetro")]
        public async Task<IActionResult> EditParameter([FromBody] Parameter item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var parameter = await this.unitOfWork.ParameterRepository.GetSingleAsync(id);
            if (parameter == null)
            {
                return this.NotFound();
            }

            parameter.Name = item.Name;
            parameter.Value = item.Value;

            this.unitOfWork.ParameterRepository.Edit(parameter);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The create schedule task.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut]
        [ActionDescription("Crear parámetro")]
        public async Task<IActionResult> CreateParameter([FromBody] Parameter item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.ParameterRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetParameter", new { id = item.Id }, item);
        }
    }
}
