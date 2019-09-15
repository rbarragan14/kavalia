// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ActionDescriptionAttribute.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the ActionDescriptionAttribute type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.Filters
{
    using System;

    [AttributeUsage(AttributeTargets.Method)]
    public class ActionDescriptionAttribute : Attribute
    {
        public string ActionDescription { get; set; }

        public ActionDescriptionAttribute(string actionDescription)
        {
            this.ActionDescription = actionDescription;
        }
    }
}
