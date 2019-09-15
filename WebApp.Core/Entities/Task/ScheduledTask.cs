namespace WebApp.Core.Entities.Task
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using WebApp.Core.Entities.Configuration;
    using WebApp.Core.Entities.Configuration.DataSource;

    public class ScheduledTask : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public int TaskTypeId { get; set; }

        public CatalogItem TaskType { get; set; }

        public int ExecutionTypeId { get; set; }

        public CatalogItem ExecutionType { get; set; }

        public string Name { get; set; }

        public string Days { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime StartTime { get; set; }

        public List<ScheduledTaskResult> ExecutionResults { get; set; }

        public bool ActiveStatus { get; set; }

        public string ScheduleJobId { get; set; }

        public DateTime? NextExecutionTime { get; set; }

        public int? ProcessId { get; set; }

        public DateTime? ProcessDate { get; set; }

        public SqlDataSource SqlDataSource { get; set; }

        public int? SqlDataSourceId { get; set; }

        public ScheduledTask DependencyTask { get; set; }

        public int? DependencyTaskId { get; set; }
    }
}
