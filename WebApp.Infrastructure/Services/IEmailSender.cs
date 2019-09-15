// --------------------------------------------------------------------------------------------------------------------
// <copyright file="IEmailSender.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the IEmailSender type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Services
{
    using System.Threading.Tasks;

    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
