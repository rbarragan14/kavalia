// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ScheduledTaskController.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ScheduledTaskController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
  using System;
  using System.ComponentModel;
  using System.Linq;
  using System.Threading.Tasks;

  using BaseWebApp.Server.Filters;

  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.Extensions.Localization;
  using Microsoft.Extensions.Logging;

  using WebApp.Core.Entities.Task;
  using WebApp.Infrastructure.Repositories;
  using WebApp.Infrastructure.Services;

  /// <summary>
  /// The scheduled task controller.
  /// </summary>
  [Auditable]
  [Authorize("HasPermission")]
  [Route("api/task")]
  public class ScheduledTaskController : ApiController
  {
    /// <summary>
    /// The unit of work.
    /// </summary>
    private readonly UnitOfWork unitOfWork;

    /// <summary>
    /// The logger.
    /// </summary>
    private readonly ILogger logger;

    private TaskSchedulerService taskSchedulerService;

    /// <summary>
    /// Initializes a new instance of the <see cref="ScheduledTaskController"/> class.
    /// </summary>
    /// <param name="loggerFactory">
    /// The logger factory.
    /// </param>
    /// <param name="unitOfWork">
    /// The unit of work.
    /// </param>
    public ScheduledTaskController(
      IStringLocalizer<RestApiResource> localizer,
      ILoggerFactory loggerFactory,
      TaskSchedulerService taskSchedulerService,
      UnitOfWork unitOfWork)
      : base(localizer)
    {
      this.logger = loggerFactory.CreateLogger<ScheduledTaskController>();
      this.unitOfWork = unitOfWork;
      this.taskSchedulerService = taskSchedulerService;
    }

    /// <summary>
    /// The get all schedule tasks.
    /// </summary>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    [HttpGet]
    [ActionDescription("Consulta lista de tareas")]
    public async Task<IActionResult> GetAllScheduleTasks()
    {
      var scheduledTasks = await this.unitOfWork.ScheduledTaskRepository.GetAllAsync();
      return this.Ok(scheduledTasks);
    }

    /// <summary>
    /// The get schedule task by id.
    /// </summary>
    /// <param name="id">
    /// The id.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    [HttpGet("{id}", Name = "GetScheduleTask")]
    [ActionDescription("Consulta detalles de tarea")]
    public async Task<IActionResult> GetScheduleTaskById(int id)
    {
      var scheduledTask = await this.unitOfWork.ScheduledTaskRepository.GetSingleAsync(id, s => s.ExecutionResults);

      if (scheduledTask == null)
      {
        return this.NotFound("Catalogs not Found");
      }

      return this.Ok(scheduledTask);
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
    [ActionDescription("Crear tarea")]
    public async Task<IActionResult> CreateScheduleTask([FromBody] ScheduledTask item)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      await this.taskSchedulerService.CreateScheduleTaskAsync(item);
      return this.CreatedAtRoute("GetScheduleTask", new { id = item.Id }, item);
    }

    /// <summary>
    /// The edit schedule task.
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
    [ActionDescription("Modificar tarea")]
    public async Task<IActionResult> EditScheduleTask([FromBody] ScheduledTask item, int id)
    {
      if (item == null)
      {
        return this.BadRequest();
      }

      var updated = await this.taskSchedulerService.UpdateScheduleTaskAsync(item, id);
      if (!updated)
      {
        return this.NotFound();
      }

      return new NoContentResult();
    }

    /// <summary>
    /// The delete schedule task.
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
    [HttpDelete("{id}")]
    [ActionDescription("Borrar tarea")]
    public async Task<IActionResult> DeleteScheduleTask(int id)
    {
      var scheduledTask = await this.taskSchedulerService.DeleteScheduleTaskAsync(id);
      if (!scheduledTask)
      {
        return this.NotFound();
      }

      return new NoContentResult();
    }

    [HttpGet("result/{id}")]
    [ActionDescription("Consulta resultados procesamiento")]
    public async Task<IActionResult> GetScheduleTaskResults(int id, DateTime from, DateTime to)
    {
      var scheduledTasks = await this.unitOfWork.ScheduledTaskResultsRepository.GetAsync(
                             log => log.ScheduledTaskId == id && log.EventDate >= from && log.EventDate <= to,
                             1,
                             100,
                             new SortExpression<ScheduledTaskResult>(
                               log => log.EventDate,
                               ListSortDirection.Descending));

      return this.Ok(scheduledTasks);
    }
  }
}
