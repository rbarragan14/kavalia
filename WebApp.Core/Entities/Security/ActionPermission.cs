// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ActionPermission.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the ActionPermission type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Core.Entities.Security
{
    /// <summary>
    /// The action permission.
    /// </summary>
    public class ActionPermission
    {
        public int ActionId { get; set; }

        public Action Action { get; set; }

        public int PermissionId { get; set; }

        public Permission Permission { get; set; }
    }
}
