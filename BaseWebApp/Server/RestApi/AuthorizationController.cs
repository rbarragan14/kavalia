
namespace BaseWebApp.Server.RestApi
{
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;

    using AspNet.Security.OpenIdConnect.Extensions;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AspNet.Security.OpenIdConnect.Server;

    using BaseWebApp.Server.Filters;
    using BaseWebApp.Server.Helpers;

    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    using OpenIddict.Abstractions;
    using OpenIddict.Core;
    using OpenIddict.Server;

    using WebApp.Core.Entities;
    using WebApp.Core.Entities.Security;

  public class AuthorizationController : ApiController
    {
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;

        public AuthorizationController(
            IStringLocalizer<RestApiResource> localizer,
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory)
          : base(localizer)
        {
            this._identityOptions = identityOptions;
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._logger = loggerFactory.CreateLogger<AuthorizationController>();

        }

        [AllowAnonymous]
        [HttpPost("~/connect/token"),
        Produces("application/json")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest connectRequest)
        {
            Debug.Assert(connectRequest.IsTokenRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            if (connectRequest.IsPasswordGrantType())
            {
                var user = await this._userManager.FindByNameAsync(connectRequest.Username);
                if (user == null)
                {
                    return this.BadRequest(this.Localizer["AuthorizationController_Exchange_TheUsernamePasswordCoupleIsInvalid"].Value);
                }

                // Validate the username/password parameters and ensure the account is not locked out.
                var result = await this._signInManager.CheckPasswordSignInAsync(user, connectRequest.Password, lockoutOnFailure: true);
                if (!result.Succeeded)
                {
                    return this.BadRequest(this.Localizer["AuthorizationController_Exchange_TheUsernamePasswordCoupleIsInvalid"].Value);
                }

                // Create a new authentication ticket.
                var ticket = await this.CreateTicketAsync(connectRequest, user);

                return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }

            else if (connectRequest.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await this.HttpContext.AuthenticateAsync(OpenIdConnectServerDefaults.AuthenticationScheme);

                // Retrieve the user profile corresponding to the refresh token.
                // Note: if you want to automatically invalidate the refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await this._userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid."
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await this._signInManager.CanSignInAsync(user))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in."
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await this.CreateTicketAsync(connectRequest, user, info.Properties);

                return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
        }

        [AllowAnonymous]
        [HttpGet("~/connect/authorize")]
        public async Task<IActionResult> Authorize(OpenIdConnectRequest connectRequest)
        {

            var info = await this._signInManager.GetExternalLoginInfoAsync();

            if (info == null)
            {
                // If an identity provider was explicitly specified, redirect
                // the user agent to the AccountController.ExternalLogin action.
                var provider = (string)connectRequest["provider"];

                if (!string.IsNullOrEmpty(provider))
                {
                    // Request a redirect to the external login provider.
                    var returnUrl = this.Request.PathBase + this.Request.Path + this.Request.QueryString;
                    var properties = this._signInManager.ConfigureExternalAuthenticationProperties(provider, returnUrl);
                    return this.Challenge(properties, provider);
                }

                return this.Render(ExternalLoginStatus.Error);
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await this._signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);

            if (result.Succeeded)
            {
                // Retrieve the profile of the logged in user.
                var user = await this._userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                if (user == null)
                {
                    return this.Render(ExternalLoginStatus.Error);
                }

                this._logger.LogInformation(5, $"User logged in with ${info.LoginProvider} provider.");
                var ticket = await this.CreateTicketAsync(connectRequest, user);
                // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
                return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else
            {
                var email = (string)connectRequest["email"];
                if (!string.IsNullOrEmpty(email))
                {
                    var user = new ApplicationUser { UserName = email, Email = email };
                    var accountCreateResult = await this._userManager.CreateAsync(user);
                    if (accountCreateResult.Succeeded)
                    {
                        accountCreateResult = await this._userManager.AddLoginAsync(user, info);
                        if (accountCreateResult.Succeeded)
                        {
                            this._logger.LogInformation(6, $"User created an account using ${info.LoginProvider} provider.");
                            var ticket = await this.CreateTicketAsync(connectRequest, user);
                            // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
                            return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
                        }
                    }
                    else
                    {
                        return this.BadRequest(new ApiError("Email already exists"));
                    }
                }
                else
                {
                    // External account doesn't have a local account so ask to create one
                    return this.Render(ExternalLoginStatus.CreateAccount);
                }

            }


            return this.Render(ExternalLoginStatus.Error);

            // if (result.RequiresTwoFactor)
            // {
            //     return this.Render(ExternalLoginStatus.TwoFactor);
            // }
            // if (result.IsLockedOut)
            // {
            //     return this.Render(ExternalLoginStatus.Lockout);
            // }
            // else
            // {
            //     // If the user does not have an account, then ask the user to create an account.
            //     // ViewData["ReturnUrl"] = returnUrl;
            //     // ViewData["LoginProvider"] = info.LoginProvider;
            //     // var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            //     // return RedirectToAction("Index", "Home", new ExternalLoginCreateAccountViewModel { Email = email });
            //     return this.Render(ExternalLoginStatus.CreateAccount);
            // }

            // if (!User.Identity.IsAuthenticated)
            // {
            //     // If the client application request promptless authentication,
            //     // return an error indicating that the user is not logged in.
            //     if (request.HasPrompt(OpenIdConnectConstants.Prompts.None))
            //     {
            //         var properties = new AuthenticationProperties(new Dictionary<string, string>
            //         {
            //             [OpenIdConnectConstants.Properties.Error] = OpenIdConnectConstants.Errors.LoginRequired,
            //             [OpenIdConnectConstants.Properties.ErrorDescription] = "The user is not logged in."
            //         });

            //         // Ask OpenIddict to return a login_required error to the client application.
            //         return Forbid(properties, OpenIdConnectServerDefaults.AuthenticationScheme);
            //     }

            //     return Challenge();
            // }
        }

      [HttpGet("~/connect/logout")]
      public async Task<IActionResult> Logout()
      {
        // Ask ASP.NET Core Identity to delete the local and external cookies created
        // when the user agent is redirected from the external identity provider
        // after a successful authentication flow (e.g Google or Facebook).
        await this._signInManager.SignOutAsync();

        // Returning a SignOutResult will ask OpenIddict to redirect the user agent
        // to the post_logout_redirect_uri specified by the client application.
        return this.SignOut(OpenIddictServerDefaults.AuthenticationScheme);
      }

    private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user, AuthenticationProperties properties = null)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await this._signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(principal, properties,
                OpenIdConnectServerDefaults.AuthenticationScheme);

            if (!request.IsRefreshTokenGrantType())
            {
                // Set the list of scopes granted to the client application.
                // Note: the offline_access scope must be granted
                // to allow OpenIddict to return a refresh token.
                ticket.SetScopes(new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            }

            ticket.SetResources("resource_server");

            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in ticket.Principal.Claims)
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type == this._identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {
                    continue;
                }

                var destinations = new List<string>
                {
                    OpenIdConnectConstants.Destinations.AccessToken
                };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }

                claim.SetDestinations(destinations);
            }

            return ticket;
        }


    }
}
