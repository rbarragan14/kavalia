// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CalcControllercs.cs" company="">
//
// </copyright>
// <summary>
//   The calc controllercs.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
    using System.Threading.Tasks;

    using BaseWebApp.Server.Filters;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;

    using WebApp.Core.Entities.Calc;
    using WebApp.Infrastructure.Repositories;
    using WebApp.Infrastructure.Services;

  /// <summary>
    /// The calc controllercs.
    /// </summary>
    [Auditable]
    //// [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class CalcController : ApiController
    {
        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger logger;

        private readonly FormulaService formulaService;

        /// <summary>
        /// Initializes a new instance of the <see cref="CalcController"/> class.
        /// </summary>
        /// <param name="loggerFactory">
        /// The logger factory.
        /// </param>
        /// <param name="unitOfWork">
        /// The unit of work.
        /// </param>
        public CalcController(
            IStringLocalizer<RestApiResource> localizer,
            FormulaService formulaService,
            ILoggerFactory loggerFactory,
            UnitOfWork unitOfWork)
          : base(localizer)
        {
            this.formulaService = formulaService;
            this.logger = loggerFactory.CreateLogger<CalcController>();
            this.unitOfWork = unitOfWork;
        }

        /// <summary>
        /// The get all formulas.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("formula")]
        [ActionDescription("Consulta lista de formulas")]
        public async Task<IActionResult> GetAllFormulas()
        {
            var formulas = await this.unitOfWork.FormulaRepository.GetAllAsync();
            return this.Ok(formulas);
        }

        /// <summary>
        /// The get formula by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("formula/{id}", Name = "GetFormula")]
        [ActionDescription("Consulta detalles de fórmula")]
        public async Task<IActionResult> GetFormulaById(int id)
        {
            var formula = await this.unitOfWork.FormulaRepository.GetSingleAsync(id, s => s.Parameters);

            if (formula == null)
            {
                return this.NotFound("Formula not Found");
            }

            return this.Ok(formula);
        }

        /// <summary>
        /// The create formula.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut("formula")]
        [ActionDescription("Crear fórmula")]
        public async Task<IActionResult> CreateFormula([FromBody] Formula item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.FormulaRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();
            return this.CreatedAtRoute("GetFormula", new { id = item.Id }, item);
        }

        /// <summary>
        /// The update formula.
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
        [HttpPost("formula/{id}")]
        [ActionDescription("Actualizar fórmula")]
        public async Task<IActionResult> UpdateFormula([FromBody] Formula item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var formula = await this.unitOfWork.FormulaRepository.GetSingleAsync(id, i => i.Parameters);
            if (formula == null)
            {
                return this.NotFound();
            }

            formula.Name = item.Name;
            formula.Body = item.Body;
            item.Parameters.ForEach(p => p.Formula = formula);

            this.unitOfWork.FormulaRepository.AddRemoveCollectionItems(formula.Parameters, item.Parameters, x => x.Id);
            this.unitOfWork.FormulaRepository.Edit(formula);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The delete formula.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpDelete("formula/{id}")]
        [ActionDescription("Borrar fórmula")]
        public async Task<IActionResult> DeleteFormula(int id)
        {
            var formula = await this.unitOfWork.FormulaRepository.GetSingleAsync(id, s => s.Parameters);
            if (formula == null)
            {
                return this.NotFound("Formula not Found");
            }

            this.unitOfWork.FormulaRepository.Delete(formula);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }


        [HttpPost("formula/check")]
        [ActionDescription("Validar fórmula")]
        public async Task<IActionResult> ValidateFormula([FromBody] Formula formula)
        {
            if (formula == null || string.IsNullOrEmpty(formula.Body))
            {
                return this.BadRequest();
            }

            var result = await this.formulaService.CheckFormulaAsync(formula);
            if (result == null)
            {
                return this.BadRequest();
            }

            return this.Ok(result);
        }

        [HttpPost("formula/evaluate")]
        [ActionDescription("Evaluar fórmula")]
        public async Task<IActionResult> EvaluateFormula([FromBody] Formula formula)
        {
            if (formula == null || string.IsNullOrEmpty(formula.Body))
            {
                return this.BadRequest();
            }

            var result = await this.formulaService.EvaluateFormulaAsync(formula);
            if (result == null)
            {
                return this.BadRequest();
            }

            return this.Ok(result);
        }
    }
}
