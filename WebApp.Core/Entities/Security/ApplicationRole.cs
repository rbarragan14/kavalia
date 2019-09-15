namespace WebApp.Core.Entities.Security
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using Microsoft.AspNetCore.Identity;

    /// <summary>
    /// The application role.
    /// </summary>
    public class ApplicationRole : IdentityRole<int>, IEntityBase
    {
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        [StringLength(250)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the permissions.
        /// </summary>
        public List<RolePermission> Permissions { get; set; }
    }
}
