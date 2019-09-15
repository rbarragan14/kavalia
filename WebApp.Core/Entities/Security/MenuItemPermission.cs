namespace WebApp.Core.Entities.Security
{
    public class MenuItemPermission
    {
        public int MenuItemId { get; set; }

        public MenuItem MenuItem { get; set; }

        public int PermissionId { get; set; }

        public Permission Permission { get; set; }
    }
}