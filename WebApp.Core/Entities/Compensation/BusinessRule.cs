// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BusinessRule.cs" company="">
//
// </copyright>
// <summary>
//   Defines the BusinessRule type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Compensation
{
    public class BusinessRule : IEntityBase
  {
    public int Id { get; set; }

    public int Version { get; set; }

    public DateTime StartDate { get; set; }

    public int IncidentTypeId { get; set; }

    public CatalogItem IncidentType { get; set; }

    public int? PaymentTableId { get; set; }

    public PaymentTable PaymentTable { get; set; }

    public List<BusinessRulePaymentVariableElement> PaymentVariableElements { get; set; }

    public bool Additional { get; set; }

    public decimal? SalaryPercentage { get; set; }
  }
}
