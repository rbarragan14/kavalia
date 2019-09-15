namespace WebApp.Infrastructure.Services.Reader
{
    using System.Collections.Generic;
    using System.IO;

    using CsvHelper;

    using WebApp.Core.Entities.Compensation;
    using WebApp.Core.Entities.Configuration;

    public class IncidentFileReader
  {

    public void ReadIncidents()
    {
      var text = "0,1,2,2018-01-01,2019-01-01,IDT-01,6,7,8,9,10\n10,11,12,2018-02-02,2019-02-02,IDT-02,16,17,18,19,20";
      var identificationTypes = new List<CatalogItem>
                                  {
                                    new CatalogItem { CatalogItemId = "IDT-01" },
                                    new CatalogItem { CatalogItemId = "IDT-02" }
                                  };

      var errors = new List<string>();
      using (TextReader sr = new StringReader(text))
      {
        var csv = new CsvReader(sr);
        csv.Configuration.HasHeaderRecord = false;
        /*
        csv.Configuration.ReadingExceptionOccurred = exception =>
          {
            errors.Add($"Reading exception: {exception.Message}");
          };
        */
        csv.Configuration.RegisterClassMap(new IncidentRecordMap(identificationTypes));

        //// csv.Configuration.MissingFieldFound = null;

        while (csv.Read())
        {
          var x = csv.GetRecord<CompensationIncident>();

          /*
          for (int i = 0; csv.TryGetField<string>(i, out value); i++)
          {
            result.Add(value);
          }
          */
        }
      }
    }
  }
}
