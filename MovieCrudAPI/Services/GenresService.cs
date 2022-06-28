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
    public class GenresService : IMovieCrudService<Genre>
    {
        private readonly MovieCrudAPIContext _context;

        public GenresService(MovieCrudAPIContext context)
        {
            _context = context;
        }

        public async Task<Genre> GetObject(int id)
        {
            return await _context.Genres.FindAsync(id);
        }

        public async Task<IEnumerable<Genre>> GetObjectByName(string name)
        {
            IEnumerable<Genre> genres;
            if (!string.IsNullOrWhiteSpace(name))
            {
                genres = await _context.Genres.Where(n => n.Name.Contains(name)).ToListAsync();
            }
            else
            {
                genres = await GetObjects();
            }
            return genres;
        }

        public async Task<Genre> GetObjectById(int id)
        {
            Genre genres;
            if (id != 0)
            {
                genres = await _context.Genres.Where(n => n.Id == id).FirstOrDefaultAsync();
            }
            else
            {
                genres = null;
            }
            return genres;
        }

        public async Task<IEnumerable<Genre>> GetObjects()
        {
            try
            {
                return await _context.Genres.ToListAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task Create(Genre genre)
        {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Genre genre)
        {
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Genre genre)
        {
            _context.Entry(genre).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
