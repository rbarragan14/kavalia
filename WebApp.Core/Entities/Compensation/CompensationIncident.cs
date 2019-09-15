using System;
using WebApp.Core.Entities.Configuration;
using WebApp.Core.Entities.Hierarchy;

namespace WebApp.Core.Entities.Compensation
{
    public class CompensationIncident : IEntityBase
  {
    public int Id { get; set; }

    public string EmployeeCode { get; set; }

    public CatalogItem IdentificationType { get; set; }

    public string IdentificationId { get; set; }

    public DateTime WageDate { get; set; }

    public CatalogItem IncidentType { get; set; }

    public CatalogItem AbsenteeismType { get; set; }

    public DateTime StartDate { get; set; }

    public int AbsenteeismDays { get; set; }

    public HierarchyTreeNode Hierarchy { get; set; }
  }
}