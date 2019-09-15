// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ProcessDbCommands.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the ProcessDbCommands type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Data
{
    using System;

    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;

    using WebApp.Infrastructure.Extensions;

    public class ProcessDbCommands
    {
        public static void Process(string[] args, IWebHost host, string hostname)
        {
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
            var seedService = (SeedDbData)host.Services.GetService(typeof(SeedDbData));

            using (var scope = services.CreateScope())
            {
                var db = GetApplicationDbContext(scope);
                // if (args.Contains("dropdb"))
                // {
                //     Console.WriteLine("Dropping database");
                //     db.Database.EnsureDeleted();
                // }

                // if (args.Contains("migratedb"))
                // {
                // Console.WriteLine("Migrating database");
                // db.Database.Migrate();
                // }

                // if (args.Contains("seeddb"))
                // {
                Console.WriteLine("Seeding database");
                db.Seed(host, hostname);
                // }
            }
        }

        private static ApplicationDbContext GetApplicationDbContext(IServiceScope services)
        {
            var db = services.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            return db;
        }
    }
}
