using MovieCrudAPI.Model;
using MovieCrudAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace GenreCrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GenresController : Controller
    {
        private GenresService _genreService;

        public GenresController(GenresService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet]
        public async Task<ActionResult<IAsyncEnumerable<Genre>>> GetGenres()
        {
            try
            {
                var genres = await _genreService.GetObjects();
                return Ok(genres);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the genre");
            }
        }

        [HttpGet("{id:int}", Name = "GetGenre")]
        public async Task<ActionResult<Genre>> GetGenre(int id)
        {
            try
            {
                var genre = await _genreService.GetObject(id);
                if (genre == null)
                {
                    return NotFound($"There is no genre with the id: {id}");
                }
                return Ok(genre);
            }
            catch
            {
                return BadRequest("Request Inválido");
            }
        }

        [HttpGet("GenresByName")]
        public async Task<ActionResult<IAsyncEnumerable<Genre>>> GetGenresByNome([FromQuery] string name)
        {
            try
            {
                var genres = await _genreService.GetObjectByName(name);
                if (genres.Count() == 0)
                {
                    return NotFound($"There are no genres with the criterion {name}");
                }
                return Ok(genres);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the genre");
            }
        }

        [HttpPost("Create")]
        public async Task<ActionResult> Create(Genre genre)
        {
            try
            {
                await _genreService.Create(genre);
                return CreatedAtRoute(nameof(GetGenre), new { id = genre.Id }, genre);
            }
            catch
            {
                return BadRequest("Invalid request");
            }
        }

        [HttpPut("{id:int}", Name = "Update")]
        public async Task<ActionResult> Update(int id, [FromBody] Genre genre)
        {
            try
            {
                if (genre.Id == id)
                {
                    await _genreService.Update(genre);
                    return Ok($"Id genre {id} has been updated successfully");
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
                var genre = await _genreService.GetObject(id);
                if (genre != null)
                {
                    await _genreService.Delete(genre);
                    return Ok($"Id genre {id} has been successfully deleted");
                }
                else
                {
                    return NotFound($"id genre {id} not found");
                }
            }
            catch
            {
                return BadRequest("Invalid request");
            }
        }
    }
}
