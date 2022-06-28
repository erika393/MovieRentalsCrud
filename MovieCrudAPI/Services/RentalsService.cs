using Microsoft.EntityFrameworkCore;
using MovieCrudAPI.Data;
using MovieCrudAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MovieCrudAPI.Services
{
    public class RentalsService
    {
        private readonly MovieCrudAPIContext _context;

        public RentalsService(MovieCrudAPIContext context)
        {
            _context = context;
        }

        public async Task<Rental> GetObject(int id)
        {
            return await _context.Rentals.FindAsync(id);
        }

        public async Task<IEnumerable<Rental>> GetObjectByDate(DateTime? rentalDate)
        {
            IEnumerable<Rental> rentals;
            if (rentalDate.HasValue)
            {
                rentals = await _context.Rentals.Where(n => n.RentalDate >= rentalDate.Value).Include(n => n.MoviesList).ToListAsync();
            }
            else
            {
                rentals = await GetObjects();
            }
            return rentals;
        }

        public async Task<IEnumerable<Rental>> GetObjects()
        {
            try
            {
                return await _context.Rentals.ToListAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task Create(Rental rental)
        {
            var moviesId = rental.MoviesList.Select(m=>m.Id).ToArray();
            var moviesFromDb = _context.Movies.Where(m => moviesId.Contains(m.Id)).ToList();

            rental.MoviesList = new List<Movie>();

            _context.Rentals.Add(rental);
            _context.SaveChanges();

            moviesFromDb.ForEach(m => {
                rental.MoviesList.Add(m);
                m.RentalId = rental.Id;
                _context.SaveChanges();
            });
        }

        public async Task Delete(Rental rental)
        {
            _context.Movies.Where(n => n.RentalId == rental.Id).ToList().ForEach(n => n.RentalId = null);
            _context.SaveChanges();
            _context.Rentals.Remove(rental);
            await _context.SaveChangesAsync();
            
        }

        public async Task Update(Rental rental)
        {
            _context.Entry(rental).State = EntityState.Modified;

            var moviesId = rental.MoviesList.Select(m => m.Id).ToArray();
            var moviesFromDb = _context.Movies.Where(m => moviesId.Contains(m.Id)).ToList();
            var moviesFromDbForNullable = _context.Movies.Where(m => m.RentalId == rental.Id).ToList();
            moviesFromDbForNullable.ForEach(m => {
                m.RentalId = null;
            });
            _context.SaveChanges();

            moviesFromDb.ForEach(m => {
                rental.MoviesList.Add(m);
                m.RentalId = rental.Id;
                _context.SaveChanges();
            });
            await _context.SaveChangesAsync();
        }
    }
}
