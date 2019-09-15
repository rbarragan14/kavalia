namespace BaseWebApp.Server.RestApi
{
  using System;
  using System.Linq.Expressions;
  using System.Threading.Tasks;

  using BaseWebApp.Server.Filters;

  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.Localization;

  using WebApp.Core.Entities.Compensation;
  using WebApp.Infrastructure.Repositories;
  using WebApp.Infrastructure.Services;

  /// <summary>
  /// The parameter controller.
  /// </summary>
  [Auditable]

  //// [Authorize("HasPermission")]
  [Route("api/[controller]")]
  public class CompensationController : ApiController
  {

    private readonly UnitOfWork unitOfWork;

    private readonly CompensationServices compensationServices;

    public CompensationController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork, CompensationServices compensationServices)
      : base(localizer)
    {
      this.unitOfWork = unitOfWork;
      this.compensationServices = compensationServices;
    }

    [HttpGet("schema")]
    [ActionDescription("Consulta lista de esquemas compensación")]
    public async Task<IActionResult> GetAllSchemas()
    {
      var items = await this.unitOfWork.CompensationSchemaRepository.GetAllAsync();
      return this.Ok(items);
    }

    [HttpGet("paymenttable")]
    [ActionDescription("Consulta lista de tablas de pago")]
    public async Task<IActionResult> GetAllPaymentTables()
    {
      var items = await this.unitOfWork.PaymentTableRepository.GetAllAsync();
      return this.Ok(items);
    }

    [HttpGet("businessrule")]
    [ActionDescription("Consulta lista de reglas de negocio")]
    public async Task<IActionResult> GetBusinessRules()
    {
      var items = await this.unitOfWork.BusinessRuleRepository.GetAllAsync(
                    new Expression<Func<BusinessRule, object>>[] { rule => rule.PaymentTable });

      return this.Ok(items);
    }

    [HttpPut("schema")]
    [ActionDescription("Crear esquema de compensación")]
    public async Task<IActionResult> CreateSchema([FromBody] CompensationSchema item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.CompensationSchemaRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetSchema", new { id = item.Id }, item);
    }

    [HttpPut("businessrule")]
    [ActionDescription("Crear esquema de compensación")]
    public async Task<IActionResult> CreateBusinessRule([FromBody] BusinessRule item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.BusinessRuleRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetBusinessRule", new { id = item.Id }, item);
    }

    [HttpPut("paymenttable")]
    [ActionDescription("Crear tabla de pagos")]
    public async Task<IActionResult> CreatePaymentTable([FromBody] PaymentTable item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      item.Hierarchies?.ForEach(x =>
        {
          x.Id = 0;
          x.PaymentTableId = 0;
          x.HierarchyStructure = null;
          x.HierarchyStructureNode = null;
        });

      item.Indicators?.ForEach(x =>
        {
          x.PaymentTableId = 0;
          x.Indicator = null;
          x.ThresholdDetails?.ForEach(t => t.Id = 0);
          if (x.GoalPayment != null)
          {
            x.GoalPayment.Id = 0;
          }
        });

      await this.unitOfWork.PaymentTableRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetSchema", new { id = item.Id }, item);
    }

    [HttpGet("schema/{id}", Name = "GetSchema")]
    [ActionDescription("Consulta detalles de esquema de compensación")]
    public async Task<IActionResult> GetSchemaById(int id)
    {
      var item = await this.unitOfWork.CompensationSchemaRepository.GetQuery(u => u.Id == id)
                            .Include(s => s.Positions)
                            .Include(s => s.PaymentVariables).ThenInclude(v => v.PaymentTables)
                            .FirstOrDefaultAsync();

      if (item == null)
      {
        return this.NotFound("Schema not Found");
      }

      return this.Ok(item);
    }

    [HttpGet("businessrule/{id}", Name = "GetBusinessRule")]
    [ActionDescription("Consulta detalles de esquema de compensación")]
    public async Task<IActionResult> GetBusinessRuleById(int id)
    {
      var item = await this.unitOfWork.BusinessRuleRepository.GetQuery(u => u.Id == id)
                   .Include(s => s.PaymentTable)
                   .Include(s => s.PaymentVariableElements)
                   .FirstOrDefaultAsync();

      if (item == null)
      {
        return this.NotFound("BusinessRule not Found");
      }

      return this.Ok(item);
    }


    [HttpGet("paymenttable/{id}", Name = "GetPaymentTable")]
    [ActionDescription("Consulta detalles de tabla de pagos")]
    public async Task<IActionResult> GetPaymentTableById(int id)
    {
      var item = await this.compensationServices.GetPaymentTableById(id);
      if (item == null)
      {
        return this.NotFound("PaymentTable not Found");
      }

      return this.Ok(item);
    }

    [HttpGet("upload-conf/{type}", Name = "GetUploadConfiguration")]
    [ActionDescription("Consulta detalles Configuración Carga Incidencia")]
    public async Task<IActionResult> GetUploadConfiguration(int type)
    {
      var item = await this.compensationServices.GetUploadConfiguration((UploadConfigurationType)type);
      if (item == null)
      {
        return this.NotFound("Configuration not Found");
      }

      return this.Ok(item);
    }

    [HttpPost("upload-conf/{type}")]
    [ActionDescription("Modificar detalles Configuración Carga Incidencia")]
    public async Task<IActionResult> EditUploadConfiguration(int type, [FromBody] UploadConfiguration item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var result = await this.compensationServices.UpdateUploadConfiguration(item, (UploadConfigurationType)type);
      if (!result)
      {
        return this.NotFound("Configuration not Found");
      }

      return this.Ok(item);
    }

    [HttpPost("businessrule/{id}")]
    [ActionDescription("Modificar regla de negocio")]
    public async Task<IActionResult> EditBusinessRule([FromBody] BusinessRule item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var rule =
        await this.unitOfWork.BusinessRuleRepository.GetSingleAsync(id, r => r.PaymentVariableElements);

      if (rule == null)
      {
        return this.NotFound();
      }

      rule.StartDate = item.StartDate;
      rule.IncidentTypeId = item.IncidentTypeId;
      rule.PaymentTableId = item.PaymentTableId;
      rule.SalaryPercentage = item.SalaryPercentage;
      rule.Additional = item.Additional;

      item.PaymentVariableElements?.ForEach(variable => variable.BusinessRule = rule);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveCollectionItems(
        rule.PaymentVariableElements,
        item.PaymentVariableElements,
        v => v.Id);

      this.unitOfWork.BusinessRuleRepository.Edit(rule);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpPost("schema/{id}")]
    [ActionDescription("Modificar esquema de compensación")]
    public async Task<IActionResult> EditSchema([FromBody] CompensationSchema item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var schema = await this.unitOfWork.CompensationSchemaRepository.GetQuery(u => u.Id == id)
                     .Include(s => s.Positions)
                     .Include(s => s.PaymentVariables).ThenInclude(v => v.PaymentTables)
                     .FirstOrDefaultAsync();

      if (schema == null)
      {
        return this.NotFound();
      }

      schema.Name = item.Name;
      schema.StartDate = item.StartDate;
      schema.FinalDate = item.FinalDate;
      schema.PeriodicityId = item.PeriodicityId;

      item.PaymentVariables?.ForEach(variable => variable.CompensationSchema = schema);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveUpdateCollectionItems(
        schema.PaymentVariables,
        item.PaymentVariables,
        v => v.Id);

      item.Positions.ForEach(p => p.CompensationSchemaId = id);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveCollectionItems(
        schema.Positions,
        item.Positions,
        x => $"{x.Id}-{x.CompensationSchemaId}");

      this.unitOfWork.CompensationSchemaRepository.Edit(schema);

      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpPost("paymenttable/{id}")]
    [ActionDescription("Modificar esquema de compensación")]
    public async Task<IActionResult> EditPaymentTable([FromBody] PaymentTable item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var result = await this.compensationServices.UpdatePaymentTable(id, item);
      if (!result)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }
  }
}
