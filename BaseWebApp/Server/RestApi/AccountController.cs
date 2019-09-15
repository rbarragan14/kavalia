// --------------------------------------------------------------------------------------------------------------------
// <copyright file="AccountController.cs" company="">
//
// </copyright>
// <summary>
//   The account controller.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.RestApi
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    using BaseWebApp.Server.Filters;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;

    using WebApp.Core.Entities.Security;
    using WebApp.Infrastructure.Repositories;
    using WebApp.Infrastructure.Services;
    using WebApp.Infrastructure.ViewModels.Account;

  /// <summary>
    /// The account controller.
    /// </summary>
    [Auditable]
    [Authorize("HasPermission")]
    [Route("api/[controller]")]
    public class AccountController : ApiController
    {
        /// <summary>
        /// The unit of work.
        /// </summary>
        private readonly UnitOfWork unitOfWork;

        /// <summary>
        /// The user manager.
        /// </summary>
        private readonly UserManager<ApplicationUser> userManager;

        /// <summary>
        /// The sign in manager.
        /// </summary>
        private readonly SignInManager<ApplicationUser> signInManager;

        /// <summary>
        /// The _email sender.
        /// </summary>
        private readonly IEmailSender emailSender;

        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccountController"/> class.
        /// </summary>
        /// <param name="userManager">
        /// The user manager.
        /// </param>
        /// <param name="identityOptions">
        /// The identity options.
        /// </param>
        /// <param name="signInManager">
        /// The sign in manager.
        /// </param>
        /// <param name="emailSender">
        /// The email sender.
        /// </param>
        /// <param name="loggerFactory">
        /// The logger factory.
        /// </param>
        public AccountController(
            IStringLocalizer<RestApiResource> localizer,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILoggerFactory loggerFactory,
            UnitOfWork unitOfWork)
          : base(localizer)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.emailSender = emailSender;
            this.logger = loggerFactory.CreateLogger<AccountController>();
            this.unitOfWork = unitOfWork;
        }

        /// <summary>
        /// The login.
        /// </summary>
        /// <param name="model">
        /// The model.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("login")]
        [AllowAnonymous]
        [ActionDescription("Ingreso usuario a aplicación")]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var result = await this.signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            if (result.Succeeded)
            {
                var user = await this.userManager.FindByEmailAsync(model.Email);
                var roles = await this.userManager.GetRolesAsync(user);
                this.logger.LogInformation(1, "User logged in.");
                return SignIn(user, roles);
            }

            /*
            if (result.RequiresTwoFactor)
            {
                return RedirectToAction(nameof(SendCode), new { RememberMe = model.RememberMe });
            }
            */

            if (result.IsLockedOut)
            {
                this.logger.LogWarning(2, "User account locked out.");
                return this.BadRequest(new ApiError("Lockout"));
            }

            return this.BadRequest(new ApiError("Invalid login attempt."));
        }

        /// <summary>
        /// The log off.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("logout")]
        [ActionDescription("Salida usuario de aplicación")]
        public async Task<IActionResult> LogOff()
        {
            await this.signInManager.SignOutAsync();
            this.logger.LogInformation(4, "User logged out.");
            return this.NoContent();
        }

        /// <summary>
        /// The get all users.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("user")]
        [ActionDescription("Consulta lista usuarios")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await this.userManager.Users.ToListAsync();
            return this.Ok(users);
        }


        [HttpGet("menu")]
        [AuditIgnore]
        [AllowAnonymous]
        public async Task<IActionResult> GetMenuItems()
        {
            var currentUser = await this.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return this.Forbid();
            }

            var menuQuery = this.unitOfWork.MenuItemRepository.GetQuery(
                           m => m.ParentItem == null,
                           null,
                           null,
                           null,
                           new SortExpression<MenuItem>(m => m.Order, ListSortDirection.Ascending));

            menuQuery = menuQuery.Include(m => m.Permissions);
            menuQuery = menuQuery.Include(m => m.Children).ThenInclude(c => c.Permissions);

            var menu = await menuQuery.ToListAsync();
            var filtered = await this.FilterMenuItems(currentUser, menu);

            return this.Ok(filtered);
        }

        /// <summary>
        /// The filter menu items.
        /// </summary>
        /// <param name="currentUser">
        /// The current user.
        /// </param>
        /// <param name="menu">
        /// The menu.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        private async Task<IEnumerable<MenuItem>> FilterMenuItems(ApplicationUser currentUser, IEnumerable<MenuItem> menu)
        {
            var role = await this.unitOfWork.RoleRepository.GetSingleAsync(currentUser.ApplicationRoleId, i => i.Permissions);
            return this.CheckPermission(role.Permissions, menu);
        }

        /// <summary>
        /// The check permission.
        /// </summary>
        /// <param name="permissions">
        /// The permissions.
        /// </param>
        /// <param name="menu">
        /// The menu.
        /// </param>
        /// <returns>
        /// The <see cref="List"/>.
        /// </returns>
        private List<MenuItem> CheckPermission(IReadOnlyCollection<RolePermission> permissions, IEnumerable<MenuItem> menu)
        {
            if (menu == null)
            {
                return null;
            }

            var filteredValues = new List<MenuItem>();
            foreach (var menuItem in menu)
            {
                var parentItem = menuItem.Permissions == null || menuItem.Permissions.Count == 0;
                if (menuItem.DefaultAuth || parentItem
                                         || menuItem.Permissions.TrueForAll(
                                             p => permissions.Any(pr => pr.PermissionId == p.PermissionId)))
                {
                    menuItem.Children = this.CheckPermission(permissions, menuItem.Children);
                    if (menuItem.Children != null || menuItem.DefaultAuth || !parentItem)
                    {
                        filteredValues.Add(menuItem);
                    }
                }
            }

            return filteredValues.Count == 0 ? null : filteredValues.OrderBy(m => m.Order).ToList();
        }


        /// <summary>
        /// The register.
        /// </summary>
        /// <param name="model">
        /// The model.
        /// </param>
        /// <param name="returnUrl">
        /// The return url.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut("user")]
        [ActionDescription("Crear usuario")]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel model, string returnUrl = null)
        {
            var currentUser = new ApplicationUser
                                  {
                                      UserName = model.Email,
                                      Email = model.Email,
                                      FirstName = model.Firstname,
                                      LastName = model.Lastname,
                                      ApplicationRoleId = model.ApplicationRoleId,
                                      Identification = model.Identification,
                                      IdentificationTypeId = model.IdentificationTypeId,
                                      CreatedDate = DateTime.Now
                                  };

            var applicationRole = await this.unitOfWork.RoleRepository.GetSingleAsync(model.ApplicationRoleId);
            if (applicationRole == null)
            {
                return this.BadRequest();
            }

            var result = await this.userManager.CreateAsync(currentUser, model.Password);

            if (result.Succeeded)
            {
                // Add to roles
                var roleAddResult = await this.userManager.AddToRoleAsync(currentUser, applicationRole.Name);
                if (roleAddResult.Succeeded)
                {
                    var code = await this.userManager.GenerateEmailConfirmationTokenAsync(currentUser);
                    var host = this.Request.Scheme + "://" + this.Request.Host;
                    var callbackUrl = host + "?userId=" + currentUser.Id + "&emailConfirmCode=" + code;
                    var confirmationLink = "<a class='btn-primary' href=\"" + callbackUrl + "\">Confirm email address</a>";
                    this.logger.LogInformation(3, "User created a new account with password.");
                    await this.emailSender.SendEmailAsync(model.Email, "Registration confirmation email", confirmationLink);
                    return this.CreatedAtRoute("GetUser", new { id = currentUser.Id }, currentUser);
                }
            }

            this.AddErrors(result);

            // If we got this far, something failed, redisplay form
            return this.BadRequest(new ApiError(this.ModelState));
        }

      [HttpPut("user/password")]
      [ActionDescription("Cambiar contraseña usuario")]
      public async Task<IActionResult> ChangePassword([FromBody] ResetPasswordViewModel model)
      {
        if (model == null || string.IsNullOrEmpty(model.Password))
        {
          return this.BadRequest();
        }

        var currentUser = await this.GetCurrentUserAsync();
        if (currentUser == null)
        {
          return this.Forbid();
        }

        var result = await this.userManager.ChangePasswordAsync(currentUser, model.CurrentPassword, model.Password);
        if (result.Succeeded)
        {
            return new NoContentResult();
        }

        this.AddErrors(result);
        return this.BadRequest(new ApiError(this.ModelState));
      }

      [HttpPost("user/password/{id}")]
      [ActionDescription("Restablecer contraseña usuario")]
      public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model, int id)
      {
        if (model == null || string.IsNullOrEmpty(model.Password))
        {
          return this.BadRequest();
        }

        var user = await this.unitOfWork.UserRepository.GetSingleAsync(id);
        if (user == null)
        {
          return this.NotFound();
        }

        var entity = await this.userManager.FindByEmailAsync(user.Email);
        var token = await this.userManager.GeneratePasswordResetTokenAsync(entity);
        var result = await this.userManager.ResetPasswordAsync(entity, token, model.Password);
        if (result.Succeeded)
        {
            return new NoContentResult();
        }

        this.AddErrors(result);
        return this.BadRequest(new ApiError(this.ModelState));
      }

    /// <summary>
    /// The get all roles.
    /// </summary>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    [HttpGet("role")]
        [ActionDescription("Consulta lista de roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await this.unitOfWork.RoleRepository.GetAllAsync();
            return this.Ok(roles);
        }

        /// <summary>
        /// The get role by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("role/{id}", Name = "GetRole")]
        [ActionDescription("Consulta detalles de rol")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role = await this.unitOfWork.RoleRepository.GetSingleAsync(id, r => r.Permissions);
            if (role == null || role.Id != id)
            {
                return this.NotFound("Role not Found");
            }

            return this.Ok(role);
        }

        /// <summary>
        /// The get user by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("user/{id}", Name = "GetUser")]
        [ActionDescription("Consulta detalles de usuario")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await this.unitOfWork.UserRepository.GetSingleAsync(id);
            if (user == null || user.Id != id)
            {
                return this.NotFound("User not Found");
            }

            return this.Ok(user);
        }

        [HttpGet("userinfo", Name = "GetUserInfo")]
        [ActionDescription("Consulta detalles de usuario")]
        public async Task<IActionResult> GetCurrentUserInformation()
        {
          var currentUser = await this.GetCurrentUserAsync();
          if (currentUser == null)
          {
            return this.Forbid();
          }

          return this.Ok(currentUser);
        }


    /// <summary>
    /// The get all permission.
    /// </summary>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    [HttpGet("permission")]
        [ActionDescription("Consulta lista de permisos")]
        public async Task<IActionResult> GetAllPermission()
        {
            var permissions = await this.unitOfWork.PermissionRepository.GetAllAsync();
            if (!permissions.Any())
            {
                return this.NotFound("Permissions not Found");
            }

            return this.Ok(permissions);
        }

        /// <summary>
        /// The create role.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPut("role")]
        [ActionDescription("Crear rol")]
        public async Task<IActionResult> CreateRole([FromBody] ApplicationRole item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            await this.unitOfWork.RoleRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetRole", new { id = item.Id }, item);
        }

        /// <summary>
        /// The update role.
        /// </summary>
        /// <param name="item">
        /// The item.
        /// </param>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpPost("role/{id}")]
        [ActionDescription("Modificar rol")]
        public async Task<IActionResult> UpdateRole([FromBody] ApplicationRole item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var role = await this.unitOfWork.RoleRepository.GetSingleAsync(id, i => i.Permissions);
            if (role == null)
            {
                return this.NotFound();
            }

            role.Name = item.Name;
            role.Description = item.Description;
            item.Permissions.ForEach(p => p.RoleId = id);

            this.unitOfWork.RoleRepository.AddRemoveCollectionItems(role.Permissions, item.Permissions, x => $"{x.RoleId}-{x.PermissionId}");
            this.unitOfWork.RoleRepository.Edit(role);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        /// <summary>
        /// The delete role by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpDelete("role/{id}")]
        [ActionDescription("Borrar rol")]
        public async Task<IActionResult> DeleteRoleById(int id)
        {
            var role = await this.unitOfWork.RoleRepository.GetSingleAsync(id, r => r.Permissions);
            if (role == null || role.Id != id)
            {
                return this.NotFound("Role not Found");
            }

            this.unitOfWork.RoleRepository.Delete(role);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

      /// <summary>
      /// The update user.
      /// </summary>
      /// <param name="item">
      /// The item.
      /// </param>
      /// <param name="id">
      /// The id.
      /// </param>
      /// <returns>
      /// The <see cref="Task"/>.
      /// </returns>
      [HttpPost("user/{id}")]
      [ActionDescription("Actualizar usuario")]
      public async Task<IActionResult> UpdateUser([FromBody] RegisterViewModel item, int id)
      {
        if (item == null)
        {
          return this.BadRequest();
        }

        var user = await this.unitOfWork.UserRepository.GetSingleAsync(id);
        if (user == null)
        {
          return this.NotFound();
        }

        var applicationRole = await this.unitOfWork.RoleRepository.GetSingleAsync(item.ApplicationRoleId);
        if (applicationRole == null)
        {
          return this.BadRequest();
        }

        user.FirstName = item.Firstname;
        user.LastName = item.Lastname;
        user.ApplicationRoleId = item.ApplicationRoleId;
        user.Identification = item.Identification;
        user.IdentificationTypeId = item.IdentificationTypeId;

        this.unitOfWork.UserRepository.Edit(user);
        await this.unitOfWork.SaveAsync();
        return new NoContentResult();
      }

      /// <summary>
        /// The get audit logs.
        /// </summary>
        /// <param name="from">
        /// The from.
        /// </param>
        /// <param name="to">
        /// The to.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        [HttpGet("auditlog")]
        [ActionDescription("Consulta reporte auditoria")]
        public async Task<IActionResult> GetAuditLogs(DateTime from, DateTime to)
        {
            var auditLogs = await this.unitOfWork.AuditLogRepository.GetAsync(
                                log => log.Date >= from && log.Date <= to,
                                1,
                                100,
                                new SortExpression<AuditLog>(log => log.Date, ListSortDirection.Descending));

            return this.Ok(auditLogs);
        }

        [HttpGet("delegate")]
        [ActionDescription("Consulta lista de delegación usuario")]
        public async Task<IActionResult> GetAllUserDelegates()
        {
            var currentUser = await this.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return this.Forbid();
            }

            var userDelegates = await this.unitOfWork.UserDelegateRepository.GetQuery(u => u.UserId == currentUser.Id)
                                    .Include(u => u.DelegateUser).Select(
                                        u => new
                                        {
                                            u.Id,
                                            u.StartDate,
                                            u.FinalDate,
                                            u.DelegateUserId,
                                            u.DelegateUser.Name
                                        }).ToListAsync();

            return this.Ok(userDelegates);
        }

        [HttpGet("delegate/{id}", Name = "GetDelegate")]
        [ActionDescription("Consulta detalles de delegación usuario")]
        public async Task<IActionResult> GetUserDelegateById(int id)
        {
            var userDelegate = await this.unitOfWork.UserDelegateRepository.GetSingleAsync(id);
            if (userDelegate == null || userDelegate.Id != id)
            {
                return this.NotFound("User not Found");
            }

            return this.Ok(userDelegate);
        }

        [HttpGet("delegate/users", Name = "GetUsersToDelegate")]
        [AuditIgnore]
        public async Task<IActionResult> GetUsersToDelegate()
        {
            var currentUser = await this.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return this.Forbid();
            }

            var users = await this.userManager.Users.Where(u => u.Id != currentUser.Id)
                            .Select(u => new { u.Id, u.Name }).ToListAsync();

            return this.Ok(users);
        }


        [HttpPut("delegate")]
        [ActionDescription("Crear delegación usuario")]
        public async Task<IActionResult> CreateUserDelegate([FromBody] UserDelegate item)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var currentUser = await this.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return this.Forbid();
            }

            var user = await this.unitOfWork.UserRepository.GetSingleAsync(item.DelegateUserId);
            if (user == null)
            {
                return this.BadRequest();
            }

            item.UserId = currentUser.Id;
            item.DelegateUserId = user.Id;

            await this.unitOfWork.UserDelegateRepository.AddAsync(item);
            await this.unitOfWork.SaveAsync();

            return this.CreatedAtRoute("GetDelegate", new { id = item.Id }, item);
        }

        [HttpPost("delegate/{id}")]
        [ActionDescription("Modificar delegación usuario")]
        public async Task<IActionResult> UpdateUserDelegate([FromBody] UserDelegate item, int id)
        {
            if (item == null)
            {
                return this.BadRequest();
            }

            var currentUser = await this.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return this.Forbid();
            }

            var user = await this.unitOfWork.UserRepository.GetSingleAsync(item.DelegateUserId);
            if (user == null)
            {
                return this.BadRequest();
            }

            var userDelegate = await this.unitOfWork.UserDelegateRepository.GetSingleAsync(id);
            if (userDelegate == null)
            {
                return this.NotFound();
            }

            userDelegate.StartDate = item.StartDate;
            userDelegate.FinalDate = item.FinalDate;
            userDelegate.DelegateUserId = user.Id;

            this.unitOfWork.UserDelegateRepository.Edit(userDelegate);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }

        [HttpDelete("delegate/{id}")]
        [ActionDescription("Borrar delegación usuario")]
        public async Task<IActionResult> DeleteUserDelegateById(int id)
        {
            var userDelegate = await this.unitOfWork.UserDelegateRepository.GetSingleAsync(id);
            if (userDelegate == null || userDelegate.Id != id)
            {
                return this.NotFound("Delegate not Found");
            }

            this.unitOfWork.UserDelegateRepository.Delete(userDelegate);
            await this.unitOfWork.SaveAsync();
            return new NoContentResult();
        }


        /// <summary>
        /// The add errors.
        /// </summary>
        /// <param name="result">
        /// The result.
        /// </param>
        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                this.ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        /// <summary>
        /// The sign in.
        /// </summary>
        /// <param name="user">
        /// The user.
        /// </param>
        /// <param name="roles">
        /// The roles.
        /// </param>
        /// <returns>
        /// The <see cref="IActionResult"/>.
        /// </returns>
        private static IActionResult SignIn(ApplicationUser user, IList<string> roles)
        {
            var userResult = new { User = new { DisplayName = user.UserName, Roles = roles } };
            return new ObjectResult(userResult);
        }

        /// <summary>
        /// The get current user async.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return this.userManager.GetUserAsync(this.HttpContext.User);
        }

        /*


                [HttpGet("ConfirmEmail")]
                [AllowAnonymous]
                public async Task<IActionResult> ConfirmEmail(string userId, string code)
                {
                    if (userId == null || code == null)
                    {
                        return View("Error");
                    }
                    var user = await this.userManager.FindByIdAsync(userId);
                    if (user == null)
                    {
                        return View("Error");
                    }
                    var result = await this.userManager.ConfirmEmailAsync(user, code);
                    return View(result.Succeeded ? "ConfirmEmail" : "Error");
                }

                [HttpPost("ForgotPassword")]
                [AllowAnonymous]
                public async Task<IActionResult> ForgotPassword([FromBody]ForgotPasswordViewModel model)
                {
                    var currentUser = await this.userManager.FindByNameAsync(model.Email);
                    if (currentUser == null || !(await this.userManager.IsEmailConfirmedAsync(currentUser)))
                    {
                        // Don't reveal that the user does not exist or is not confirmed
                        return NoContent();
                    }
                    // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    var code = await this.userManager.GeneratePasswordResetTokenAsync(currentUser);

                    var host = Request.Scheme + "://" + Request.Host;
                    var callbackUrl = host + "?userId=" + currentUser.Id + "&passwordResetCode=" + code;
                    var confirmationLink = "<a class='btn-primary' href=\"" + callbackUrl + "\">Reset your password</a>";
                    await _emailSender.SendEmailAsync(model.Email, "Forgotten password email", confirmationLink);
                    return NoContent(); // sends 204
                }

                [HttpPost("resetpassword")]
                [AllowAnonymous]
                public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordViewModel model)
                {
                    var user = await this.userManager.FindByNameAsync(model.Email);

                    if (user == null)
                    {
                        // Don't reveal that the user does not exist
                        return Ok("Reset confirmed");
                    }
                    var result = await this.userManager.ResetPasswordAsync(user, model.Code, model.Password);
                    if (result.Succeeded)
                    {
                        return Ok("Reset confirmed"); ;
                    }
                    AddErrors(result);
                    return BadRequest(new ApiError(ModelState));
                }

                [HttpGet("SendCode")]
                [AllowAnonymous]
                public async Task<ActionResult> SendCode(string returnUrl = null, bool rememberMe = false)
                {
                    var user = await this.signInManager.GetTwoFactorAuthenticationUserAsync();
                    if (user == null)
                    {
                        return BadRequest(new ApiError("Error"));
                    }
                    var userFactors = await this.userManager.GetValidTwoFactorProvidersAsync(user);
                    var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
                    return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
                }

                [HttpPost("SendCode")]
                [AllowAnonymous]
                public async Task<IActionResult> SendCode([FromBody]SendCodeViewModel model)
                {
                    var user = await this.signInManager.GetTwoFactorAuthenticationUserAsync();
                    if (user == null)
                    {
                        return BadRequest(new ApiError("Error"));
                    }

                    // Generate the token and send it
                    var code = await this.userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
                    if (string.IsNullOrWhiteSpace(code))
                    {
                        return BadRequest(new ApiError("Error"));
                    }

                    var message = "Your security code is: " + code;
                    if (model.SelectedProvider == "Email")
                    {
                        await _emailSender.SendEmailAsync(user.Email, "Security Code", message);
                    }
                    // else if (model.SelectedProvider == "Phone")
                    // {
                    //     await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);
                    // }

                    return RedirectToAction(nameof(VerifyCode), new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
                }

                [HttpGet("VerifyCode")]
                [AllowAnonymous]
                public async Task<IActionResult> VerifyCode(string provider, bool rememberMe, string returnUrl = null)
                {
                    // Require that the user has already logged in via username/password or external login
                    var user = await this.signInManager.GetTwoFactorAuthenticationUserAsync();
                    if (user == null)
                    {
                        return BadRequest(new ApiError("Error"));
                    }
                    return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
                }

                [HttpPost("VerifyCode")]
                [AllowAnonymous]
                public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
                {
                    // The following code protects for brute force attacks against the two factor codes.
                    // If a user enters incorrect codes for a specified amount of time then the user account
                    // will be locked out for a specified amount of time.
                    var result = await this.signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe, model.RememberBrowser);
                    if (result.Succeeded)
                    {
                        return RedirectToLocal(model.ReturnUrl);
                    }
                    if (result.IsLockedOut)
                    {
                        this.logger.LogWarning(7, "User account locked out.");
                        return View("Lockout");
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid code.");
                        return View(model);
                    }
                }

                #region Helpers



                private IActionResult RedirectToLocal(string returnUrl)
                {
                    if (Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction(nameof(HomeController.Index), "Home");
                    }
                }
        */
    }
}
