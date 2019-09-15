namespace WebApp.Infrastructure.Services.Reader
{
    using System.Collections.Generic;

    using CsvHelper.Configuration;

    using WebApp.Core.Entities.Compensation;
    using WebApp.Core.Entities.Configuration;

    public sealed class IncidentRecordMap : ClassMap<CompensationIncident>
    {
        public IncidentRecordMap(List<CatalogItem> identificationTypes)
        {
            this.Map(m => m.Id).Ignore();
            this.Map(m => m.IncidentType).Ignore();
            this.Map(m => m.AbsenteeismType).Ignore();
            this.Map(m => m.Hierarchy).Ignore();

            this.Map(m => m.EmployeeCode).Index(0);
            this.Map(m => m.IdentificationId).Index(1);
            this.Map(m => m.AbsenteeismDays).Index(2);
            this.Map(m => m.WageDate).Index(3);
            this.Map(m => m.StartDate).Index(4);

            this.Map(m => m.IdentificationType).TypeConverter(new IdentificationTypeConverter(identificationTypes))
                .Index(5);
        }
    }
}
