// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DataSourceController.cs" company="">
//
// </copyright>
// <summary>
//   The parameter controller.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
  using System;
  using System.Linq.Expressions;
  using System.Threading.Tasks;

  using BaseWebApp.Server.Filters;

  using Microsoft.AspNetCore.Mvc;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.Localization;

  using WebApp.Core.Entities.Configuration.DataSource;
  using WebApp.Infrastructure.Repositories;

  /// <summary>
  /// The parameter controller.
  /// </summary>
  [Auditable]

  //// [Authorize("HasPermission")]
  [Route("api/[controller]")]
  public class DataSourceController : ApiController
  {
    private readonly UnitOfWork unitOfWork;

    public DataSourceController(IStringLocalizer<RestApiResource> localizer, UnitOfWork unitOfWork)
      : base(localizer)
    {
      this.unitOfWork = unitOfWork;
    }

    [HttpGet("sql")]
    [ActionDescription("Consulta lista de fuentes de datos SQL")]
    public async Task<IActionResult> GetAllSqlDataSources()
    {
      var items = await this.unitOfWork.SqlDataSourceRepository.GetAllAsync(
                    new Expression<Func<SqlDataSource, object>>[] { i => i.SqlDataBase, t => t.SqlTable });

      return this.Ok(items);
    }

    [HttpGet("file")]
    [ActionDescription("Consulta lista de fuentes de datos Archivo")]
    public async Task<IActionResult> GetAllFileDataSources()
    {
      var items = await this.unitOfWork.FileDataSourceRepository.GetAllAsync();

      return this.Ok(items);
    }

    [HttpPut("sql")]
    [ActionDescription("Crear fuente de datos SQL")]
    public async Task<IActionResult> CreateSqlDataSource([FromBody] SqlDataSource item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.SqlDataSourceRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetSqlDataSource", new { id = item.Id }, item);
    }

    [HttpPut("file")]
    [ActionDescription("Crear fuente de datos Archivo")]
    public async Task<IActionResult> CreateFileDataSource([FromBody] FileDataSource item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.unitOfWork.FileDataSourceRepository.AddAsync(item);
      await this.unitOfWork.SaveAsync();

      return this.CreatedAtRoute("GetFileDataSource", new { id = item.Id }, item);
    }

    [HttpGet("sql/{id}", Name = "GetSqlDataSource")]
    [ActionDescription("Consulta detalles de fuente de datos SQL")]
    public async Task<IActionResult> GetSqlDataSourceById(int id)
    {
      var item = await this.unitOfWork.SqlDataSourceRepository.GetQuery(u => u.Id == id)
                   .Include(u => u.SqlDataBase)
                   .Include(u => u.SqlTable)
                   .Include(u => u.SqlFields)
                   .ThenInclude(t => t.SqlField).SingleAsync();

      if (item == null)
      {
        return this.NotFound("Sql Data Source not Found");
      }

      return this.Ok(item);
    }

    [HttpGet("file/{id}", Name = "GetFileDataSource")]
    [ActionDescription("Consulta detalles de fuente de datos SQL")]
    public async Task<IActionResult> GetFileDataSourceById(int id)
    {
      var item = await this.unitOfWork.FileDataSourceRepository.GetSingleAsync(id, i => i.FileDataSourceFields);
      if (item == null)
      {
        return this.NotFound("File Data Source not Found");
      }

      return this.Ok(item);
    }

    [HttpPost("file/{id}")]
    [ActionDescription("Modificar fuente de datos SQL")]
    public async Task<IActionResult> EditFileDataSource([FromBody] FileDataSource item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var fileDataSource =
        await this.unitOfWork.FileDataSourceRepository.GetSingleAsync(id, f => f.FileDataSourceFields);

      if (fileDataSource == null)
      {
        return this.NotFound();
      }

      fileDataSource.Name = item.Name;

      item.FileDataSourceFields?.ForEach(x => x.FileDataSource = fileDataSource);
      this.unitOfWork.FileDataSourceRepository.AddRemoveUpdateCollectionItems(
        fileDataSource.FileDataSourceFields,
        item.FileDataSourceFields,
        v => v.Id);

      this.unitOfWork.FileDataSourceRepository.Edit(fileDataSource);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpPost("sql/{id}")]
    [ActionDescription("Modificar fuente de datos SQL")]
    public async Task<IActionResult> EditSqlDataSource([FromBody] SqlDataSource item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var sqlDataSource =
        await this.unitOfWork.SqlDataSourceRepository.GetSingleAsync(id, f => f.SqlFields);

      if (sqlDataSource == null)
      {
        return this.NotFound();
      }

      sqlDataSource.Name = item.Name;
      sqlDataSource.Description = item.Description;
      sqlDataSource.ActiveStatus = item.ActiveStatus;

      sqlDataSource.Query = item.Query;
      sqlDataSource.SqlDataBaseId = item.SqlDataBaseId;
      sqlDataSource.SqlTableId = item.SqlTableId;
      sqlDataSource.SqlDateField = item.SqlDateField;

      item.SqlFields?.ForEach(x => x.SqlDataSource = sqlDataSource);
      this.unitOfWork.CompensationSchemaRepository.AddRemoveCollectionItems(
        sqlDataSource.SqlFields,
        item.SqlFields,
        v => v.Id);

      this.unitOfWork.SqlDataSourceRepository.Edit(sqlDataSource);
      await this.unitOfWork.SaveAsync();
      return new NoContentResult();
    }

    [HttpGet("database")]
    [ActionDescription("Consulta lista de base de datos")]
    public async Task<IActionResult> GetAllDataBases()
    {
      var items = await this.unitOfWork.SqlDataBaseRepository.GetAllAsync();
      return this.Ok(items);
    }

    [HttpGet("database/{id}", Name = "GetDataBase")]
    [ActionDescription("Consulta detalles de base de datos")]
    public async Task<IActionResult> GetDataBaseById(int id)
    {
      var item = await this.unitOfWork.SqlDataBaseRepository.GetQuery(u => u.Id == id)
                   .Include(u => u.SqlTables)
                   .ThenInclude(t => t.Fields).SingleAsync();

      if (item == null)
      {
        return this.NotFound("Data Base not Found");
      }

      return this.Ok(item);
    }
  }
}
