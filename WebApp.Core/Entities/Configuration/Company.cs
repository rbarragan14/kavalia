using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration
{
    public class Company : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Identification { get; set; }

        public string Address { get; set; }

        public bool ActiveStatus { get; set; }
    }
}
