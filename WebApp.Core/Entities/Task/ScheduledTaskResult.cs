using System;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Task
{
    public class ScheduledTaskResult : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public int ScheduledTaskId { get; set; }

        public ScheduledEventType EventType { get; set; }

        public DateTime EventDate { get; set; }

        public string Description { get; set; }
    }
}
