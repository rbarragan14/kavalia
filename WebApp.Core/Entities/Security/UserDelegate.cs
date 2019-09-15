// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UserDelegate.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the UserDelegate type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Core.Entities.Security
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// The user delegate.
    /// </summary>
    public class UserDelegate : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public ApplicationUser User { get; set; }

        public int DelegateUserId { get; set; }
        
        public ApplicationUser DelegateUser { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime FinalDate { get; set; }

        public bool ActiveStatus { get; set; }
    }
}
