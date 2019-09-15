namespace WebApp.Infrastructure.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore.Infrastructure;
    using Microsoft.EntityFrameworkCore.Migrations;

    using WebApp.Infrastructure.Data;

    public static class DataExtensions
    {
        public static IEnumerable<T> Except<T, TKey>(
            this IEnumerable<T> items,
            IEnumerable<T> other,
            Func<T, TKey> getKeyFunc)
        {
            return items.GroupJoin(other, getKeyFunc, getKeyFunc, (item, tempItems) => new { item, tempItems })
                .SelectMany(t => t.tempItems.DefaultIfEmpty(), (t, temp) => new { t, temp })
                .Where(t => t.temp == null || t.temp.Equals(default(T))).Select(t => t.t.item);
        }

        public static void Seed(this ApplicationDbContext context, IWebHost host, string hostname)
        {
            //// if (context.AllMigrationsApplied())
            var seed = new SeedDbData(host, context, hostname);
        }

        public static bool AllMigrationsApplied(this ApplicationDbContext context)
        {
            var applied = context.GetService<IHistoryRepository>().GetAppliedMigrations().Select(m => m.MigrationId);
            var total = context.GetService<IMigrationsAssembly>().Migrations.Select(m => m.Key);
            return !total.Except(applied).Any();
        }
    }
}
