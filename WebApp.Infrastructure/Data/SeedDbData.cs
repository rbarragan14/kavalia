// --------------------------------------------------------------------------------------------------------------------
// <copyright file="SeedDbData.cs" company="">
//
// </copyright>
// <summary>
//   Defines the SeedDbData type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.DependencyInjection;

    using OpenIddict.Abstractions;
    using OpenIddict.Core;
    using OpenIddict.EntityFrameworkCore.Models;

    using WebApp.Core.Entities;
    using WebApp.Core.Entities.Compensation;
    using WebApp.Core.Entities.Configuration;
    using WebApp.Core.Entities.Configuration.DataSource;
    using WebApp.Core.Entities.Hierarchy;
    using WebApp.Core.Entities.Indicator;
    using WebApp.Core.Entities.Security;
    using WebApp.Core.Entities.Task;
    using WebApp.Infrastructure.Repositories;

    using Action = WebApp.Core.Entities.Security.Action;

    /// <summary>
    /// The seed db data.
    /// </summary>
    public class SeedDbData
    {
        readonly ApplicationDbContext context;

        private readonly IHostingEnvironment hostingEnv;

        private readonly UserManager<ApplicationUser> userManager;

        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly UnitOfWork unitOfWork;

        public SeedDbData(IWebHost host, ApplicationDbContext context, string hostname)
        {
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
            var serviceScope = services.CreateScope();
            this.hostingEnv = serviceScope.ServiceProvider.GetService<IHostingEnvironment>();
            this.roleManager = serviceScope.ServiceProvider.GetService<RoleManager<ApplicationRole>>();
            this.userManager = serviceScope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
            this.context = context;
            this.unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();

            this.CreateConfigData();

            //// AddLocalisedData();
            this.AddOpenIdConnectOptions(serviceScope, CancellationToken.None, hostname).GetAwaiter().GetResult();
        }

        /// <summary>
        /// The add open id connect options.
        /// </summary>
        /// <param name="services">
        /// The services.
        /// </param>
        /// <param name="cancellationToken">
        /// The cancellation token.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        private async Task AddOpenIdConnectOptions(IServiceScope services, CancellationToken cancellationToken, string host)
        {
            var manager = services.ServiceProvider.GetService<OpenIddictApplicationManager<OpenIddictApplication>>();

            if (await manager.FindByClientIdAsync("basewebapp", cancellationToken) == null)
            {
                var descriptor = new OpenIddictApplicationDescriptor
                {
                    ClientId = "basewebapp",
                    ClientSecret = "388D45FA-B36B-4988-BA59-B187D329C207",
                    DisplayName = "BaseWebApp",
                    PostLogoutRedirectUris = { new Uri($"{host}/signout-oidc") },
                    RedirectUris = { new Uri(host) },
                    Permissions =
                                        {
                                            OpenIddictConstants.Permissions.Endpoints.Token,
                                            OpenIddictConstants.Permissions.GrantTypes.Password,
                                            OpenIddictConstants.Permissions.GrantTypes.RefreshToken,
                                            OpenIddictConstants.Permissions.Scopes.Email,
                                            OpenIddictConstants.Permissions.Scopes.Profile,
                                            OpenIddictConstants.Permissions.Scopes.Roles
                                        }
                };

                await manager.CreateAsync(descriptor, cancellationToken);
            }
        }



        /// <summary>
        /// The create catalogs.
        /// </summary>
        private void CreateConfigData()
        {
            if (this.unitOfWork.CatalogRepository.GetAll().Any())
            {
                return;
            }

            var usersPermissions = new List<Permission> { new Permission { Name = "Usuarios" } };
            var rolesPermissions = new List<Permission> { new Permission { Name = "Roles" } };
            var userDelegatePermissions = new List<Permission> { new Permission { Name = "Delegar Funciones" } };
            var auditLogPermissions = new List<Permission> { new Permission { Name = "Auditoria" } };
            var filesPermissions = new List<Permission> { new Permission { Name = "Archivos" } };

            var catalogPermissions = new List<Permission> { new Permission { Name = "Catálogos" } };
            var parameterPermissions = new List<Permission> { new Permission { Name = "Parámetros" } };

            var tasksPermissions = new List<Permission> { new Permission { Name = "Tareas" } };
            var formulaPermissions = new List<Permission> { new Permission { Name = "Fórmulas" } };
            var companyPermissions = new List<Permission> { new Permission { Name = "Compañias" } };
            var hierarchyPermissions = new List<Permission> { new Permission { Name = "Jerarquía" } };
            var paymentTablePermissions = new List<Permission> { new Permission { Name = "Tabla Pagos" } };
            var paymentTableSelectPermissions = new List<Permission> { new Permission { Name = "Selección Tabla Pagos" } };
            var businessRulesPermissions = new List<Permission> { new Permission { Name = "Reglas Negocio" } };
            var compensationExecutionPermissions = new List<Permission> { new Permission { Name = "Proceso Cálculo" } };
            var dataSourcePermissions = new List<Permission> { new Permission { Name = "Fuente de Datos SQL" } };
            var dataSourceFileUploadPermissions = new List<Permission> { new Permission { Name = "Carga Datos" } };
            var indicatorsPermissions = new List<Permission> { new Permission { Name = "Carga Datos" } };

            var variablesPermissions = new List<Permission> { new Permission { Name = "Variables" } };
            var quotaPermissions = new List<Permission> { new Permission { Name = "Cuotas" } };
            var queriesPermissions = new List<Permission> { new Permission { Name = "Consultas" } };

            var actions = new List<Action>
                              {
                                  new Action { ActionName = "GetAllCatalogs", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetCatalogById", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetCatalogItemById", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateCatalogItem", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditCatalogItem", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteCatalogItem", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetCatalogsAssociation", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateCatalogAssociation", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditCatalogAssociation", Controller = "Catalog", Permissions = catalogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetCatalogByNameId", Controller = "Catalog" },

                                  new Action { ActionName = "GetAllParameters", Controller = "Parameter", Permissions = parameterPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetParameterById", Controller = "Parameter", Permissions = parameterPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditParameter", Controller = "Parameter", Permissions = parameterPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateParameter", Controller = "Parameter", Permissions = parameterPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllScheduleTasks", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetScheduleTaskById", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateScheduleTask", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditScheduleTask", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteScheduleTask", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetScheduleTaskResults", Controller = "ScheduledTask", Permissions = tasksPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllFormulas", Controller = "Calc", Permissions = formulaPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetFormulaById", Controller = "Calc", Permissions = formulaPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateFormula", Controller = "Calc", Permissions = formulaPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "UpdateFormula", Controller = "Calc", Permissions = formulaPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteFormula", Controller = "Calc", Permissions = formulaPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAuditLogs", Controller = "Account", Permissions = auditLogPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllRoles", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).Concat(usersPermissions.Select(c => new ActionPermission { Permission = c })).ToList() },
                                  new Action { ActionName = "GetRoleById", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetAllPermission", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateRole", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "UpdateRole", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteRoleById", Controller = "Account", Permissions = rolesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllUsers", Controller = "Account", Permissions = usersPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "Register", Controller = "Account", Permissions = usersPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetUserById", Controller = "Account", Permissions = usersPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "ResetPassword", Controller = "Account", Permissions = usersPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "UpdateUser", Controller = "Account", Permissions = usersPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "ChangePassword", Controller = "Account" },
                                  new Action { ActionName = "GetCurrentUserInformation", Controller = "Account" },

                                  new Action { ActionName = "GetAllUserDelegates", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetUserDelegateById", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateUserDelegate", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "UpdateUserDelegate", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteUserDelegateById", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetUsersToDelegate", Controller = "Account", Permissions = userDelegatePermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllProcessingFiles", Controller = "File", Permissions = filesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetProcessingFileById", Controller = "File", Permissions = filesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateProcessingFile", Controller = "File", Permissions = filesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditProcessingFile", Controller = "File", Permissions = filesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "DeleteProcessingFile", Controller = "File", Permissions = filesPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "GetAllCompanies", Controller = "Company", Permissions = companyPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "GetCompanyById", Controller = "Company", Permissions = companyPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "EditCompany", Controller = "Company", Permissions = companyPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },
                                  new Action { ActionName = "CreateCompany", Controller = "Company", Permissions = companyPermissions.Select(c => new ActionPermission { Permission = c }).ToList() },

                                  new Action { ActionName = "LogOff", Controller = "Account" },

                              };

            var menuItems = new List<MenuItem>
            {
                new MenuItem {
                    Name = "Dashboard",
                    Url = "/dashboard",
                    Icon = "icon-speedometer",
                    Order = 0,
                    DefaultAuth = true,
                    Navigable = true
                },
                new MenuItem {
                    Name = "Seguridad",
                    Url = "/account",
                    Icon = "icon-lock",
                    Order = 1,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Usuarios",
                            Url = "/account/users",
                            Icon = "icon-people",
                            Permissions = usersPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Roles",
                            Url = "/account/roles",
                            Icon = "icon-user-following",
                            Permissions = rolesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Delegar",
                            Url = "/account/delegate",
                            Icon = "icon-arrow-right-circle",
                            Permissions = userDelegatePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Auditoría",
                            Url = "/account/auditlogs",
                            Icon = "icon-book-open",
                            Permissions = parameterPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Contraseña",
                            Url = "/account/set-password",
                            Icon = "fa fa-key",
                            DefaultAuth = true,
                        },
                    }
                },
                new MenuItem {
                    Name = "Configuración",
                    Url = "/config",
                    Icon = "icon-settings",
                    Order = 2,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Catálogos",
                            Url = "/config/catalogs",
                            Icon = "icon-notebook",
                            Order = 1,
                            Permissions = catalogPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Asociación Catálogo",
                            Url = "/config/associate",
                            Icon = "icon-link",
                            Order = 2,
                            Permissions = catalogPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Parámetros",
                            Url = "/config/parameters",
                            Icon = "icon-pencil",
                            Order = 3,
                            Permissions = catalogPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Compañias",
                            Url = "/config/companies",
                            Icon = "icon-briefcase",
                            Order = 4,
                            Permissions = companyPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Fuente Datos",
                            Url = "/datasource/sql",
                            Icon = "fa fa-database",
                            Order = 5,
                            Permissions = dataSourcePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Archivos",
                            Url = "/datasource/file/upload",
                            Icon = "icon-doc",
                            Order = 6,
                            Permissions = dataSourceFileUploadPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                    }
                },
               new MenuItem {
                    Name = "Procesos",
                    Url = "/task",
                    Icon = "icon-star",
                    Order = 3,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Programar Tareas",
                            Url = "/task/tasks",
                            Icon = "icon-energy",
                            Permissions = tasksPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Archivos",
                            Url = "/process-config/files",
                            Icon = "icon-folder",
                            Permissions = filesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Fórmulas",
                            Url = "/calc/formulas",
                            Icon = "icon-chemistry",
                            Permissions = formulaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                    }
                },
               new MenuItem {
                    Name = "Estructura Org.",
                    Url = "/org-structure",
                    Icon = "fa fa-sitemap",
                    Order = 4,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Estructura Jerarquía",
                            Url = "/org-structure/hierarchy-structure",
                            Icon = "icon-vector",
                            Order = 1,
                            Permissions = hierarchyPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Jerarquía",
                            Url = "/org-structure/hierarchy",
                            Icon = "fa fa-puzzle-piece",
                            Order = 2,
                            Permissions = hierarchyPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                    }
                },
               new MenuItem {
                    Name = "Compensación",
                    Url = "/compensation",
                    Icon = "icon-magic-wand",
                    Order = 5,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Tablas de Pagos",
                            Url = "/compensation/payment-table",
                            Icon = "icon-book-open",
                            Order = 1,
                            Permissions = paymentTablePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Esquema",
                            Url = "/compensation/schema",
                            Icon = "icon-check",
                            Order = 2,
                            Permissions = paymentTableSelectPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Reglas de Negocio",
                            Url = "/compensation/business-rules",
                            Icon = "icon-list",
                            Order = 3,
                            Permissions = businessRulesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                          Name = "Carga Empleados",
                          Url = "/compensation/paysheet-upload-config",
                          Icon = "icon-wallet",
                          Order = 4,
                          Permissions = paymentTablePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                          Name = "Carga Incidencia",
                          Url = "/compensation/incidents-upload-config",
                          Icon = "icon-shield",
                          Order = 5,
                          Permissions = paymentTablePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                          Name = "Carga Indicadores",
                          Url = "/compensation/indicator-upload-config",
                          Icon = "icon-compass",
                          Order = 5,
                          Permissions = paymentTablePermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },

                        /*
                        new MenuItem {
                            Name = "Cálculo",
                            Url = "/compensation/execute",
                            Icon = "icon-notebook",
                            Permissions = compensationExecutionPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        */
                    }
                },
               new MenuItem {
                    Name = "Indicadores",
                    Url = "/indicators",
                    Icon = "fa fa-cubes",
                    Order = 4,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Variables",
                            Url = "/indicators/variables",
                            Icon = "fa fa-bold",
                            Order = 1,
                            Permissions = hierarchyPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Indicadores",
                            Url = "/indicators/indicators",
                            Icon = "fa fa-bar-chart",
                            Order = 2,
                            Permissions = hierarchyPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                    }
                },
               new MenuItem {
                    Name = "Cuotas",
                    Url = "/quota",
                    Icon = "fa fa-tasks",
                    Order = 5,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Selección",
                            Url = "/quota/selection",
                            Icon = "fa fa-sliders",
                            Order = 1,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Meta Global",
                            Url = "/quota/global-goal",
                            Icon = "fa fa-globe",
                            Order = 2,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Fórmula de Distribución",
                            Url = "/quota/apply-formula",
                            Icon = "fa fa-superscript",
                            Order = 3,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Abrir Cuotas",
                            Url = "/quota/open-quota",
                            Icon = "icon-lock-open",
                            Order = 4,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Revisar Cuotas",
                            Url = "/quota/quota-review",
                            Icon = "fa fa-thumbs-o-up",
                            Order = 5,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Importar Cuotas",
                            Url = "/quota/data-import",
                            Icon = "fa fa-clipboard",
                            Order = 6,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Pesos por Periodo",
                            Url = "/quota/weight-days",
                            Icon = "fa fa-thermometer",
                            Order = 7,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Días no Laborables",
                            Url = "/quota/holidays",
                            Icon = "fa fa-calendar",
                            Order = 8,
                            Permissions = quotaPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },

                    }
                },
               new MenuItem {
                    Name = "Consultas",
                    Url = "/queries",
                    Icon = "icon-magnifier",
                    Order = 90,
                    Children = new List<MenuItem> {
                        new MenuItem {
                            Name = "Individual",
                            Url = "/queries/individual",
                            Icon = "icon-graph",
                            Order = 1,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Trazabilidad",
                            Url = "/queries/individual-traceability",
                            Icon = "icon-grid",
                            Order = 2,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Tendencia",
                            Url = "/queries/trend",
                            Icon = "icon-chart",
                            Order = 3,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Indicadores",
                            Url = "/queries/indicators",
                            Icon = "icon-speedometer",
                            Order = 4,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Incidencias",
                            Url = "/queries/incidents",
                            Icon = "icon-support",
                            Order = 5,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Cuota Recomendada",
                            Url = "/queries/recommended-quota",
                            Icon = "fa fa-handshake-o",
                            Order = 6,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Cuota por Cliente",
                            Url = "/queries/quota-by-client",
                            Icon = "fa fa-industry",
                            Order = 7,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                        new MenuItem {
                            Name = "Distribución Cuota",
                            Url = "/queries/quota-distribution",
                            Icon = "fa fa-calendar-check-o",
                            Order = 8,
                            Permissions = queriesPermissions.Select(c => new MenuItemPermission() { Permission = c }).ToList()
                        },
                    }
               },
                new MenuItem {
                    Name = "Logout",
                    Url = "/logout",
                    Icon = "icon-logout",
                    Order = 100,
                    DefaultAuth = true,
                    Navigable = true
                },
            };

            var permissions = new List<Permission>
            {
            };

            var catalogItems01 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TMT-01", Name = "Porcentaje de un indicador establecido" },
                                         new CatalogItem { CatalogItemId = "TMT-02", Name = "# Unidades especificas" },
                                         new CatalogItem { CatalogItemId = "TMT-03", Name = "Umbral" },
                                     };

            var catalogItems02 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TPG-01", Name = "Porcentaje sobre valor referencia" },
                                         new CatalogItem { CatalogItemId = "TPG-02", Name = "Valor fijo" },
                                         new CatalogItem { CatalogItemId = "TPG-03", Name = "Porcentaje valor por unidad" },
                                         new CatalogItem { CatalogItemId = "TPG-04", Name = "Valor fijo por unidad" },
                                         new CatalogItem { CatalogItemId = "TPG-05", Name = "Especie" },
                                         new CatalogItem { CatalogItemId = "TPG-06", Name = "Porcentaje del salario" },
                                         new CatalogItem { CatalogItemId = "TPG-07", Name = "Porcentaje del indicador" },
                                     };

            var catalogItems03 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TIC-01", Name = "Incapacidad" },
                                         new CatalogItem { CatalogItemId = "TIC-02", Name = "Ausentismo no justificado" },
                                         new CatalogItem { CatalogItemId = "TIC-03", Name = "Ausentismo enfermedad" },
                                         new CatalogItem { CatalogItemId = "TIC-04", Name = "Ausentismo accidente de trabajo" },
                                         new CatalogItem { CatalogItemId = "TIC-05", Name = "Permiso remunerado" },
                                         new CatalogItem { CatalogItemId = "TIC-06", Name = "Permiso no remunerado" },
                                         new CatalogItem { CatalogItemId = "TIC-07", Name = "Vacaciones" },
                                         new CatalogItem { CatalogItemId = "TIC-08", Name = "Festivo" },
                                         new CatalogItem { CatalogItemId = "TIC-09", Name = "Retiro" },
                                         new CatalogItem { CatalogItemId = "TIC-10", Name = "Movimiento" },
                                         new CatalogItem { CatalogItemId = "TIC-11", Name = "En otras actividades (capacitación, viajes, proyectos)" },
                                         new CatalogItem { CatalogItemId = "TIC-12", Name = "Ingreso" },
                                     };

            var catalogItems04 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "ESP-01", Name = "Especie 01" },
                                         new CatalogItem { CatalogItemId = "ESP-02", Name = "Especie 02" },
                                         new CatalogItem { CatalogItemId = "ESP-03", Name = "Especie 03" },
                                     };

            var catalogItems05 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "PSC-01", Name = "Posición Compensación 01" },
                                         new CatalogItem { CatalogItemId = "PSC-02", Name = "Posición Compensación 02" },
                                         new CatalogItem { CatalogItemId = "PSC-03", Name = "Posición Compensación 03" },
                                     };

            var catalogItems06 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "PSO-01", Name = "Posición Organizacional 01" },
                                         new CatalogItem { CatalogItemId = "PSO-02", Name = "Posición Organizacional 02" },
                                         new CatalogItem { CatalogItemId = "PSO-03", Name = "Posición Organizacional 03" },
                                     };

            var catalogItems07 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "ELP-01", Name = "Elemento Pago 01" },
                                         new CatalogItem { CatalogItemId = "ELP-02", Name = "Elemento Pago 02" },
                                         new CatalogItem { CatalogItemId = "ELP-03", Name = "Elemento Pago 03" },
                                     };

            var catalogItems08 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TIN-01", Name = "Tipo Indicador 01" },
                                         new CatalogItem { CatalogItemId = "TIN-02", Name = "Tipo Indicador 02" },
                                         new CatalogItem { CatalogItemId = "TIN-03", Name = "Tipo Indicador 03" },
                                     };

            var catalogItems09 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TID-01", Name = "Cédula" },
                                         new CatalogItem { CatalogItemId = "TID-02", Name = "Pasaporte" },
                                     };
/*
            var catalogItems10 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TAU-01", Name = "Accidente de trabajo" },
                                         new CatalogItem { CatalogItemId = "TAU-02", Name = "Enfermedad profesional" },
                                         new CatalogItem { CatalogItemId = "TAU-03", Name = "Enfermedad común" },
                                         new CatalogItem { CatalogItemId = "TAU-04", Name = "Lic. Maternidad/Paternidad" },
                                         new CatalogItem { CatalogItemId = "TAU-05", Name = "Permiso sindical" },
                                         new CatalogItem { CatalogItemId = "TAU-06", Name = "Otro" },
                                     };
*/
            var catalogItems11 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "PRD-01", Name = "Diario" },
                                         new CatalogItem { CatalogItemId = "PRD-02", Name = "Semanal" },
                                         new CatalogItem { CatalogItemId = "PRD-03", Name = "Quincenal" },
                                         new CatalogItem { CatalogItemId = "PRD-04", Name = "Mensual" },
                                         new CatalogItem { CatalogItemId = "PRD-05", Name = "Trimestral" },
                                         new CatalogItem { CatalogItemId = "PRD-06", Name = "Semestral" },
                                         new CatalogItem { CatalogItemId = "PRD-07", Name = "Anual" },
                                     };

            var catalogItems12 = new List<CatalogItem>
                                     {
                                         new CatalogItem { CatalogItemId = "TEJ-01", Name = "Diaria" },
                                         new CatalogItem { CatalogItemId = "TEJ-02", Name = "Semanal" },
                                         new CatalogItem { CatalogItemId = "TEJ-03", Name = "Quincenal" },
                                         new CatalogItem { CatalogItemId = "TEJ-04", Name = "Mensual" },
                                         new CatalogItem { CatalogItemId = "TEJ-05", Name = "Bimensual" },
                                         new CatalogItem { CatalogItemId = "TEJ-06", Name = "Trimestral" },
                                         new CatalogItem { CatalogItemId = "TEJ-07", Name = "Semestral" },
                                         new CatalogItem { CatalogItemId = "TEJ-08", Name = "Anual" },
                                         new CatalogItem { CatalogItemId = "TEJ-09", Name = "Intervalos" },
                                         new CatalogItem { CatalogItemId = "TEJ-10", Name = "Una Vez" },
                                     };

            var uploadTask = new CatalogItem { CatalogItemId = "TRE-01", Name = "Carga" };
            var processingTask = new CatalogItem { CatalogItemId = "TRE-03", Name = "Procesamiento" };
            var deliveryTask = new CatalogItem { CatalogItemId = "TRE-02", Name = "Entrega" };

            var catalogItems13 = new List<CatalogItem>
                                     {
                                         uploadTask,
                                         deliveryTask,
                                         processingTask,
                                     };

            var catalogs = new List<Catalog>
                               {
                                   new Catalog { CanBeEdited  = false, CatalogId = "TMT", Name = "Tipo Meta", CatalogItems = catalogItems01 },
                                   new Catalog { CanBeEdited  = false, CatalogId = "TPG", Name = "Tipo Pago", CatalogItems = catalogItems02 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "TIC", Name = "Tipo Incidencia", CatalogItems = catalogItems03 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "ESP", Name = "Especie", CatalogItems = catalogItems04 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "PSC", Name = "Posición Compensación", CatalogItems = catalogItems05 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "PSO", Name = "Posición Organizacional", CatalogItems = catalogItems06 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "ELP", Name = "Elemento de Pago Variable", CatalogItems = catalogItems07 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "TIN", Name = "Tipo Indicador", CatalogItems = catalogItems08 },
                                   new Catalog { CanBeEdited  = true, CatalogId = "TID", Name = "Tipo Identificación", CatalogItems = catalogItems09 },
////                               new Catalog { CanBeEdited  = true, CatalogId = "TAU", Name = "Tipo Ausentismo", CatalogItems = catalogItems10 },
                                   new Catalog { CanBeEdited  = false, CatalogId = "PRD", Name = "Periodicidad", CatalogItems = catalogItems11 },
                                   new Catalog { CanBeEdited  = false, CatalogId = "TEJ", Name = "Tipo Ejecución", CatalogItems = catalogItems12 },
                                   new Catalog { CanBeEdited  = false, CatalogId = "TRE", Name = "Tarea Ejecución", CatalogItems = catalogItems13 },
                               };
            
            var parameters = new List<Parameter>
            {
                new Parameter
                {
                    ParameterId = "ActSegDat",
                    Name = "Activación seguridad a nivel de datos",
                    Value = "true",
                    Type = "boolean",
                    Resource = "/config/hierarchy-data-access",
                    ResourceName = "Seleccionar Jerarquías"
                },
                new Parameter
                {
                    ParameterId = "CouCli",
                    Name = "Activación Cuota por Cliente",
                    Value = "true",
                    Type = "boolean"
                },
                new Parameter
                {
                    ParameterId = "PDC",
                    Name = "Período Máximo de Distribución Cuotas",
                    Value = string.Empty,
                    Type = "tree",
                    Options = "{\"options\":[{\"label\":\"Anual\",\"data\":{\"id\":1},\"children\":[{\"label\":\"Trimestral\",\"data\":{\"id\":2},\"children\":[{\"label\":\"Mensual\",\"data\":{\"id\":3},\"children\":[{\"label\":\"Quincenal\",\"data\":{\"id\":4},\"children\":[{\"label\":\"Semanal\",\"data\":{\"id\":5},\"children\":[]}]}]}]}]}]}"
                },
                new Parameter
                {
                    ParameterId = "PMDC",
                    Name = "Período Mínimo de Distribución Cuotas",
                    Value = string.Empty,
                    Type = "tree-ms",
                    Options = "{\"options\":[{\"label\":\"Anual\",\"data\":{\"id\":1},\"children\":[{\"label\":\"Trimestral\",\"data\":{\"id\":2},\"children\":[{\"label\":\"Mensual\",\"data\":{\"id\":3},\"children\":[{\"label\":\"Quincenal\",\"data\":{\"id\":4},\"children\":[{\"label\":\"Semanal\",\"data\":{\"id\":5},\"children\":[]}]}]}]}]}]}"
                    /// {"options":[{"label":"Anual","data":{"id":1},"children":[{"label":"Trimestral","data":{"id":2},"children":[{"label":"Mensual","data":{"id":3},"children":[{"label":"Quincenal","data":{"id":4},"children":[{"label":"Semanal","data":{"id":5},"children":[]}]}]}]}]}]}
                },
                new Parameter
                {
                    ParameterId = "MIAF",
                    Name = "Mes Inicio Año Fiscal",
                    Value = "1",
                    Type = "dropdown",
                    Options = "{\"options\":[{\"value\":\"Enero\",\"key\":\"1\"},{\"value\":\"Febrero\",\"key\":\"2\"},{\"value\":\"Marzo\",\"key\":\"3\"},{\"value\":\"Abril\",\"key\":\"4\"},{\"value\":\"Mayo\",\"key\":\"5\"},{\"value\":\"Junio\",\"key\":\"6\"},{\"value\":\"Julio\",\"key\":\"7\"},{\"value\":\"Agosto\",\"key\":\"8\"},{\"value\":\"Septiembre\",\"key\":\"9\"},{\"value\":\"Octubre\",\"key\":\"10\"},{\"value\":\"Noviembre\",\"key\":\"11\"},{\"value\":\"Diciembre\",\"key\":\"12\"}]}"
                    /// {"options":[{"value":"Enero","key":"1"},{"value":"Febrero","key":"2"},{"value":"Marzo","key":"3"},{"value":"Abril","key":"4"},{"value":"Mayo","key":"5"},{"value":"Junio","key":"6"},{"value":"Julio","key":"7"},{"value":"Agosto","key":"8"},{"value":"Septiembre","key":"9"},{"value":"Octubre","key":"10"},{"value":"Noviembre","key":"11"},{"value":"Diciembre","key":"12"}]}
                },
                new Parameter
                {
                    ParameterId = "MFAF",
                    Name = "Mes Fin Año Fiscal",
                    Value = "12",
                    Type = "dropdown",
                    Options = "{\"options\":[{\"value\":\"Enero\",\"key\":\"1\"},{\"value\":\"Febrero\",\"key\":\"2\"},{\"value\":\"Marzo\",\"key\":\"3\"},{\"value\":\"Abril\",\"key\":\"4\"},{\"value\":\"Mayo\",\"key\":\"5\"},{\"value\":\"Junio\",\"key\":\"6\"},{\"value\":\"Julio\",\"key\":\"7\"},{\"value\":\"Agosto\",\"key\":\"8\"},{\"value\":\"Septiembre\",\"key\":\"9\"},{\"value\":\"Octubre\",\"key\":\"10\"},{\"value\":\"Noviembre\",\"key\":\"11\"},{\"value\":\"Diciembre\",\"key\":\"12\"}]}"
                },
                new Parameter
                {
                    ParameterId = "TNOM",
                    Name = "Tipo Lista de Empleados",
                    Value = "1",
                    Type = "dropdown",
                    Options = "{\"options\":[{\"value\":\"Semanal\",\"key\":\"1\"},{\"value\":\"Quincenal\",\"key\":\"2\"},{\"value\":\"Mensual\",\"key\":\"3\"}]}"
                },
            };

          var company = new Company {
              Name = "Test Company",
              Identification = "1234567890",
              ActiveStatus = true
          };

          var hierarchyStructure =
            new HierarchyStructure
              {
                Name = "Geográfica",
                Description = "GEOGRÁFICA O DE TERRITORIOS",
                StartDate = DateTime.Now.Date,
                ActiveStatus = true,
                Company = company,
                Version = 1,
                ChildNodes = new List<HierarchyStructureNode>
                               {
                                 new HierarchyStructureNode
                                   {
                                     Name = "País",
                                     ChildNode = new HierarchyStructureNode
                                                   {
                                                     Name = "Región",
                                                     Revisor = true,
                                                     ChildNode = new HierarchyStructureNode
                                                                   {
                                                                     Name = "Departamento",
                                                                     ChildNode = new HierarchyStructureNode
                                                                                   {
                                                                                     Name = "Ciudad",
                                                                                     Revisor = true
                                                                                   }
                                                                   }
                                                   }
                                   }
                               }
              };

          var hiearachy = new HierarchyTree
                            {
                              Name = "Geográfica",
                              Description = "Geográfica 1",
                              HierarchyStructure = hierarchyStructure,
                              StartDate = DateTime.Now.Date,
                              ActiveStatus = true,
                              Version = 1,
                              Time = catalogItems11[0],
                              Company = company,
                              ChildNodes = new List<HierarchyTreeNode>
                                         {
                                           new HierarchyTreeNode
                                             {
                                               Name = "Colombia",
                                               StructureNode = hierarchyStructure.ChildNodes.FirstOrDefault(),
                                               ChildNodes = new List<HierarchyTreeNode>
                                                          {
                                                            new HierarchyTreeNode
                                                              {
                                                                Name = "Centro",
                                                                StructureNode = hierarchyStructure.ChildNodes.First().ChildNode,
                                                                Revisor = true,
                                                                ChildNodes = new List<HierarchyTreeNode>
                                                                           {
                                                                             new HierarchyTreeNode
                                                                               {
                                                                                 Name = "Cundinamarca",
                                                                                 StructureNode = hierarchyStructure.ChildNodes.First().ChildNode.ChildNode,
                                                                                 ChildNodes = new List<HierarchyTreeNode>
                                                                                            {
                                                                                              new HierarchyTreeNode
                                                                                                {
                                                                                                  Name = "Bogotá",
                                                                                                  Revisor = true,
                                                                                                  StructureNode = hierarchyStructure.ChildNodes.First().ChildNode.ChildNode.ChildNode
                                                                                                }
                                                                                            }
                                                                               }
                                                                           }
                                                              },
                                                            new HierarchyTreeNode
                                                              {
                                                                Name = "Atlántico",
                                                                StructureNode = hierarchyStructure.ChildNodes.First().ChildNode,
                                                                ChildNodes = new List<HierarchyTreeNode>
                                                                           {
                                                                             new HierarchyTreeNode
                                                                               {
                                                                                 Name = "Magdalena",
                                                                                 StructureNode = hierarchyStructure.ChildNodes.First().ChildNode.ChildNode,
                                                                                 ChildNodes = new List<HierarchyTreeNode>
                                                                                            {
                                                                                              new HierarchyTreeNode
                                                                                                {
                                                                                                  Name = "Santa Marta",
                                                                                                  StructureNode = hierarchyStructure.ChildNodes.First().ChildNode.ChildNode.ChildNode
                                                                                                }
                                                                                            }
                                                                               }
                                                                           }
                                                              },
                                                          }
                                             }
                                         }
                            };

          var indicators = new[]
                             {
                               new Indicator
                                 {
                                   Name = "Indicador 1",
                                   Description = "Indicador 1",
                                   StartDate = DateTime.Now,
                                   FinalDate = DateTime.Now.AddYears(1),
                                   IndicatorType = catalogItems08.FirstOrDefault(),
                                   Periodicity = catalogItems11[0],
                                   UssageId = 1,
                                   DataInputId = 1,
                                   ActiveStatus = true
                                 },
                               new Indicator
                                 {
                                   Name = "Indicador 2",
                                   Description = "Indicador 2",
                                   StartDate = DateTime.Now,
                                   FinalDate = DateTime.Now.AddYears(1),
                                   IndicatorType = catalogItems08.FirstOrDefault(),
                                   Periodicity = catalogItems11[0],
                                   UssageId = 1,
                                   DataInputId = 1,
                                   ActiveStatus = true
                                 },
                             };

          var roheDataBase = new SqlDataBase
                               {
                                 Name = "ROHE",
                                 SqlTables = new[]
                                               {
                                                 new SqlTable
                                                   {
                                                     Name = "Tabla 01",
                                                     Fields = new[]
                                                                {
                                                                  new SqlField { Name = "Field 01", Type = "string" },
                                                                  new SqlField { Name = "Field 02", Type = "date" },
                                                                  new SqlField { Name = "Field 03", Type = "number" },
                                                                }.ToList()
                                                   },
                                                 new SqlTable
                                                   {
                                                     Name = "Tabla 02",
                                                     Fields = new[]
                                                                {
                                                                  new SqlField { Name = "Field 01", Type = "number" },
                                                                  new SqlField { Name = "Field 02", Type = "string" },
                                                                  new SqlField { Name = "Field 03", Type = "date" },
                                                                }.ToList()
                                                   },
                                               }.ToList()
                               };

          var dataSource = new SqlDataSource
                             {
                               Name = "Sql DataSource 01",
                               Description = "Sql DataSource 01",
                               SqlDataBase = roheDataBase,
                               ActiveStatus = true,
                               SqlTable = roheDataBase.SqlTables.First(),
                               SqlFields = roheDataBase.SqlTables.First().Fields.Take(2).Select(x => new SqlDataSourceField { SqlField = x } ).ToList()
                             };

          var variables = new[]
          {
            new Variable
            {
              Name = "Variable 1",
              Description = "Variable 1",
              SourceTypeId = DataSourceType.Sql,
              SqlDataSource = dataSource,
              SqlField = dataSource.SqlFields.First().SqlField,
              OperatorId = 1,
              ActiveStatus = true,
              Version = 1
            },
            new Variable
            {
              Name = "Variable 2",
              Description = "Variable 2",
              SourceTypeId = DataSourceType.Sql,
              SqlDataSource = dataSource,
              SqlField = dataSource.SqlFields.First().SqlField,
              OperatorId = 1,
              ActiveStatus = true,
              Version = 1
            },
          };

          var incidentUploadConfig = new UploadConfiguration
          {
            SourceTypeId = DataSourceType.Sql,
            Type = UploadConfigurationType.Incident,
            UploadConfigurationFields = new List<UploadConfigurationField>
            {
              new UploadConfigurationField { Name = "Código" },
              new UploadConfigurationField { Name = "Tipo Identificación" },
              new UploadConfigurationField { Name = "Identificación" },
              new UploadConfigurationField { Name = "Fecha" },
              new UploadConfigurationField { Name = "Tipo de Incidencia" },
              new UploadConfigurationField { Name = "Tipo de ausentismo" },
              new UploadConfigurationField { Name = "Fecha Inicio" },
              new UploadConfigurationField { Name = "Días de ausencia" },
              new UploadConfigurationField { Name = "Posición" },
              new UploadConfigurationField { Name = "Jerarquía" }
            }
          };

          var paySheetUploadConfig = new UploadConfiguration
          {
            SourceTypeId = DataSourceType.Sql,
            Type = UploadConfigurationType.PaySheet,
            UploadConfigurationFields = new List<UploadConfigurationField>
            {
              new UploadConfigurationField { Name = "Código" },
              new UploadConfigurationField { Name = "Tipo Identificación" },
              new UploadConfigurationField { Name = "Identificación" },
              new UploadConfigurationField { Name = "Fecha" },
              new UploadConfigurationField { Name = "Salario" },
              new UploadConfigurationField { Name = "Área" },
              new UploadConfigurationField { Name = "Cargo" },
            }
          };

          var indicatorUploadConfig = new UploadConfiguration
          {
            SourceTypeId = DataSourceType.Sql,
            Type = UploadConfigurationType.Indicator,
            UploadConfigurationFields = new List<UploadConfigurationField>
            {
              new UploadConfigurationField { Name = "Indicador" },
              new UploadConfigurationField { Name = "Fecha" },
              new UploadConfigurationField { Name = "Tipo Identificación" },
              new UploadConfigurationField { Name = "Número Identificación" },
              new UploadConfigurationField { Name = "Valor" },
              new UploadConfigurationField { Name = "Área" },
            }
          };

            foreach (var parameter in parameters)
            {
                this.unitOfWork.ParameterRepository.Add(parameter);
            }

            foreach (var action in actions)
            {
                this.unitOfWork.ActionRepository.Add(action);
            }

            foreach (var catalog in catalogs)
            {
                this.unitOfWork.CatalogRepository.Add(catalog);
            }

            foreach (var perm in permissions)
            {
                this.unitOfWork.PermissionRepository.Add(perm);
            }

            foreach (var item in menuItems)
            {
              this.unitOfWork.MenuItemRepository.Add(item);
            }

          foreach (var item in indicators)
          {
            this.unitOfWork.IndicatorRepository.Add(item);
          }

          foreach (var item in variables)
          {
            this.unitOfWork.VariableRepository.Add(item);
          }

          this.unitOfWork.HierarchyTreeRepository.Add(hiearachy);
          this.unitOfWork.IncidentUploadConfigurationRepository.Add(incidentUploadConfig);
          this.unitOfWork.IncidentUploadConfigurationRepository.Add(paySheetUploadConfig);
          this.unitOfWork.IncidentUploadConfigurationRepository.Add(indicatorUploadConfig);
          this.unitOfWork.SqlDataSourceRepository.Add(dataSource);


            var task = new ScheduledTask
            {
                TaskType = uploadTask,
                ExecutionType = catalogItems12.First(),
                Name = "Carga Lista de Empleados",
                Days = "1110101",
                SqlDataSource = dataSource,
                StartDate = new DateTime(2018, 2, 1),
                StartTime = new DateTime(2018, 2, 1, 10, 0, 0),
                ExecutionResults = new List<ScheduledTaskResult> {
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Message,
                        EventDate = DateTime.Now,
                        Description = "Ejecución Exitosa"
                    },
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Error,
                        EventDate = DateTime.Now,
                        Description = "Error en ejecución xyz"
                    }
                }
            };
            this.unitOfWork.ScheduledTaskRepository.Add(task);

            var task2 = new ScheduledTask
            {
                TaskType = processingTask,
                ProcessId = 1, //// compensación
                ProcessDate = DateTime.Now,
                ExecutionType = catalogItems12.First(),
                Name = "Cálculo Compensación",
                Days = "1110101",
                StartDate = new DateTime(2018, 2, 1),
                StartTime = new DateTime(2018, 2, 1, 10, 0, 0),
                ExecutionResults = new List<ScheduledTaskResult>
                                     {
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Message,
                        EventDate = DateTime.Now,
                        Description = "Ejecución Exitosa"
                    },
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Error,
                        EventDate = DateTime.Now,
                        Description = "Error en ejecución xyz"
                    }
                }
            };
            this.unitOfWork.ScheduledTaskRepository.Add(task2);

            var task3 = new ScheduledTask
            {
                TaskType = deliveryTask,
                ProcessDate = DateTime.Now,
                SqlDataSource = dataSource,
                ExecutionType = catalogItems12.First(),
                Name = "Distribución de Cuotas",
                Days = "1110101",
                StartDate = new DateTime(2018, 3, 1),
                StartTime = new DateTime(2018, 3, 1, 10, 0, 0),
                ExecutionResults = new List<ScheduledTaskResult>
                                     {
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Message,
                        EventDate = DateTime.Now,
                        Description = "Ejecución Exitosa"
                    },
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Error,
                        EventDate = DateTime.Now,
                        Description = "Error en ejecución xyz"
                    }
                }
            };
            this.unitOfWork.ScheduledTaskRepository.Add(task3);

            var task4 = new ScheduledTask
            {
                TaskType = processingTask,
                ProcessId = 3, //// cuotas
                ProcessDate = DateTime.Now,
                ExecutionType = catalogItems12.First(),
                Name = "Cálculo de Cuotas",
                Days = "1110101",
                StartDate = new DateTime(2018, 2, 1),
                StartTime = new DateTime(2018, 2, 1, 10, 0, 0),
                ExecutionResults = new List<ScheduledTaskResult>
                                     {
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Message,
                        EventDate = DateTime.Now,
                        Description = "Ejecución Exitosa"
                    },
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Error,
                        EventDate = DateTime.Now,
                        Description = "Error en ejecución xyz"
                    }
                }
            };
            this.unitOfWork.ScheduledTaskRepository.Add(task4);

            var task5 = new ScheduledTask
            {
                TaskType = uploadTask,
                SqlDataSource = dataSource,
                ExecutionType = catalogItems12.First(),
                Name = "Carga Incidencias",
                Days = "1110101",
                StartDate = new DateTime(2018, 2, 1),
                StartTime = new DateTime(2018, 2, 1, 10, 0, 0),
                ExecutionResults = new List<ScheduledTaskResult>
                                     {
                    new ScheduledTaskResult {
                        EventType = ScheduledEventType.Message,
                        EventDate = DateTime.Now,
                        Description = "Ejecución Exitosa"
                    },
                }
            };
            this.unitOfWork.ScheduledTaskRepository.Add(task5);
            this.unitOfWork.Save();

            this.CreateRoles();
            this.CreateUsers(catalogItems09);

        }

        private void CreateRoles()
        {
            var adminRole = new ApplicationRole
            {
                Name = "Admin",
                Description = "Usuario Administrador",
                Permissions =
                                        this.unitOfWork.PermissionRepository.GetAll()
                                            .Select(p => new RolePermission { PermissionId = p.Id }).ToList()
            };

            var rolesToAdd = new List<ApplicationRole>()
                                 {
                                     adminRole,
                                     new ApplicationRole
                                         {
                                             Name = "User",
                                             Description = "Usuario acceso limitado"
                                         }
                                 };


            foreach (var role in rolesToAdd)
            {
                if (!this.roleManager.RoleExistsAsync(role.Name).Result)
                {
                    this.roleManager.CreateAsync(role).Result.ToString();
                }
            }
        }

        private void CreateUsers(List<CatalogItem> catalogItems09)
        {
            if (!this.context.ApplicationUsers.Any())
            {
                this.userManager.CreateAsync(
                    new ApplicationUser
                        {
                            UserName = "admin@admin.com",
                            FirstName = "Admin first",
                            LastName = "Admin last",
                            Email = "admin@admin.com",
                            EmailConfirmed = true,
                            CreatedDate = DateTime.Now,
                            IdentificationTypeId = catalogItems09.First().Id,
                            Identification = "111111111",
                            IsEnabled = true,
                            ApplicationRoleId = 1
                        },
                    "P@ssw0rd!").Result.ToString();

                this.userManager.AddToRoleAsync(
                    this.userManager.FindByNameAsync("admin@admin.com").GetAwaiter().GetResult(),
                    "Admin").Result.ToString();

                this.userManager.CreateAsync(
                    new ApplicationUser
                        {
                            UserName = "user@user.com",
                            FirstName = "First",
                            LastName = "Last",
                            Email = "user@user.com",
                            EmailConfirmed = true,
                            CreatedDate = DateTime.Now,
                            IdentificationTypeId = catalogItems09.First().Id,
                            Identification = "2222222222",
                            IsEnabled = true,
                            ApplicationRoleId = 2
                        },
                    "P@ssw0rd!").Result.ToString();
                this.userManager.AddToRoleAsync(
                    this.userManager.FindByNameAsync("user@user.com").GetAwaiter().GetResult(),
                    "User").Result.ToString();
            }
        }
    }
}
