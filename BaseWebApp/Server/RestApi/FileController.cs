// --------------------------------------------------------------------------------------------------------------------
// <copyright file="FileController.cs" company="">
//
// </copyright>
// <summary>
//   Defines the FileController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
    using System.Threading.Tasks;

    using BaseWebApp.Server.Filters;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;

    using WebApp.Core.Entities.File;
    using WebApp.Infrastructure.Repositories;

  [Auditable]
    [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class FileController : ApiController
    {
        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FileController"/> class.
        /// </summary>
        /// <param name="loggerFactory">
        /// The logger factory.
        /// </param>
        /// <param name="unitOfWork">
        /// The unit of work.
        /// </param>
        public FileController(
            IStringLocalizer<RestApiResource> localizer,
            ILoggerFactory loggerFactory,
            UnitOfWork unitOfWork)
          : base(localizer)
        {
            this.logger = loggerFactory.CreateLogger<AccountController>();
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("processing-file")]
        [ActionDescription("Consulta lista de archivos de procesamiento")]
        public async Task<IActionResult> GetAllProcessingFiles()
        {
            var processingFiles = await this.unitOfWork.ProcessingFilesRepository.GetAllAsync();
            return this.Ok(processingFiles);
        }

        [HttpGet("processing-file/{id}", Name = "GetProcessingFile")]
        [ActionDescription("Consulta detalles de archivo de procesamiento")]
        public async Task<IActionResult> GetProcessingFileById(int id)
        {
            var processingFile = await this.unitOfWork.ProcessingFilesRepository.GetSingleAsync(id);
            if (processingFile == null)
            {
                return this.NotFound("Processing File not Found");
            }

            return this.Ok(processingFile);
        }

        [HttpPut("processing-file")]
        [ActionDescription("Crear archivo de procesamiento")]
        public async Task<IActionResult> CreateProcessingFile([FromBody] ProcessingFile item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.ProcessingFilesRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetProcessingFile", new { id = item.Id }, item);
        }

        [HttpPost("processing-file/{id}")]
        [ActionDescription("Modificar archivo de procesamiento")]
        public async Task<IActionResult> EditProcessingFile([FromBody] ProcessingFile item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var processingFile = await this.unitOfWork.ProcessingFilesRepository.GetSingleAsync(id);
            if (processingFile == null)
            {
                return this.NotFound();
            }

            processingFile.Name = item.Name;
            processingFile.Path = item.Path;
            processingFile.Format = item.Format;
            processingFile.Type = item.Type;

            this.unitOfWork.ProcessingFilesRepository.Edit(processingFile);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }


        [HttpDelete("processing-file/{id}")]
        [ActionDescription("Borrar archivo de procesamiento")]
        public async Task<IActionResult> DeleteProcessingFile(int id)
        {
            var processingFile = await this.unitOfWork.ProcessingFilesRepository.GetSingleAsync(id);
            if (processingFile == null)
            {
                return this.NotFound();
            }

            this.unitOfWork.ProcessingFilesRepository.Delete(processingFile);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }
    }
}
