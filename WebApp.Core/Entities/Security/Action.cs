namespace WebApp.Core.Entities.Security
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Action: IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string ActionName { get; set; }

        public string Controller { get; set; }

        public List<ActionPermission> Permissions { get; set; }
    }
}
