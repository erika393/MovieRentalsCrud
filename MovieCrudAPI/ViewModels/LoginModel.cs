
using System.ComponentModel.DataAnnotations;

namespace MovieCrudAPI.ViewModels
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password required")]
        [StringLength(20, ErrorMessage = "The {0} must have a minimum of {2} and a maximum {1} characters.", MinimumLength = 10)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
