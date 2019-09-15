using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Calc
{
    public class Formula : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Body { get; set; }

        public List<ParameterFormula> Parameters { get; set; }
    }
}
