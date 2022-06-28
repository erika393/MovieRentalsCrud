using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieCrudAPI.Model
{
    [Table("Genre")]
    public class Genre
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "Maximum size of {0}")]
        public string Name { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
