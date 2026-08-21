using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanningService.Data;
using TripPlanningService.DTOs;
using TripPlanningService.Models;

namespace TripPlanningService.Controllers
{
    [ApiController]
    [Route("api/tripplans/{tripPlanId}/destinations")]
    [Authorize]
    public class DestinationController : ControllerBase
    {
        private readonly TripPlanningDbContext _context;

        public DestinationController(TripPlanningDbContext context)
        {
            _context = context;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(userIdClaim);
        }

        private async Task<TripPlan> GetOwnedTripPlanOrNull(Guid tripPlanId)
        {
            var userId = GetUserId();
            var plan = await _context.TripPlans.FindAsync(tripPlanId);
            if (plan == null || plan.UserId != userId)
                return null;
            return plan;
        }

        // GET: api/tripplan/{tripPlanId}/destination
        [HttpGet]
        public async Task<ActionResult> GetDestinations(Guid tripPlanId)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var destinations = await _context.Destinations
                .Where(d => d.TripPlanId == tripPlanId)
                .Select(d => new DestinationDto
                {
                        Id = d.Id,
                        TripPlanId = d.TripPlanId,
                        Name = d.Name,
                        Location = d.Location,
                        ArrivalDate = d.ArrivalDate,
                        DepartureDate = d.DepartureDate,
                        Description = d.Description
                })
                .ToListAsync();

            return Ok(destinations);
        }

        // POST: api/tripplan/{tripPlanId}/destination
        [HttpPost]
        public async Task<ActionResult> CreateDestination(Guid tripPlanId, CreateDestinationDto request)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            if (request.DepartureDate < request.ArrivalDate)
                return BadRequest(new { message = "Datum odlaska ne može biti pre datuma dolaska." });

            var destination = new Destination
            {
                TripPlanId = tripPlanId,
                Name = request.Name,
                Location = request.Location,
                ArrivalDate = request.ArrivalDate,
                DepartureDate = request.DepartureDate,
                Description = request.Description
            };

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            var dto = new DestinationDto
            {
                Id = destination.Id,
                TripPlanId = destination.TripPlanId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description
            };

            return CreatedAtAction(nameof(GetDestinations), new { tripPlanId }, dto);
        }

        // PUT: api/tripplan/{tripPlanId}/destination/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDestination(Guid tripPlanId, Guid id, CreateDestinationDto request)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            if (request.DepartureDate < request.ArrivalDate)
                return BadRequest(new { message = "Datum odlaska ne može biti pre datuma dolaska." });

            var destination = await _context.Destinations
                .FirstOrDefaultAsync(d => d.Id == id && d.TripPlanId == tripPlanId);

            if (destination == null) return NotFound();

            destination.Name = request.Name;
            destination.Location = request.Location;
            destination.ArrivalDate = request.ArrivalDate;
            destination.DepartureDate = request.DepartureDate;
            destination.Description = request.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tripplan/{tripPlanId}/destination/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDestination(Guid tripPlanId, Guid id)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var destination = await _context.Destinations
                .FirstOrDefaultAsync(d => d.Id == id && d.TripPlanId == tripPlanId);

            if (destination == null) return NotFound();

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
