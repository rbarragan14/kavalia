// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Program.cs" company="">
//
// </copyright>
// <summary>
//   Defines the Program type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp
{
  using Microsoft.AspNetCore;
  using Microsoft.AspNetCore.Hosting;

  using WebApp.Infrastructure.Data;

  /// <summary>
  /// The program.
  /// </summary>
  public class Program
  {
    /// <summary>
    /// The main.
    /// </summary>
    /// <param name="args">
    /// The args.
    /// </param>
    public static void Main(string[] args)
    {
      var host = CreateWebHostBuilder(args).Build();

      /// http://odetocode.com/blogs/scott/archive/2016/09/20/database-migrations-and-seeding-in-asp-net-core.aspx
      var hostname = Startup.Configuration["Data:HostUrl"];
      ProcessDbCommands.Process(args, host, hostname);
      /// HibernatingRhinos.Profiler.Appender.EntityFramework.EntityFrameworkProfiler.Initialize();
      host.Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
      WebHost.CreateDefaultBuilder(args).UseStartup<Startup>().UseKestrel(a => a.AddServerHeader = false)
        .UseUrls("http://0.0.0.0:23354/");
  }
}
