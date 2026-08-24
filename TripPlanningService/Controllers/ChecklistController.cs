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
    [Route("api/tripplans/{tripPlanId}/checklist-items")]
    [Authorize]
    public class ChecklistController : ControllerBase
    {
        private readonly TripPlanningDbContext _context;

        public ChecklistController(TripPlanningDbContext context)
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
            if (plan == null)
                return null;
            if (plan.UserId != userId && !User.IsInRole("Admin"))
                return null;
            return plan;
        }

        private static ChecklistItemDto ToDto(ChecklistItem c) => new ChecklistItemDto
        {
            Id = c.Id,
            TripPlanId = c.TripPlanId,
            Name = c.Name,
            IsDone = c.IsDone
        };

        // GET: api/tripplan/{tripPlanId}/checklist
        [HttpGet]
        public async Task<ActionResult> GetChecklistItems(Guid tripPlanId)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var items = await _context.ChecklistItems
                .Where(c => c.TripPlanId == tripPlanId)
                .ToListAsync();

            return Ok(items.Select(ToDto));
        }

        // POST: api/tripplan/{tripPlanId}/checklist
        [HttpPost]
        public async Task<ActionResult> CreateChecklistItem(Guid tripPlanId, CreateChecklistItemDto request)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var item = new ChecklistItem
            {
                TripPlanId = tripPlanId,
                Name = request.Name,
                IsDone = false
            };

            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChecklistItems), new { tripPlanId }, ToDto(item));
        }

        // PUT: api/tripplan/{tripPlanId}/checklist/{id}/toggle
        [HttpPut("{id}/toggle")]
        public async Task<ActionResult> ToggleChecklistItem(Guid tripPlanId, Guid id)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var item = await _context.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == id && c.TripPlanId == tripPlanId);

            if (item == null) return NotFound();

            item.IsDone = !item.IsDone;
            await _context.SaveChangesAsync();

            return Ok(ToDto(item));
        }

        // DELETE: api/tripplan/{tripPlanId}/checklist/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChecklistItem(Guid tripPlanId, Guid id)
        {
            var plan = await GetOwnedTripPlanOrNull(tripPlanId);
            if (plan == null) return NotFound();

            var item = await _context.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == id && c.TripPlanId == tripPlanId);

            if (item == null) return NotFound();

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
