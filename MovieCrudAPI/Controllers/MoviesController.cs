using MovieCrudAPI.Model;
using MovieCrudAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace MovieCrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MoviesController : ControllerBase
    {
        private MoviesService _moviesService;
        private GenresService _genreService;

        public MoviesController(MoviesService moviesService, GenresService genreService)
        {
            _moviesService = moviesService;
            _genreService = genreService;
        }

        [HttpGet]
        public async Task<ActionResult<IAsyncEnumerable<Movie>>> GetMovies()
        {
            try
            {
                var movies = await _moviesService.GetObjects();
                return Ok(movies);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the movie");
            }
        }

        [HttpGet("{id:int}", Name = "GetMovie")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            try
            {
                var movie = await _moviesService.GetObject(id);
                if (movie == null)
                {
                    return NotFound($"There is no movie with the id: {id}");
                }
                return Ok(movie);
            }
            catch
            {
                return BadRequest("Request Inválido");
            }
        }

        [HttpGet("MoviesByName")]
        public async Task<ActionResult<IAsyncEnumerable<Movie>>> GetMoviesByNome([FromQuery] string name)
        {
            try
            {
                var movies = await _moviesService.GetObjectByName(name);
                if (movies.Count() == 0)
                {
                    return NotFound($"There are no movies with the criterion {name}");
                }
                return Ok(movies);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the movie");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create(Movie movie)
        {
            try
            {
                if(movie.RentalId == 0)
                {
                    movie.RentalId = null;
                }
                await _moviesService.Create(movie);
                return CreatedAtRoute(nameof(GetMovie), new { id = movie.Id }, movie); 
            }
            catch(Exception e )
            {
                return BadRequest("Invalid request");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int id, [FromBody] Movie movie)
        {
            try
            {
                if (movie.Id == id)
                {
                    await _moviesService.Update(movie);
                    return Ok($"Id movie {id} has been updated successfully");
                }
                else
                {
                    return BadRequest("Inconsistent data");
                }
            }
            catch
            {
                return BadRequest("Invalid request");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var movie = await _moviesService.GetObject(id);
                if (movie != null)
                {
                    await _moviesService.Delete(movie);
                    return Ok($"Id movie {id} has been successfully deleted");
                }
                else
                {
                    return NotFound($"id movie {id} not found");
                }
            }
            catch
            {
                return BadRequest("Invalid request");
            }
        }
    }
}
