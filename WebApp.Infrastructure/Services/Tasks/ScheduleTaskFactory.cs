namespace WebApp.Infrastructure.Services.Tasks
{
    using WebApp.Core.Entities.Configuration;
    using WebApp.Core.Entities.Task;

    public class ScheduleTaskFactory
    {
        public BaseScheduledTask CreateTask(CatalogItem taskType)
        {
            return new IncidentUploadTask();
        }
    }
}
