// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ApplicationDbContext.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ApplicationDbContext type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    using WebApp.Core.Context;
    using WebApp.Core.Entities;
    using WebApp.Core.Entities.Calc;
    using WebApp.Core.Entities.Compensation;
    using WebApp.Core.Entities.Configuration;
    using WebApp.Core.Entities.Configuration.DataSource;
    using WebApp.Core.Entities.File;
    using WebApp.Core.Entities.Hierarchy;
    using WebApp.Core.Entities.Indicator;
    using WebApp.Core.Entities.Security;
    using WebApp.Core.Entities.Task;

    using WebApp.Infrastructure.Extensions;

    using Action = WebApp.Core.Entities.Security.Action;

    /// <summary>
    /// The app db context.
    /// </summary>
    public sealed class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>, IModelContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class.
        /// </summary>
        /// <param name="options">
        /// The options.
        /// </param>
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
            this.Database.EnsureCreated();
        }

        /// <summary>
        /// Gets or sets the actions.
        /// </summary>
        public DbSet<Action> Actions { get; set; }

        /// <summary>
        /// Gets or sets the application roles.
        /// </summary>
        public DbSet<ApplicationRole> ApplicationRoles { get; set; }

        /// <summary>
        /// Gets or sets the application users.
        /// </summary>
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        /// <summary>
        /// Gets or sets the audit logs.
        /// </summary>
        public DbSet<AuditLog> AuditLogs { get; set; }

        /// <summary>
        /// Gets or sets the application catalog items.
        /// </summary>
        public DbSet<CatalogItem> CatalogItems { get; set; }

        /// <summary>
        /// Gets or sets the application catalogs.
        /// </summary>
        public DbSet<Catalog> Catalogs { get; set; }

        /// <summary>
        /// Gets or sets the companies.
        /// </summary>
        public DbSet<Company> Companies { get; set; }

        /// <summary>
        /// Gets or sets the formulas.
        /// </summary>
        public DbSet<Formula> Formulas { get; set; }

        /// <summary>
        /// Gets or sets the Hierarchy Structures.
        /// </summary>
        public DbSet<HierarchyStructure> HierarchyStructures { get; set; }

        /// <summary>
        /// Gets or sets the Hierarchy Structures.
        /// </summary>
        public DbSet<HierarchyTree> HierarchyTrees { get; set; }

        /// <summary>
        /// Gets or sets the parameters.
        /// </summary>
        public DbSet<Parameter> Parameters { get; set; }

        /// <summary>
        /// Gets or sets the permissions.
        /// </summary>
        public DbSet<Permission> Permissions { get; set; }

        /// <summary>
        /// Gets or sets the processing files.
        /// </summary>
        public DbSet<ProcessingFile> ProcessingFiles { get; set; }

        /// <summary>
        /// Gets or sets the scheduled task results.
        /// </summary>
        public DbSet<ScheduledTaskResult> ScheduledTaskResults { get; set; }

        /// <summary>
        /// Gets or sets the scheduled tasks.
        /// </summary>
        public DbSet<ScheduledTask> ScheduledTasks { get; set; }

        /// <summary>
        /// Gets or sets the user delegates.
        /// </summary>
        public DbSet<UserDelegate> UserDelegates { get; set; }

        public DbSet<CompensationSchema> CompensationSchemas { get; set; }

        public DbSet<Variable> Variables { get; set; }

        public DbSet<SqlDataSource> SqlDataSources { get; set; }

        public DbSet<FileDataSource> FileDataSources { get; set; }

        public DbSet<UploadConfiguration> IncidentUploadConfigurations { get; set; }

        public DbSet<CompensationIncident> CompensationIncidents { get; set; }

        /// <summary>
        /// The on model creating.
        /// </summary>
        /// <param name="builder">
        /// The builder.
        /// </param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<ActionPermission>().HasKey(t => new { t.ActionId, t.PermissionId });

            builder.Entity<RolePermission>().HasKey(t => new { t.RoleId, t.PermissionId });

            builder.Entity<MenuItemPermission>().HasKey(t => new { t.MenuItemId, t.PermissionId });

            builder.Entity<CatalogAssociation>().HasKey(t => new { t.ParentCatalogItemId, t.ChildCatalogItemId });

            builder.Entity<HierarchyStructureNode>().HasOne(s => s.ParentNode).WithOne(c => c.ChildNode);

            builder.Entity<HierarchyTree>().HasMany(s => s.ChildNodes).WithOne(c => c.ParentTree);

            builder.Entity<CompensationSchemaPosition>().HasKey(k => new { k.CompensationSchemaId, k.Id });

            builder.Entity<BusinessRulePaymentVariableElement>().HasKey(k => new { k.BusinessRuleId, k.Id });

            builder.Entity<CompensationPaymentVariablePaymentTable>().HasKey(k => new { k.PaymentVariableId, k.Id });

            builder.Entity<SqlDataSourceField>().HasKey(k => new { k.SqlDataSourceId, k.Id });

            builder.Entity<Indicator>().HasMany(g => g.Indicators).WithOne(i => i.Indicator);

            builder.Entity<IndicatorIndicator>().HasOne(i => i.IndicatorChild).WithMany().HasForeignKey(pt => pt.IndicatorChildId);

            builder.Entity<PaymentTableIndicator>().HasKey(k => new { k.PaymentTableId, k.Id });

            builder.Entity<PaymentTableIndicator>().HasOne(p => p.PaymentTable).WithMany(p => p.Indicators)
                .HasForeignKey(pt => pt.PaymentTableId);

            builder.Entity<PaymentTableIndicator>().HasOne(p => p.Indicator).WithMany().HasForeignKey(pt => pt.Id);

            builder.Entity<SqlDataSourceField>().HasOne(s => s.SqlField).WithMany().HasForeignKey(pt => pt.Id);

            base.OnModelCreating(builder);
        }

        public void SetModified(object entry)
        {
            this.Entry(entry).State = EntityState.Modified;
        }

        public void AddRemoveCollectionItems<T, TKey>(
            IEnumerable<T> currentItems,
            IEnumerable<T> newItems,
            Func<T, TKey> getKey)
            where T : class
        {
            var currentItemsArray = currentItems.ToArray();
            var newItemsArray = newItems.ToArray();

            this.Set<T>().RemoveRange(currentItemsArray.Except(newItemsArray, getKey));
            this.Set<T>().AddRange(newItemsArray.Except(currentItemsArray, getKey));
        }

        public void AddRemoveUpdateCollectionItems<T, TKey>(
            IEnumerable<T> currentItems,
            IEnumerable<T> newItems,
            Func<T, TKey> getKey)
            where T : class, IEntityBaseEquatable<T>
        {
            var currentItemsArray = currentItems?.ToArray() ?? new T[] { };
            var newItemsArray = newItems?.ToArray() ?? new T[] { };

            this.Set<T>().RemoveRange(currentItemsArray.Except(newItemsArray, getKey));
            this.Set<T>().AddRange(newItemsArray.Except(currentItemsArray, getKey));

            foreach (var currentItem in currentItemsArray)
            {
                var modified = newItemsArray.FirstOrDefault(x => x.Id == currentItem.Id);
                if (modified != null && !modified.Equals(currentItem))
                {
                    currentItem.Update(modified, this);
                    var entityEntry = this.Entry(currentItem);
                    entityEntry.State = EntityState.Modified;
                }
            }
        }

    }
}
