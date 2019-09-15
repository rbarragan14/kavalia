// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ApiController.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the ApiController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{

  using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Localization;

  [Authorize]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public class ApiController : Controller
  {

    protected IStringLocalizer<RestApiResource> Localizer { get; }


    /// <summary>
    /// Initializes a new instance of the <see cref="ApiController"/> class.
    /// </summary>
    public ApiController(IStringLocalizer<RestApiResource> localizer)
    {
      this.Localizer = localizer;
    }
  }
}
