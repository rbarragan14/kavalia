// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CatalogItem.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the CatalogItem type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.Configuration
{
    /// <summary>
    /// The catalog item.
    /// </summary>
    public class CatalogItem : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string CatalogItemId { get; set; }

        public string Name { get; set; }

        public Catalog Catalog { get; set; }

        public int CatalogId { get; set; }
    }
}
