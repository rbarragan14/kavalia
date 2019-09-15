// --------------------------------------------------------------------------------------------------------------------
// <copyright file="HasPermissionHandler.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the HasPermissionHandler type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.Filters
{
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    using AspNet.Security.OpenIdConnect.Extensions;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Controllers;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Logging;

    using WebApp.Infrastructure.Repositories;

  /// <summary>
    /// The has permission handler.
    /// </summary>
    public class HasPermissionHandler : AuthorizationHandler<HasPermissionRequirement>
    {
        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="HasPermissionHandler"/> class.
        /// </summary>
        /// <param name="unitOfWork">
        /// The unit of work.
        /// </param>
        /// <param name="loggerFactory">
        /// The logger factory.
        /// </param>
        public HasPermissionHandler(UnitOfWork unitOfWork, ILoggerFactory loggerFactory)
        {
            this.unitOfWork = unitOfWork;
            this.logger = loggerFactory.CreateLogger<HasPermissionHandler>();
        }

        /// <summary>
        /// The handle requirement async.
        /// </summary>
        /// <param name="context">
        /// The context.
        /// </param>
        /// <param name="requirement">
        /// The requirement.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            HasPermissionRequirement requirement)
        {
            if (context.Resource is AuthorizationFilterContext mvc
                && mvc.ActionDescriptor is ControllerActionDescriptor controller)
            {
                if (this.UserIsAuthorized(context.User, controller))
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// The user is authorized.
        /// </summary>
        /// <param name="contextUser">
        /// The context user.
        /// </param>
        /// <param name="controller">
        /// The controller.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        private bool UserIsAuthorized(ClaimsPrincipal contextUser, ControllerActionDescriptor controller)
        {
            if (contextUser == null || controller == null || !(contextUser.Identity is ClaimsIdentity claimsIdentity))
            {
                return false;
            }

            var roleName = claimsIdentity.GetClaim(claimsIdentity.RoleClaimType);
            var actionName = controller.ActionName;
            var controllerName = controller.ControllerName;

            var action = this.unitOfWork.ActionRepository.GetSingle(
                a => a.ActionName == actionName && a.Controller == controllerName,
                i => i.Permissions);

            var role = this.unitOfWork.RoleRepository.GetSingle(r => r.Name == roleName, i => i.Permissions);

            if (action == null || role == null)
            {
                return false;
            }

            if (action.Permissions == null || action.Permissions.Count == 0)
            {
                return true;
            }

            return role.Permissions.Select(rp => rp.Permission).Intersect(action.Permissions.Select(a => a.Permission))
                .Any();
        }
    }
}
