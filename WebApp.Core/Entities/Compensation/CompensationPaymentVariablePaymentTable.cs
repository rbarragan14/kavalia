namespace WebApp.Core.Entities.Compensation
{
    public class CompensationPaymentVariablePaymentTable
    {
      public int PaymentVariableId { get; set; }

      public PaymentVariable PaymentVariable { get; set; }

      public int Id { get; set; }

      public PaymentTable PaymentTable { get; set; }
  }
}
