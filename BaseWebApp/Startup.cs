// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.cs" company="">
//
// </copyright>
// <summary>
//   Defines the Startup type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp
{
  using System.Globalization;

  using BaseWebApp.Server.Extensions;
  using BaseWebApp.Server.Filters;
  using BaseWebApp.Server.Helpers;

  using Hangfire;

  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.AspNetCore.HttpOverrides;
  using Microsoft.Extensions.Configuration;
  using Microsoft.Extensions.DependencyInjection;

  using Newtonsoft.Json;

  public class Startup
  {
    public static IConfiguration Configuration { get; private set; }

    public static IHostingEnvironment HostingEnvironment { get; private set; }

    public Startup(IConfiguration configuration, IHostingEnvironment env)
    {
      Configuration = configuration;
      HostingEnvironment = env;

      Helpers.SetupSerilog();

      // var builder = new ConfigurationBuilder()
      //                .SetBasePath(env.ContentRootPath)
      //                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
      //                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
      //                .AddEnvironmentVariables();
      // if (env.IsDevelopment())
      // {
      //     // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
      //     builder.AddUserSecrets<Startup>();
      // }

      // Configuration = builder.Build();
    }
    

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCustomDbContext();
      services.AddCustomIdentity();
      services.AddCustomOpenIddict();
      services.AddMvc().AddJsonOptions(o =>
        {
          //// o.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects;
          o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        });

      services.AddAuthorization(
        options =>
          {
            options.AddPolicy("HasPermission", policy => policy.Requirements.Add(new HasPermissionRequirement()));
          });

      services.RegisterCustomServices();
      services.AddCustomLocalization(HostingEnvironment);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseForwardedHeaders(
        new ForwardedHeadersOptions
          {
            ForwardedHeaders =
              ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
          });

      // Shows UseCors with CorsPolicyBuilder.
      /*
      app.UseCors(
          builder => builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader()
              .AllowAnyOrigin());
      */

      app.UseAuthentication();
      app.UseMvcWithDefaultRoute();
      app.UseDefaultFiles();
      app.UseStaticFiles();
      //// app.UseHangfireServer();
      app.UseHangfireDashboard();
    }
  }
}
