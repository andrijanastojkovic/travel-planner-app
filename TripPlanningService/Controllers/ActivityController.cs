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
    [Route("api/tripplan/{tripPlanId}/[controller]")]
    [Authorize]
    public class ActivityController : ControllerBase
    {
        private readonly TripPlanningDbContext _context;

        public ActivityController(TripPlanningDbContext context)
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

        private static ActivityDto ToDto(DayActivity a) => new ActivityDto
        {
            Id = a.Id,
            TripPlanId = a.TripPlanId,
            Date = a.Date,
            Name = a.Name,
            Time = a.Time,
            Location = a.Location,
            Description = a.Description,
            EstimatedCost = a.EstimatedCost,
            Status = a.Status.ToString()
        };

        // GET: api/tripplan/{tripPlanId}/activity
        [HttpGet]
        public async Task<ActionResult> GetActivities(Guid tripPlanId)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var activities = await _context.Activities
                .Where(a => a.TripPlanId == tripPlanId)
                .OrderBy(a => a.Date)
                .ToListAsync();

            return Ok(activities.Select(ToDto));
        }

        // POST: api/tripplan/{tripPlanId}/activity
        [HttpPost]
        public async Task<ActionResult> CreateActivity(Guid tripPlanId, CreateActivityDto request)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var activity = new DayActivity
            {
                TripPlanId = tripPlanId,
                Date = request.Date,
                Name = request.Name,
                Time = request.Time,
                Location = request.Location,
                Description = request.Description,
                EstimatedCost = request.EstimatedCost,
                Status = request.Status
            };

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetActivities), new { tripPlanId }, ToDto(activity));
        }

        // PUT: api/tripplan/{tripPlanId}/activity/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateActivity(Guid tripPlanId, Guid id, CreateActivityDto request)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripPlanId == tripPlanId);

            if (activity == null) return NotFound();

            activity.Date = request.Date;
            activity.Name = request.Name;
            activity.Time = request.Time;
            activity.Location = request.Location;
            activity.Description = request.Description;
            activity.EstimatedCost = request.EstimatedCost;
            activity.Status = request.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tripplan/{tripPlanId}/activity/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(Guid tripPlanId, Guid id)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripPlanId == tripPlanId);

            if (activity == null) return NotFound();

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
