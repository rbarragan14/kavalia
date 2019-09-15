namespace WebApp.Infrastructure.Services
{
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore;

    using WebApp.Core.Entities.Compensation;
    using WebApp.Infrastructure.Repositories;

    public class CompensationServices
    {
        private readonly UnitOfWork unitOfWork;

        public CompensationServices(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<PaymentTable> GetPaymentTableById(int id)
        {
            var item = await this.unitOfWork.PaymentTableRepository.GetSingleAsync(id);
            if (item == null)
            {
                return null;
            }

            item.Hierarchies = await this.unitOfWork.PaymentTableHierarchyRepository.GetQuery()
                                   .Where(i => i.PaymentTableId == id).Include(d => d.HierarchyStructure)
                                   .Include(g => g.HierarchyStructureNode).ToListAsync();

            item.Indicators = await this.unitOfWork.PaymentTableIndicatorRepository.GetQuery()
                                  .Where(i => i.PaymentTableId == id).Include(d => d.Indicator)
                                  .Include(g => g.GoalPayment).Include(t => t.ThresholdDetails).ToListAsync();

            return item;
        }

        public async Task<bool> UpdatePaymentTable(int id, PaymentTable paymentTable)
        {
            var item = await this.GetPaymentTableById(id);
            if (item == null)
            {
                return false;
            }

            item.FinalDate = paymentTable.FinalDate;
            item.TableType = paymentTable.TableType;
            item.ThresholdType = paymentTable.ThresholdType;
            item.PercentageIndicatorType = paymentTable.PercentageIndicatorType;
            item.StartDate = paymentTable.StartDate;
            item.Name = paymentTable.Name;

            paymentTable.Hierarchies?.ForEach(x =>
                {
                    x.Id = 0;
                    x.PaymentTableId = id;
                    x.HierarchyStructure = null;
                    x.HierarchyStructureNode = null;
                });

            paymentTable.Indicators?.ForEach(x => x.PaymentTableId = id);

            this.unitOfWork.PaymentTableRepository.AddRemoveUpdateCollectionItems(
                item.Indicators,
                paymentTable.Indicators,
                v => v.Id);

            this.unitOfWork.PaymentTableRepository.AddRemoveCollectionItems(
                item.Hierarchies,
                paymentTable.Hierarchies,
                h => h.Id);

            this.unitOfWork.PaymentTableRepository.Edit(item);

            return true;
        }

        public async Task<UploadConfiguration> GetUploadConfiguration(UploadConfigurationType type)
        {
            UploadConfiguration item;
            var items = await this.unitOfWork.IncidentUploadConfigurationRepository.FindByAsync(x => x.Type == type, y => y.UploadConfigurationFields);

            if (items == null || (item = items.FirstOrDefault()) == null)
            {
                return null;
            }

            return item;
        }


        public async Task<bool> UpdateUploadConfiguration(UploadConfiguration newItem, UploadConfigurationType type)
        {
            var item = await this.GetUploadConfiguration(type);

            if (item == null)
            {
                return false;
            }

            item.SourceTypeId = newItem.SourceTypeId;
            item.SqlDataSourceId = newItem.SqlDataSourceId;
            item.FileDataSourceId = newItem.FileDataSourceId;
            item.FileName = newItem.FileName;

            foreach (var field in item.UploadConfigurationFields)
            {
                var newField = newItem.UploadConfigurationFields?.FirstOrDefault(x => x.Id == field.Id);
                if (newField != null)
                {
                    field.SqlDataSourceFieldId = item.SqlDataSourceId.HasValue ? newField.SqlDataSourceField?.Id : null;
                    field.FileDataSourceFieldId = item.FileDataSourceId.HasValue ? newField.FileDataSourceField?.Id : null;
                }
            }

            this.unitOfWork.IncidentUploadConfigurationRepository.Edit(item);
            return true;
        }
    }
}
