using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using MovieCrudAPI.Model;

namespace MovieCrudAPI.Data
{
    public class MovieCrudAPIContext : IdentityDbContext<IdentityUser>
    {
        public MovieCrudAPIContext(DbContextOptions<MovieCrudAPIContext> options)
            : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Rental> Rentals { get; set; }
    }
}
