using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieCrudAPI.Services;
using MovieCrudAPI.Model;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace RentalCrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RentalsController : ControllerBase
    {
        private RentalsService _rentalsService;
        private MoviesService _moviesService;

        public RentalsController(RentalsService rentalsService, MoviesService moviesService)
        {
            _rentalsService = rentalsService;
        }

        [HttpGet]
        public async Task<ActionResult<IAsyncEnumerable<Rental>>> GetRentals()
        {
            try
            {
                var rentals = await _rentalsService.GetObjects();
                return Ok(rentals);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the rental");
            }
        }

        [HttpGet("{id:int}", Name = "GetRental")]
        public async Task<ActionResult<Rental>> GetRental(int id)
        {
            try
            {
                var rental = await _rentalsService.GetObject(id);
                if (rental == null)
                {
                    return NotFound($"There is no rental with the id: {id}");
                }
                return Ok(rental);
            }
            catch
            {
                return BadRequest("Request Inválido");
            }
        }

        [HttpGet("RentalsByDate")]
        public async Task<ActionResult<IAsyncEnumerable<Rental>>> GetRentalsByDate([FromQuery] DateTime rentalDate)
        {
            try
            {
                var rentals = await _rentalsService.GetObjectByDate(rentalDate);
                if (rentals.Count() == 0)
                {
                    return NotFound($"There are no rentals with the criterion {rentalDate}");
                }
                return Ok(rentals);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting the rental");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create(Rental rental)
        {
            try
            {
                await _rentalsService.Create(rental);
                return CreatedAtRoute(nameof(GetRental), new { id = rental.Id }, rental);
            }
            catch(Exception e)
            {
                return BadRequest("Invalid request");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int id, [FromBody] Rental rental)
        {
            try
            {
                if (rental.Id == id)
                {
                    await _rentalsService.Update(rental);
                    return Ok($"Id rental {id} has been updated successfully");
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
                var rental = await _rentalsService.GetObject(id);
                if (rental != null)
                {
                    await _rentalsService.Delete(rental);
                    return Ok($"Id rental {id} has been successfully deleted");
                }
                else
                {
                    return NotFound($"id rental {id} not found");
                }
            }
            catch
            {
                return BadRequest("Invalid request");
            }
        }
    }
}
