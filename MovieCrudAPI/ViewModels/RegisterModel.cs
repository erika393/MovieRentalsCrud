using System.ComponentModel.DataAnnotations;

namespace MovieCrudAPI.ViewModels
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [DataType(DataType.Password)]
        [Display(Name = "Confirm the password")]
        [Compare("Password", ErrorMessage = "Not the same passwords")]
        public string ConfirmPassword { get; set; }
    }
}
