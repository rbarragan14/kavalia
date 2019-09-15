using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using Serilog.Events;
using static Microsoft.AspNetCore.ResponseCompression.ResponseCompressionDefaults;

namespace BaseWebApp.Server.Helpers
{
    using System;
    using System.Reflection;

    using WebApp.Core.Entities;

  public static class Helpers
    {
        public static string JsonSerialize(object obj)
        {
            return JsonConvert.SerializeObject(obj,
                        new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                            StringEscapeHandling = StringEscapeHandling.EscapeHtml,
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        });
        }
        public static void SetupSerilog()
        {
            // Configure Serilog
            Log.Logger = new LoggerConfiguration()
            .MinimumLevel
            .Information()
            .WriteTo.RollingFile("logs/log-{Date}.txt", LogEventLevel.Information) // Uncomment if logging required on text file
            .WriteTo.Seq("http://localhost:5341/")
            .CreateLogger();
        }

        public static IEnumerable<string> DefaultMimeTypes => MimeTypes.Concat(new[]
                                {
                                    "image/svg+xml",
                                    "application/font-woff2"
                                });

        public static IActionResult Render(this Controller ctrl, ExternalLoginStatus status)
        {
          //// return ctrl.RedirectToAction("Index", "Home", new { externalLoginStatus = (int)status });
          return null;
        }

        public static PropertyInfo[] GetAllProperties(this Type tp)
        {
            return tp.GetProperties(BindingFlags.FlattenHierarchy | BindingFlags.Public | BindingFlags.Instance);
        }
    }
}
