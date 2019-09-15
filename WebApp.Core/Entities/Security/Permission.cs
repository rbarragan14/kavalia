// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Permission.cs" company="">
//   
// </copyright>
// <summary>
//   The permission.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Security
{
    /// <summary>
    /// The permission.
    /// </summary>
    public class Permission : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public List<ActionPermission> Actions { get; set; }

        public List<RolePermission> Roles { get; set; }
    }
}
