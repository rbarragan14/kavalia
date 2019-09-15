// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Catalog.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the Catalog type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration
{
    /// <summary>
    /// The catalog.
    /// </summary>
    public class Catalog : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string CatalogId { get; set; }

        public string Name { get; set; }

        public bool CanBeEdited { get; set; }

        public List<CatalogItem> CatalogItems { get; set; }
    }
}
