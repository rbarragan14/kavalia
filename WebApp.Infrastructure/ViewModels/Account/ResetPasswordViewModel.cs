namespace WebApp.Infrastructure.ViewModels.Account
{
    using System.ComponentModel.DataAnnotations;

    public class ResetPasswordViewModel
    {
        public string Password { get; set; }

        public string Code { get; set; }

        public string CurrentPassword { get; set; }
    }
}
