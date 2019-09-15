// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ServiceCollectionExtensions.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ServiceCollectionExtensions type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.Extensions
{
  using System;
  using System.Globalization;
  using System.Linq;

  using AspNet.Security.OpenIdConnect.Primitives;

  using BaseWebApp.Server.Filters;

  using Hangfire;
  using Hangfire.PostgreSql;

  using Microsoft.AspNetCore.Authentication.JwtBearer;
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.AspNetCore.Identity;
  using Microsoft.AspNetCore.Localization;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.Localization;

  using OpenIddict.Abstractions;

  using WebApp.Core.Entities.Security;
  using WebApp.Infrastructure.Data;
  using WebApp.Infrastructure.Repositories;
  using WebApp.Infrastructure.Services;

  /// <summary>
  /// The service collection extensions.
  /// </summary>
  public static class ServiceCollectionExtensions
  {
    /// <summary>
    /// The add custom identity.
    /// </summary>
    /// <param name="services">
    /// The services.
    /// </param>
    /// <returns>
    /// The <see cref="IServiceCollection"/>.
    /// </returns>
    public static IServiceCollection AddCustomIdentity(this IServiceCollection services)
    {
      // For api unauthorised calls return 401 with no body
      services.AddIdentity<ApplicationUser, ApplicationRole>(
        options =>
          {
            options.Password.RequiredLength = 4;
            options.Password.RequireNonAlphanumeric = false;
          }).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

      return services;
    }


    public static IServiceCollection AddCustomLocalization(this IServiceCollection services, IHostingEnvironment hostingEnvironment)
    {
      services.Configure<RequestLocalizationOptions>(opts =>
        {
          var supportedCultures = new[] { new CultureInfo("es"), new CultureInfo("en") };
          opts.DefaultRequestCulture = new RequestCulture(supportedCultures.First());

          // Formatting numbers, dates, etc.
          opts.SupportedCultures = supportedCultures;

          // UI strings that we have localized.
          opts.SupportedUICultures = supportedCultures;
        });

      services.AddLocalization(options => options.ResourcesPath = "Resources");

      return services;
    }

    /// <summary>
    /// The add custom db context.
    /// </summary>
    /// <param name="services">
    /// The services.
    /// </param>
    /// <returns>
    /// The <see cref="IServiceCollection"/>.
    /// </returns>
    public static IServiceCollection AddCustomDbContext(this IServiceCollection services)
    {
      var databaseType = Startup.Configuration["Data:databaseType"];
      string databaseConnection = string.Empty;

      if (databaseType.ToLower() == "pgsql")
      {
        var dataBaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrEmpty(dataBaseUrl))
        {
          databaseConnection = ParseHerokuPostgressUrl(dataBaseUrl);
        }
        else
        {
          var dbEnvConnection = Environment.GetEnvironmentVariable("DBENV_CN");
          if (!string.IsNullOrEmpty(dbEnvConnection))
          {
            databaseConnection = dbEnvConnection;
          }
        }

        databaseConnection = string.IsNullOrEmpty(databaseConnection)
                               ? Startup.Configuration["Data:connectionString"]
                               : databaseConnection;
        services.AddHangfire(x => x.UsePostgreSqlStorage(databaseConnection));
      }

      // Add framework services.
      services.AddDbContextPool<ApplicationDbContext>(
        options =>
          {
            if (databaseType.ToLower() == "memory")
            {
              options.UseInMemoryDatabase("BaseWebApp"); // Takes database name
            }
            else if (databaseType.ToLower() == "pgsql")
            {
              options.UseNpgsql(databaseConnection);
            }
            else
            {
              options.UseSqlServer(Startup.Configuration["Data:connectionString"]);
            }

            options.UseOpenIddict();
          });

      return services;
    }


    public static IServiceCollection AddCustomOpenIddict(this IServiceCollection services)
    {
      // Configure Identity to use the same JWT claims as OpenIddict instead
      // of the legacy WS-Federation claims it uses by default (ClaimTypes),
      // which saves you from doing the mapping in your authorization controller.
      services.Configure<IdentityOptions>(
        options =>
          {
            options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
            options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
            options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
          });

      // Register the OpenIddict services.
      services.AddOpenIddict()
        .AddCore(options =>
          options.UseEntityFrameworkCore().UseDbContext<ApplicationDbContext>())
        .AddServer(options =>
            {
              // Register the ASP.NET Core MVC binder used by OpenIddict.
              // Note: if you don't call this method, you won't be able to
              // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
              options.UseMvc();

              options.EnableAuthorizationEndpoint("/connect/authorize")
                .EnableLogoutEndpoint("/connect/logout")
                .EnableTokenEndpoint("/connect/token")
                .EnableUserinfoEndpoint("/api/account/userinfo");

              /*
              // Enable the password and the refresh token flows.
              options.AllowPasswordFlow().AllowRefreshTokenFlow()
                .AllowImplicitFlow(); // To enable external logins to authenticate
              */

              options.AllowPasswordFlow().AllowRefreshTokenFlow();
              options.DisableScopeValidation();
              options.SetAccessTokenLifetime(TimeSpan.FromMinutes(300));
              options.SetIdentityTokenLifetime(TimeSpan.FromMinutes(300));
              options.SetRefreshTokenLifetime(TimeSpan.FromMinutes(600));

              // During development, you can disable the HTTPS requirement.
              options.DisableHttpsRequirement();

              // Note: to use JWT access tokens instead of the default
              // encrypted format, the following lines are required:
              //
              // options.UseJsonWebTokens();
              options.AddEphemeralSigningKey();
            });

      services.AddAuthentication(
          options =>
            {
              // This will override default cookies authentication scheme
              options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
              options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
              options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddOAuthValidation()
        // https://console.developers.google.com/projectselector/apis/library?pli=1
        .AddGoogle(
          options =>
            {
              options.ClientId = Startup.Configuration["Authentication:Google:ClientId"];
              options.ClientSecret = Startup.Configuration["Authentication:Google:ClientSecret"];
            })
        // https://developers.facebook.com/apps
        //.AddFacebook(options =>
        //{
        //    options.AppId = Startup.Configuration["Authentication:Facebook:AppId"];
        //    options.AppSecret = Startup.Configuration["Authentication:Facebook:AppSecret"];
        //})
        // https://apps.twitter.com/
        .AddTwitter(
          options =>
            {
              options.ConsumerKey = Startup.Configuration["Authentication:Twitter:ConsumerKey"];
              options.ConsumerSecret = Startup.Configuration["Authentication:Twitter:ConsumerSecret"];
            })
        // https://apps.dev.microsoft.com/?mkt=en-us#/appList
        .AddMicrosoftAccount(
          options =>
            {
              options.ClientId = Startup.Configuration["Authentication:Microsoft:ClientId"];
              options.ClientSecret = Startup.Configuration["Authentication:Microsoft:ClientSecret"];
            })
        // Note: Below social providers are supported through this open source library:
        // https://github.com/aspnet-contrib/AspNet.Security.OAuth.Providers

        // https://www.linkedin.com/secure/developer?newapp=
        //.AddLinkedIn(options =>
        //{
        //    options.ClientId = Startup.Configuration["Authentication:LinkedIn:ClientId"];
        //    options.ClientSecret = Startup.Configuration["Authentication:LinkedIn:ClientSecret"];

        //})
        // https://github.com/settings/developers
        .AddGitHub(
          options =>
            {
              options.ClientId = Startup.Configuration["Authentication:Github:ClientId"];
              options.ClientSecret = Startup.Configuration["Authentication:Github:ClientSecret"];
            });
      // https://developer.paypal.com/developer/applications
      //.AddPaypal(options =>
      //{
      //    options.ClientId = Startup.Configuration["Authentication:Paypal:ClientId"];
      //    options.ClientSecret = Startup.Configuration["Authentication:Paypal:ClientSecret"];
      //})
      // https://developer.yahoo.com
      //.AddYahoo(options =>
      //{
      //    options.ClientId = Startup.Configuration["Authentication:Yahoo:ClientId"];
      //    options.ClientSecret = Startup.Configuration["Authentication:Yahoo:ClientSecret"];
      //})
      // https://stackapps.com/apps/oauth/
      //.AddStackExchange(options =>
      //{
      //    options.ClientId = Startup.Configuration["Authentication:StackExchange:ClientId"];
      //    options.ClientSecret = Startup.Configuration["Authentication:StackExchange:ClientSecret"];
      //})
      // https://stackapps.com/apps/oauth/
      //.AddAmazon(options =>
      //{
      //    options.ClientId = Startup.Configuration["Authentication:Amazon:ClientId"];
      //    options.ClientSecret = Startup.Configuration["Authentication:Amazon:ClientSecret"];
      //});

      return services;
    }

    public static IServiceCollection RegisterCustomServices(this IServiceCollection services)
    {
      /// services.AddSingleton<IStringLocalizerFactory, EFStringLocalizerFactory>();
      services.AddTransient<IEmailSender, EmailSender>();
      services.AddTransient<ApplicationDbContext>();
      services.AddScoped<UnitOfWork>();
      services.AddScoped<HierarchyServices>();
      services.AddScoped<CompensationServices>();
      services.AddScoped<FormulaService>();
      services.AddScoped<TaskSchedulerService>();
      services.AddScoped<IAuthorizationHandler, HasPermissionHandler>();

      /// services.AddScoped<UserResolverService>();
      /// services.AddScoped<ApiExceptionFilter>();
      return services;
    }

    private static string ParseHerokuPostgressUrl(string url)
    {
      var uri = new UriBuilder(new Uri(url));
      return
        $"Host={uri.Host};Port={uri.Port};Database={uri.Path.Substring(1)};Username={uri.UserName};Password={uri.Password};SSL Mode=Require;Trust Server Certificate=true";
    }
  }
}
