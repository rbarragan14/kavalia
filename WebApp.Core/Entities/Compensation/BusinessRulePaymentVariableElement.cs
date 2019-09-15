// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BusinessRulePaymentVariableElement.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the BusinessRulePaymentVariableElement type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Compensation
{
    public class BusinessRulePaymentVariableElement
    {
      public int BusinessRuleId { get; set; }

      public BusinessRule BusinessRule { get; set; }

      public int Id { get; set; }

      public CatalogItem PaymentVariableElement { get; set; }
  }
}
