using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieCrudAPI.Model
{
    [Table("Movies")]
    public class Movie
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(200, ErrorMessage = "Maximum size of {0}")]
        public string Name { get; set; }
        [Required]
        public DateTime CreationDate { get; set; }
        [Required]
        public bool Active { get; set; }
        [Required]
        public int GenreId { get; set; }

        public int? RentalId { get; set; } = null;
    }
}
