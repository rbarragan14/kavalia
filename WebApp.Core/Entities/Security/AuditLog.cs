using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Security
{
    public class AuditLog: IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Controller { get; set; }

        public string ActionName { get; set; }

        public string ActionDescription { get; set; }

        public System.DateTime Date { get; set; }

        public string SourceAddress { get; set; }

        public string RelatedInformation { get; set; }
    }
}
