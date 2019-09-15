using System;
using System.Collections.Generic;
using WebApp.Core.Entities.Configuration;

namespace WebApp.Core.Entities.Compensation
{
    public class CompensationSchema : IEntityBase
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? FinalDate { get; set; }

    public CatalogItem Periodicity { get; set; }

    public int PeriodicityId { get; set; }

    public List<CompensationSchemaPosition> Positions { get; set; }

    public List<PaymentVariable> PaymentVariables { get; set; }
  }
}
