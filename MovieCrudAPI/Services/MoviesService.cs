using Microsoft.EntityFrameworkCore;
using MovieCrudAPI.Data;
using MovieCrudAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Cors;

namespace MovieCrudAPI.Services
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MoviesService : IMovieCrudService<Movie>
    {
        private readonly MovieCrudAPIContext _context;

        public MoviesService(MovieCrudAPIContext context)
        {
            _context = context;
        }

        public async Task<Movie> GetObject(int id)
        {
            return await _context.Movies.FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<IEnumerable<Movie>> GetObjects()
        {
            try
            {
                return await _context.Movies.ToListAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<Movie>> GetObjectByName(string name)
        {
            IEnumerable<Movie> movies;
            if (!string.IsNullOrWhiteSpace(name))
            {
                movies = await _context.Movies.Where(n => n.Name.Contains(name)).ToListAsync();
            }
            else
            {
                movies = await GetObjects();
            }
            return movies;
        }

        public async Task Create(Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Movie movie)
        {
            _context.Entry(movie).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Movie movie)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }
    }
}
