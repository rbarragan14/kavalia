using System;
using System.Collections.Generic;
using System.Text;

namespace WebApp.Infrastructure.Services.Tasks
{
    using WebApp.Core.Entities.Task;

    public class IncidentUploadTask : BaseScheduledTask
    {
        public override void Execute()
        {
            Console.WriteLine("Delayed!");
        }
    }
}
