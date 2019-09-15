using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Calc
{
    public class ParameterFormula : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public Formula Formula { get; set; }
    }
}
