namespace BaseWebApp.Server.RestApi
{
  using System;
  using System.Collections.Generic;
  using System.Linq.Expressions;
  using System.Threading.Tasks;

  using BaseWebApp.Server.Filters;

  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.Localization;

  using WebApp.Core.Entities.Configuration.DataSource;
  using WebApp.Core.Entities.Indicator;
  using WebApp.Infrastructure.Repositories;

  /// <summary>
  /// The parameter controller.
  /// </summary>
  [Auditable]

  //// [Authorize("HasPermission")]
  [Route("api/[controller]")]
  public class IndicatorController : ApiController
  {
    private readonly UnitOfWork unitOfWork;

    public IndicatorController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork)
      : base(localizer)
    {
      this.unitOfWork = unitOfWork;
    }

    [HttpGet]
    [ActionDescription("Consulta lista de indicadores")]
    public async Task<IActionResult> GetAllIndicators()
    {
      var items = await this.unitOfWork.IndicatorRepository.GetAllAsync(new Expression<Func<Indicator, object>>[] { i => i.IndicatorType });
      return this.Ok(items);
    }


    [HttpPut]
    [ActionDescription("Crear Indicador")]
    public async Task<IActionResult> CreateIndicator([FromBody] Indicator item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.IndicatorRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetIndicator", new { id = item.Id }, item);
    }

    [HttpPut("copy/{id}")]
    [ActionDescription("Crear Indicador")]
    public async Task<IActionResult> CopyIndicator([FromBody] Indicator item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var copy = await this.unitOfWork.IndicatorRepository.GetQuery(u => u.Id == id).Include(s => s.Indicators)
                   .ThenInclude(i => i.IndicatorChild).Include(s => s.GeneralData).Include(s => s.AssociatedData)
                   .Include(s => s.Variables).ThenInclude(v => v.Variable).FirstOrDefaultAsync();

      if (copy == null)
      {
        return this.NotFound("Indicator not Found");
      }

      item.Indicators = new List<IndicatorIndicator>();
      foreach (var indicatorIndicator in copy.Indicators)
      {
        this.unitOfWork.IndicatorIndicatorRepository.Detach(indicatorIndicator);
        indicatorIndicator.Id = 0;
        indicatorIndicator.Indicator = item;
        item.Indicators.Add(indicatorIndicator);
      }

      item.Variables = new List<IndicatorVariable>();
      foreach (var variable in copy.Variables)
      {
        this.unitOfWork.IndicatorVariableRepository.Detach(variable);
        variable.Id = 0;
        variable.Indicator = item;
        item.Variables.Add(variable);
      }

      item.AssociatedData = new List<AssociatedData>();
      foreach (var associatedData in copy.AssociatedData)
      {
        this.unitOfWork.AssociatedDataRepository.Detach(associatedData);
        associatedData.Id = 0;
        associatedData.Indicator = item;
        item.AssociatedData.Add(associatedData);
      }

      item.GeneralData = new List<GeneralData>();
      foreach (var generalData in copy.GeneralData)
      {
        this.unitOfWork.GeneralDataRepository.Detach(generalData);
        generalData.Id = 0;
        generalData.Indicator = item;
        item.GeneralData.Add(generalData);
      }

      item.HierarchyStructureId = copy.HierarchyStructureId;
      item.HierarchyStructureNodeId = copy.HierarchyStructureNodeId;
      item.Formula = copy.Formula;

      await this.unitOfWork.IndicatorRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();
      return this.CreatedAtRoute("GetIndicator", new { id = item.Id }, item);
    }

    [HttpGet("{id}", Name = "GetIndicator")]
    [ActionDescription("Consulta detalles de indicador")]
    public async Task<IActionResult> GetIndicatorById(int id)
    {
      var item = await this.unitOfWork.IndicatorRepository.GetQuery(u => u.Id == id).Include(s => s.IndicatorType)
                   .Include(s => s.Periodicity).Include(s => s.Indicators).ThenInclude(i => i.IndicatorChild)
                   .Include(s => s.GeneralData).Include(s => s.AssociatedData).Include(s => s.Variables)
                   .ThenInclude(v => v.Variable).FirstOrDefaultAsync();

      if (item == null)
      {
        return this.NotFound("Indicator not Found");
      }

      return this.Ok(item);
    }

    [HttpPost("{id}")]
    [ActionDescription("Modificar indicador")]
    public async Task<IActionResult> EditIndicator([FromBody] Indicator item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var indicator =
        await this.unitOfWork.IndicatorRepository.GetSingleAsync(id);

      if (indicator == null)
      {
        return this.NotFound();
      }

      indicator.Name = item.Name;
      indicator.Comments = item.Comments;
      indicator.Description = item.Description;
      indicator.StartDate = item.StartDate;
      indicator.FinalDate = item.FinalDate;
      indicator.IndicatorTypeId = item.IndicatorTypeId;
      indicator.PeriodicityId = item.PeriodicityId;
      indicator.UssageId = item.UssageId;
      indicator.DataInputId = item.DataInputId;

      indicator.ThresholdMin = item.ThresholdMin;
      indicator.ThresholdMid = item.ThresholdMid;
      indicator.ThresholdMax = item.ThresholdMax;

      this.unitOfWork.IndicatorRepository.Edit(indicator);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpGet("variable")]
    [ActionDescription("Consulta lista de variables")]
    public async Task<IActionResult> GetAllVariables()
    {
      var items = await this.unitOfWork.VariableRepository.GetAllAsync(
                    new Expression<Func<Variable, object>>[] { x => x.SqlDataSource, x => x.FileDataSource });
      return this.Ok(items);
    }

    [HttpPut("variable")]
    [ActionDescription("Crear variables")]
    public async Task<IActionResult> CreateVariable([FromBody] Variable item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.VariableRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetVariable", new { id = item.Id }, item);
    }

    [HttpGet("variable/{id}", Name = "GetVariable")]
    [ActionDescription("Consulta detalles de esquema de compensación")]
    public async Task<IActionResult> GetVariableById(int id)
    {
      var item = await this.unitOfWork.VariableRepository.GetSingleAsync(id);
      if (item == null)
      {
        return this.NotFound("Variable not Found");
      }

      return this.Ok(item);
    }

    [HttpPost("variable/{id}")]
    [ActionDescription("Modificar variable")]
    public async Task<IActionResult> EditVariable([FromBody] Variable item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var variable =
        await this.unitOfWork.VariableRepository.GetSingleAsync(id);

      if (variable == null)
      {
        return this.NotFound();
      }

      variable.Name = item.Name;
      variable.Description = item.Description;
      variable.ActiveStatus = item.ActiveStatus;
      variable.GroupPositions = item.GroupPositions;
      variable.SourceTypeId = item.SourceTypeId;

      if (item.SourceTypeId == DataSourceType.Sql)
      {
        variable.SqlDataSourceId = item.SqlDataSourceId;
        variable.SqlFieldId = item.SqlFieldId;
        variable.SqlFieldGroupId = item.SqlFieldGroupId;

        variable.FileDataSourceId = null;
        variable.FileFieldId = null;
        variable.FileFieldGroupId = null;
      }
      else
      {
        variable.FileDataSourceId = item.FileDataSourceId;
        variable.FileFieldId = item.FileFieldId;
        variable.FileFieldGroupId = item.FileFieldGroupId;

        variable.SqlDataSourceId = null;
        variable.SqlFieldId = null;
        variable.SqlFieldGroupId = null;
      }

      this.unitOfWork.VariableRepository.Edit(variable);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpPost("{id}/formulation")]
    [ActionDescription("Modificar variable")]
    public async Task<IActionResult> EditIndicatorFormulation([FromBody] Indicator item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var indicator =
        await this.unitOfWork.IndicatorRepository.GetSingleAsync(id, i => i.Variables, i => i.Indicators, i => i.GeneralData, i => i.AssociatedData);

      if (indicator == null)
      {
        return this.NotFound();
      }

      indicator.Formula = item.Formula;
      indicator.HierarchyStructureId = item.HierarchyStructureId;
      indicator.HierarchyStructureNodeId = item.HierarchyStructureNodeId;

      item.Variables?.ForEach(
        t =>
        {
          t.Indicator = indicator;
          t.Variable = this.unitOfWork.VariableRepository.GetSingle(t.VariableId);
        });

      this.unitOfWork.CompensationSchemaRepository.AddRemoveUpdateCollectionItems(
        indicator.Variables,
        item.Variables,
        x => x.Id);

      item.Indicators?.ForEach(
        t =>
        {
          t.Indicator = indicator;
          t.IndicatorChild = this.unitOfWork.IndicatorRepository.GetSingle(t.IndicatorChildId);
        });

      this.unitOfWork.CompensationSchemaRepository.AddRemoveCollectionItems(
        indicator.Indicators,
        item.Indicators,
        x => x.Id);

      item.GeneralData?.ForEach(t => t.Indicator = indicator);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveUpdateCollectionItems(
        indicator.GeneralData,
        item.GeneralData,
        x => x.Id);

      item.AssociatedData?.ForEach(t => t.Indicator = indicator);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveUpdateCollectionItems(
        indicator.AssociatedData,
        item.AssociatedData,
        x => x.Id);

      this.unitOfWork.IndicatorRepository.Edit(indicator);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }
  }
}
