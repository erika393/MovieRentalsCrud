using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieCrudAPI.Model
{
    [Table("Rental")]
    public class Rental
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public List<Movie> MoviesList { get; set; }
        [Required]
        [Range(1, 999999999999, ErrorMessage = "Value must be between {1} to {0}")]
        public int CpfClient { get; set; }
        [Required]
        public DateTime RentalDate { get; set; }
    }
}
