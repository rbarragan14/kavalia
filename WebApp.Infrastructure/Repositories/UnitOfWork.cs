// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UnitOfWork.cs" company="">
//
// </copyright>
// <summary>
//   Defines the UnitOfWork type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Repositories
{
    using System;
    using System.Threading.Tasks;

    using WebApp.Core.Entities.Calc;
    using WebApp.Core.Entities.Compensation;
    using WebApp.Core.Entities.Configuration;
    using WebApp.Core.Entities.Configuration.DataSource;
    using WebApp.Core.Entities.File;
    using WebApp.Core.Entities.Hierarchy;
    using WebApp.Core.Entities.Indicator;
    using WebApp.Core.Entities.Security;
    using WebApp.Core.Entities.Task;
    using WebApp.Infrastructure.Data;

    using Action = WebApp.Core.Entities.Security.Action;

  /// <summary>
  /// The unit of work.
  /// </summary>
  public class UnitOfWork : IDisposable
  {
    /// <summary>
    /// The context.
    /// </summary>
    private readonly ApplicationDbContext context;

    /// <summary>
    /// The action repository.
    /// </summary>
    private EntityBaseRepository<Action> actionRepository;

    /// <summary>
    /// The audit log repository.
    /// </summary>
    private EntityBaseRepository<AuditLog> auditLogRepository;

    /// <summary>
    /// The catalog association repository.
    /// </summary>
    private BaseRepository<CatalogAssociation> catalogAssociationRepository;

    /// <summary>
    /// The catalog item repository.
    /// </summary>
    private EntityBaseRepository<CatalogItem> catalogItemRepository;

    /// <summary>
    /// The catalog repository.
    /// </summary>
    private EntityBaseRepository<Catalog> catalogRepository;

    /// <summary>
    /// The companies repository.
    /// </summary>
    private EntityBaseRepository<Company> companiesRepository;

    /// <summary>
    /// The disposed.
    /// </summary>
    private bool disposed = false;

    /// <summary>
    /// The formula repository.
    /// </summary>
    private EntityBaseRepository<Formula> formulaRepository;

    /// <summary>
    /// The hierarchy structure node repository.
    /// </summary>
    private EntityBaseRepository<HierarchyStructureNode> hierarchyStructureNodeRepository;

    /// <summary>
    /// The Hierarchy Structure repository.
    /// </summary>
    private EntityBaseRepository<HierarchyStructure> hierarchyStructureRepository;

    /// <summary>
    /// The Hierarchy Tree repository.
    /// </summary>
    private EntityBaseRepository<HierarchyTree> hierarchyTreeRepository;

    /// <summary>
    /// The hierarchy tree node repository.
    /// </summary>
    private EntityBaseRepository<HierarchyTreeNode> hierarchyTreeNodeRepository;


    /// <summary>
    /// The menu item repository.
    /// </summary>
    private EntityBaseRepository<MenuItem> menuItemRepository;

    /// <summary>
    /// The parameter repository.
    /// </summary>
    private EntityBaseRepository<Parameter> parameterRepository;

    /// <summary>
    /// The permission repository.
    /// </summary>
    private EntityBaseRepository<Permission> permissionRepository;

    /// <summary>
    /// The processing files repository.
    /// </summary>
    private EntityBaseRepository<ProcessingFile> processingFilesRepository;

    /// <summary>
    /// The role repository.
    /// </summary>
    private EntityBaseRepository<ApplicationRole> roleRepository;

    /// <summary>
    /// The scheduled task repository.
    /// </summary>
    private EntityBaseRepository<ScheduledTask> scheduledTaskRepository;

    /// <summary>
    /// The scheduled task results repository.
    /// </summary>
    private EntityBaseRepository<ScheduledTaskResult> scheduledTaskResultsRepository;

    /// <summary>
    /// The user delegate repository.
    /// </summary>
    private EntityBaseRepository<UserDelegate> userDelegateRepository;

    /// <summary>
    /// The user repository.
    /// </summary>
    private EntityBaseRepository<ApplicationUser> userRepository;


    private EntityBaseRepository<CompensationSchema> compensationSchemaRepository;

    private EntityBaseRepository<PaymentTable> paymentTableRepository;

    private EntityBaseRepository<BusinessRule> businessRuleRepository;

    private EntityBaseRepository<Indicator> indicatorRepository;

    private EntityBaseRepository<IndicatorIndicator> indicatorIndicatorRepository;

      private EntityBaseRepository<Variable> variableRepository;

    private EntityBaseRepository<SqlTable> sqlTableRepository;

    private EntityBaseRepository<SqlDataSource> sqlDataSourceRepository;

    private EntityBaseRepository<FileDataSource> fileDataSourceRepository;

    private EntityBaseRepository<SqlDataBase> sqlDataBaseRepository;

    private EntityBaseRepository<UploadConfiguration> incidentUploadConfigurationRepository;

    private BaseRepository<PaymentTableIndicator> paymentTableIndicatorRepository;

    private BaseRepository<PaymentTableHierarchy> paymentTableHierarchyRepository;

    private EntityBaseRepository<IndicatorVariable> indicatorVariableRepository;

      private EntityBaseRepository<AssociatedData> associatedDataRepository;

      private EntityBaseRepository<GeneralData> generalDataRepository;

      /// <summary>
    /// Initializes a new instance of the <see cref="UnitOfWork"/> class.
    /// </summary>
    /// <param name="context">
    /// The context.
    /// </param>
    public UnitOfWork(ApplicationDbContext context)
    {
      this.context = context;
    }

    /// <summary>
    /// The action repository.
    /// </summary>
    public EntityBaseRepository<Action> ActionRepository =>
      this.actionRepository
      ?? (this.actionRepository = new EntityBaseRepository<Action>(this.context));

    /// <summary>
    /// The audit log repository.
    /// </summary>
    public EntityBaseRepository<AuditLog> AuditLogRepository =>
      this.auditLogRepository ?? (this.auditLogRepository = new EntityBaseRepository<AuditLog>(this.context));

    /// <summary>
    /// The catalog association repository.
    /// </summary>
    public BaseRepository<CatalogAssociation> CatalogAssociationRepository =>
      this.catalogAssociationRepository
      ?? (this.catalogAssociationRepository = new BaseRepository<CatalogAssociation>(this.context));

    /// <summary>
    /// The catalog item repository.
    /// </summary>
    public EntityBaseRepository<CatalogItem> CatalogItemRepository =>
      this.catalogItemRepository ?? (this.catalogItemRepository = new EntityBaseRepository<CatalogItem>(this.context));

    /// <summary>
    /// The catalog repository.
    /// </summary>
    public EntityBaseRepository<Catalog> CatalogRepository =>
      this.catalogRepository ?? (this.catalogRepository = new EntityBaseRepository<Catalog>(this.context));

    /// <summary>
    /// The companies repository.
    /// </summary>
    public EntityBaseRepository<Company> CompaniesRepository =>
      this.companiesRepository ?? (this.companiesRepository = new EntityBaseRepository<Company>(this.context));

    /// <summary>
    /// The formulad task repository.
    /// </summary>
    public EntityBaseRepository<Formula> FormulaRepository =>
      this.formulaRepository ?? (this.formulaRepository = new EntityBaseRepository<Formula>(this.context));

    /// <summary>
    /// The hierarchy structure node repository.
    /// </summary>
    public EntityBaseRepository<HierarchyStructureNode> HierarchyStructureNodeRepository =>
      this.hierarchyStructureNodeRepository ?? (this.hierarchyStructureNodeRepository =
                                                  new EntityBaseRepository<HierarchyStructureNode>(this.context));

    /// <summary>
    /// The hierarchy structure repository.
    /// </summary>
    public EntityBaseRepository<HierarchyStructure> HierarchyStructureRepository =>
      this.hierarchyStructureRepository ?? (this.hierarchyStructureRepository =
                                              new EntityBaseRepository<HierarchyStructure>(this.context));

    /// <summary>
    /// The hierarchy tree repository.
    /// </summary>
    public EntityBaseRepository<HierarchyTree> HierarchyTreeRepository =>
      this.hierarchyTreeRepository
      ?? (this.hierarchyTreeRepository = new EntityBaseRepository<HierarchyTree>(this.context));

    public EntityBaseRepository<HierarchyTreeNode> HierarchyTreeNodeRepository =>
      this.hierarchyTreeNodeRepository
      ?? (this.hierarchyTreeNodeRepository = new EntityBaseRepository<HierarchyTreeNode>(this.context));



    public EntityBaseRepository<MenuItem> MenuItemRepository =>
      this.menuItemRepository ?? (this.menuItemRepository = new EntityBaseRepository<MenuItem>(this.context));

    /// <summary>
    /// The parameter repository.
    /// </summary>
    public EntityBaseRepository<Parameter> ParameterRepository =>
      this.parameterRepository ?? (this.parameterRepository = new EntityBaseRepository<Parameter>(this.context));

    /// <summary>
    /// The permission repository.
    /// </summary>
    public EntityBaseRepository<Permission> PermissionRepository =>
      this.permissionRepository ?? (this.permissionRepository = new EntityBaseRepository<Permission>(this.context));

    public EntityBaseRepository<ProcessingFile> ProcessingFilesRepository =>
      this.processingFilesRepository
      ?? (this.processingFilesRepository = new EntityBaseRepository<ProcessingFile>(this.context));

    /// <summary>
    /// The role repository.
    /// </summary>
    public EntityBaseRepository<ApplicationRole> RoleRepository =>
      this.roleRepository ?? (this.roleRepository = new EntityBaseRepository<ApplicationRole>(this.context));

    /// <summary>
    /// The scheduled task repository.
    /// </summary>
    public EntityBaseRepository<ScheduledTask> ScheduledTaskRepository =>
      this.scheduledTaskRepository
      ?? (this.scheduledTaskRepository = new EntityBaseRepository<ScheduledTask>(this.context));

    public EntityBaseRepository<ScheduledTaskResult> ScheduledTaskResultsRepository =>
      this.scheduledTaskResultsRepository ?? (this.scheduledTaskResultsRepository =
                                                new EntityBaseRepository<ScheduledTaskResult>(this.context));

    public EntityBaseRepository<UserDelegate> UserDelegateRepository =>
      this.userDelegateRepository
      ?? (this.userDelegateRepository = new EntityBaseRepository<UserDelegate>(this.context));

    /// <summary>
    /// The user repository.
    /// </summary>
    public EntityBaseRepository<ApplicationUser> UserRepository =>
      this.userRepository ?? (this.userRepository = new EntityBaseRepository<ApplicationUser>(this.context));


    public EntityBaseRepository<CompensationSchema> CompensationSchemaRepository =>
      this.compensationSchemaRepository ?? (this.compensationSchemaRepository = new EntityBaseRepository<CompensationSchema>(this.context));

    public EntityBaseRepository<PaymentTable> PaymentTableRepository =>
      this.paymentTableRepository ?? (this.paymentTableRepository = new EntityBaseRepository<PaymentTable>(this.context));

    public EntityBaseRepository<BusinessRule> BusinessRuleRepository =>
      this.businessRuleRepository ?? (this.businessRuleRepository = new EntityBaseRepository<BusinessRule>(this.context));

    public EntityBaseRepository<Indicator> IndicatorRepository =>
      this.indicatorRepository ?? (this.indicatorRepository = new EntityBaseRepository<Indicator>(this.context));

      public EntityBaseRepository<IndicatorIndicator> IndicatorIndicatorRepository =>
          this.indicatorIndicatorRepository ?? (this.indicatorIndicatorRepository = new EntityBaseRepository<IndicatorIndicator>(this.context));

        public EntityBaseRepository<Variable> VariableRepository =>
      this.variableRepository ?? (this.variableRepository = new EntityBaseRepository<Variable>(this.context));

      public EntityBaseRepository<IndicatorVariable> IndicatorVariableRepository =>
          this.indicatorVariableRepository ?? (this.indicatorVariableRepository = new EntityBaseRepository<IndicatorVariable>(this.context));

      public EntityBaseRepository<AssociatedData> AssociatedDataRepository =>
          this.associatedDataRepository ?? (this.associatedDataRepository = new EntityBaseRepository<AssociatedData>(this.context));

      public EntityBaseRepository<GeneralData> GeneralDataRepository =>
          this.generalDataRepository ?? (this.generalDataRepository = new EntityBaseRepository<GeneralData>(this.context));

        public BaseRepository<PaymentTableIndicator> PaymentTableIndicatorRepository =>
      this.paymentTableIndicatorRepository ?? (this.paymentTableIndicatorRepository = new BaseRepository<PaymentTableIndicator>(this.context));

        public BaseRepository<PaymentTableHierarchy> PaymentTableHierarchyRepository =>
            this.paymentTableHierarchyRepository ?? (this.paymentTableHierarchyRepository = new BaseRepository<PaymentTableHierarchy>(this.context));

        public EntityBaseRepository<SqlDataBase> SqlDataBaseRepository =>
      this.sqlDataBaseRepository ?? (this.sqlDataBaseRepository = new EntityBaseRepository<SqlDataBase>(this.context));

    public EntityBaseRepository<SqlTable> SqlTableRepository =>
      this.sqlTableRepository ?? (this.sqlTableRepository = new EntityBaseRepository<SqlTable>(this.context));

    public EntityBaseRepository<SqlDataSource> SqlDataSourceRepository =>
      this.sqlDataSourceRepository ?? (this.sqlDataSourceRepository = new EntityBaseRepository<SqlDataSource>(this.context));

    public EntityBaseRepository<FileDataSource> FileDataSourceRepository =>
      this.fileDataSourceRepository ?? (this.fileDataSourceRepository = new EntityBaseRepository<FileDataSource>(this.context));

    public EntityBaseRepository<UploadConfiguration> IncidentUploadConfigurationRepository =>
      this.incidentUploadConfigurationRepository ?? (this.incidentUploadConfigurationRepository = new EntityBaseRepository<UploadConfiguration>(this.context));

    /// <summary>
    /// The dispose.
    /// </summary>
    public void Dispose()
    {
      this.Dispose(true);
      GC.SuppressFinalize(this);
    }

    /// <summary>
    /// The save.
    /// </summary>
    public int Save()
    {
      return this.context.SaveChanges();
    }

    public async Task<int> SaveAsync()
    {
      return await this.context.SaveChangesAsync();
    }

    /// <summary>
    /// The dispose.
    /// </summary>
    /// <param name="disposing">
    /// The disposing.
    /// </param>
    protected virtual void Dispose(bool disposing)
    {
      if (!this.disposed)
      {
        if (disposing)
        {
          this.context.Dispose();
        }
      }

      this.disposed = true;
    }
  }
}
