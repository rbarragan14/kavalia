namespace WebApp.Infrastructure.Services.Reader
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using CsvHelper;
    using CsvHelper.Configuration;
    using CsvHelper.TypeConversion;

    using WebApp.Core.Entities.Configuration;

    public class IdentificationTypeConverter : ITypeConverter
    {
        private readonly List<CatalogItem> identificationTypes;

        public IdentificationTypeConverter(List<CatalogItem> identificationTypes)
        {
            this.identificationTypes = identificationTypes;
        }

        public string ConvertToString(object value, IWriterRow row, MemberMapData memberMapData)
        {
            throw new NotImplementedException();
        }

        public object ConvertFromString(string text, IReaderRow row, MemberMapData memberMapData)
        {
            var objectType = this.identificationTypes.FirstOrDefault(
                x => x.CatalogItemId.Equals(text.Trim(), StringComparison.InvariantCultureIgnoreCase));

            if (objectType != null)
            {
                return objectType;
            }

            throw new TypeConverterException(this, memberMapData, text, row.Context);
        }
    }
}
