namespace WebApp.Infrastructure.Services
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Hangfire;

    using WebApp.Core.Entities.Task;
    using WebApp.Infrastructure.Repositories;

    public class TaskSchedulerService
    {
        public TaskSchedulerService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        private readonly UnitOfWork unitOfWork;

        private const string LocalTimeZone = "SA Pacific Standard Time";

        private static readonly Dictionary<DayOfWeek, int> IndexDays = new Dictionary<DayOfWeek, int>
                                                                  {
                                                                      { DayOfWeek.Monday, 0 },
                                                                      { DayOfWeek.Tuesday, 1 },
                                                                      { DayOfWeek.Wednesday, 2 },
                                                                      { DayOfWeek.Thursday, 3 },
                                                                      { DayOfWeek.Friday, 4 },
                                                                      { DayOfWeek.Saturday, 5 },
                                                                      { DayOfWeek.Sunday, 6 }
                                                                  };

        public async Task CreateScheduleTaskAsync(ScheduledTask item)
        {
            item.ExecutionType = this.unitOfWork.CatalogItemRepository.GetSingle(i => i.Id == item.ExecutionTypeId);
            item.ScheduleJobId = this.ScheduleNextExecution(item);
            await this.unitOfWork.ScheduledTaskRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();
        }


        public async Task<bool> DeleteScheduleTaskAsync(int id)
        {
            var scheduledTask = await this.unitOfWork.ScheduledTaskRepository.GetSingleAsync(id);
            if (scheduledTask == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(scheduledTask.ScheduleJobId))
            {
                BackgroundJob.Delete(scheduledTask.ScheduleJobId);
            }

            this.unitOfWork.ScheduledTaskRepository.Delete(scheduledTask);
            await this.unitOfWork.SaveAsync();
            return true;
        }


        public async Task<bool> UpdateScheduleTaskAsync(ScheduledTask item, int id)
        {
            var scheduledTask = await this.unitOfWork.ScheduledTaskRepository.GetSingleAsync(id);
            if (scheduledTask == null)
            {
                return false;
            }

            scheduledTask.Name = item.Name;
            scheduledTask.TaskTypeId = item.TaskTypeId;
            scheduledTask.ExecutionTypeId = item.ExecutionTypeId;
            scheduledTask.ExecutionType = this.unitOfWork.CatalogItemRepository.GetSingle(item.ExecutionTypeId);

            scheduledTask.ProcessDate = item.ProcessDate;
            scheduledTask.ProcessId = item.ProcessId;
            scheduledTask.SqlDataSourceId = item.SqlDataSourceId;
            scheduledTask.DependencyTaskId = item.DependencyTaskId;

            scheduledTask.Days = item.Days;
            scheduledTask.StartDate = item.StartDate;
            scheduledTask.StartTime = item.StartTime;
            scheduledTask.ActiveStatus = item.ActiveStatus;
            scheduledTask.ScheduleJobId = this.ScheduleNextExecution(scheduledTask, scheduledTask.ScheduleJobId);

            this.unitOfWork.ScheduledTaskRepository.Edit(scheduledTask);
            await this.unitOfWork.SaveAsync();

            return true;
        }

        private DateTime GetCurrentDateTime()
        {
            var localTimeZone = TimeZoneInfo.FindSystemTimeZoneById(LocalTimeZone);
            return TimeZoneInfo.ConvertTime(DateTime.Now, localTimeZone);
            //// DateTime.Now.ToUniversalTime()
        }

        public DateTime? CalculateNextExecutionTime(ScheduledTask scheduledTask)
        {
            if (!scheduledTask.ActiveStatus)
            {
                return null;
            }

            switch (scheduledTask.ExecutionType.CatalogItemId)
            {
                case ExecutionType.Daily:
                case ExecutionType.Interval:
                    return this.CalculateNextDailyExecutionTime(scheduledTask);
                case ExecutionType.Weekly:
                    return this.CalculateNextWeeklyExecutionTime(scheduledTask);
                case ExecutionType.TwoWeeks:
                    return this.CalculateNextWeeklyExecutionTime(scheduledTask, 2);
                case ExecutionType.Monthly:
                    return this.CalculateNextMonthlyExecutionTime(scheduledTask);
                case ExecutionType.TwoMonths:
                    return this.CalculateNextMonthlyExecutionTime(scheduledTask, 2);
                case ExecutionType.ThreeMonths:
                    return this.CalculateNextMonthlyExecutionTime(scheduledTask, 3);
                case ExecutionType.SixMonths:
                    return this.CalculateNextMonthlyExecutionTime(scheduledTask, 6);
                case ExecutionType.Annual:
                    return this.CalculateNextMonthlyExecutionTime(scheduledTask, 12);
                case ExecutionType.OnTime:
                    return this.CalculateNextOneTimeExecutionTime(scheduledTask);

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private DateTime? CalculateNextOneTimeExecutionTime(ScheduledTask scheduledTask)
        {
            var currentDateTime = this.GetCurrentDateTime();
            var baseDate = currentDateTime + scheduledTask.StartTime.TimeOfDay;

            if (currentDateTime > baseDate)
            {
                return null;
            }

            return baseDate;
        }

        private DateTime? CalculateNextDailyExecutionTime(ScheduledTask scheduledTask)
        {
            if (scheduledTask.Days.IndexOf('1') < 0)
            {
                return null;
            }

            var currentDateTime = this.GetCurrentDateTime();
            var baseDate = currentDateTime.Date + scheduledTask.StartTime.TimeOfDay;

            while (!this.CanBeExecutedOnTime(scheduledTask, baseDate))
            {
                baseDate = baseDate.AddDays(1);
            }

            return baseDate;
        }

        private DateTime CalculateNextMonthlyExecutionTime(ScheduledTask scheduledTask, int months = 1)
        {
            var currentDateTime = this.GetCurrentDateTime();
            var baseDate = currentDateTime + scheduledTask.StartTime.TimeOfDay;

            while (currentDateTime > baseDate)
            {
                baseDate = baseDate.AddMonths(1);
            }

            return baseDate;
        }

        private DateTime CalculateNextWeeklyExecutionTime(ScheduledTask scheduledTask, int weeks = 1)
        {
            var currentDateTime = this.GetCurrentDateTime();
            var baseDate = currentDateTime + scheduledTask.StartTime.TimeOfDay;

            while (currentDateTime > baseDate)
            {
                baseDate = baseDate.AddDays(7 * weeks);
            }

            return baseDate;
        }

        private bool CanBeExecutedOnTime(ScheduledTask scheduledTask, DateTime date)
        {
            var currentDateTime = this.GetCurrentDateTime();
            if (currentDateTime > date)
            {
                return false;
            }

            var currentDayIndex = IndexDays[date.DayOfWeek];
            if (scheduledTask.Days[currentDayIndex] != '1')
            {
                return false;
            }

            return true;
        }

        public string ScheduleNextExecution(ScheduledTask scheduledTask, string currentJobId = null)
        {
            var nextExecutionDateTime = this.CalculateNextExecutionTime(scheduledTask);
            if (nextExecutionDateTime == null)
            {
                return null;
            }

            var currentDateTime = this.GetCurrentDateTime();
            scheduledTask.NextExecutionTime = nextExecutionDateTime;
            var delaySpan = nextExecutionDateTime.Value - currentDateTime;

            if (!string.IsNullOrEmpty(currentJobId))
            {
                BackgroundJob.Delete(currentJobId);
            }

            return BackgroundJob.Schedule(
                () => Console.WriteLine("Delayed!"),
                delaySpan);
        }
    }
}
