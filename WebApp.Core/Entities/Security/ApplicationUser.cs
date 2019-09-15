// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ApplicationUser.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ApplicationUser type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace WebApp.Core.Entities.Security
{
    using WebApp.Core.Entities.Configuration;

    /// <summary>
    /// The application user.
    /// </summary>
    public class ApplicationUser : IdentityUser<int>, IEntityBase
    {
        /// <summary>
        /// Gets or sets a value indicating whether is enabled.
        /// </summary>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// Gets or sets the created date.
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        [StringLength(250)]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        [StringLength(250)]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the application role id.
        /// </summary>
        public int ApplicationRoleId { get; set; }

        /// <summary>
        /// Gets or sets the role.
        /// </summary>
        public ApplicationRole Role { get; set; }

        /// <summary>
        /// Gets or sets the identification type id.
        /// </summary>
        public int IdentificationTypeId { get; set; }

        /// <summary>
        /// Gets or sets the identification type.
        /// </summary>
        public CatalogItem IdentificationType { get; set; }

        /// <summary>
        /// Gets or sets the identification.
        /// </summary>
        public string Identification { get; set; }

        ///// public ApplicationUserPhoto ProfilePhoto { get; set; }

        [NotMapped]
        public string Name => this.FirstName + " " + this.LastName;
    }
}
