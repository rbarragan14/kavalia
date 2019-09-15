// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Parameter.cs" company="">
//
// </copyright>
// <summary>
//   The parameter.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration
{
    /// <summary>
    /// The parameter.
    /// </summary>
    public class Parameter : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string ParameterId { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public string Type { get; set; }

        public string Options { get; set; }

        public string Resource { get; set; }

        public string ResourceName { get; set; }
    }
}
