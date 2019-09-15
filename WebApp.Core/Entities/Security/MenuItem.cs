namespace WebApp.Core.Entities.Security
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class MenuItem: IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public short Order { get; set;}

        public string Name { get; set;}

        public string Url { get; set; }

        public string Icon { get; set; }

        public MenuItem ParentItem { get; set; }

        public List<MenuItem> Children { get; set; }

        public bool DefaultAuth { get; set; }

        public bool Navigable { get; set; }

        public List<MenuItemPermission> Permissions { get; set; }
    }
}
