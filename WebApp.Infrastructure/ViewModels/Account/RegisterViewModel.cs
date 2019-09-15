// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RegisterViewModel.cs" company="">
//
// </copyright>
// <summary>
//   Defines the RegisterViewModel type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.ViewModels.Account
{
    using System.ComponentModel.DataAnnotations;

    using WebApp.Core.Entities.Configuration;

    public class RegisterViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(250)]
        public string Firstname { get; set; }

        [Required]
        [StringLength(250)]
        public string Lastname { get; set; }

        [Required]
        [StringLength(250)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public int ApplicationRoleId { get; set;}


        /// <summary>
        /// Gets or sets the identification type.
        /// </summary>
        public int IdentificationTypeId { get; set; }

        /// <summary>
        /// Gets or sets the identification.
        /// </summary>
        public string Identification { get; set; }

    }
}
