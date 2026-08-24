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
    [Route("api")]
    public class ShareController : ControllerBase
    {
        private readonly TripPlanningDbContext _context;

        public ShareController(TripPlanningDbContext context)
        {
            _context = context;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(userIdClaim);
        }

        // POST: api/tripplan/{tripPlanId}/share  (vlasnik generiše link)
        [HttpPost("tripplans/{tripPlanId}/share")]
        [Authorize]
        public async Task<ActionResult> CreateShareToken(Guid tripPlanId, CreateShareTokenDto request)
        {
            var userId = GetUserId();
            var plan = await _context.TripPlans.FindAsync(tripPlanId);

            if (plan == null) return NotFound();
            if (plan.UserId != userId) return Forbid();

            var shareToken = new ShareToken
            {
                TripPlanId = tripPlanId,
                AccessType = request.AccessType
            };

            _context.ShareTokens.Add(shareToken);
            await _context.SaveChangesAsync();

            var dto = new ShareTokenDto
            {
                Id = shareToken.Id,
                TripPlanId = shareToken.TripPlanId,
                Token = shareToken.Token,
                AccessType = shareToken.AccessType.ToString(),
                ExpiresAt = shareToken.ExpiresAt
            };

            return Ok(dto);
        }

        // GET: api/share/{token}  (javan pristup preko linka, bez auth-a)
        [HttpGet("share/{token}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetSharedTripPlan(string token)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(s => s.Token == token);

            if (shareToken == null)
                return NotFound(new { message = "Link za deljenje ne postoji." });

            if (shareToken.ExpiresAt < DateTime.UtcNow)
                return BadRequest(new { message = "Link za deljenje je istekao." });

            var plan = await _context.TripPlans
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .Include(t => t.ChecklistItems)
                .FirstOrDefaultAsync(t => t.Id == shareToken.TripPlanId);

            if (plan == null) return NotFound();

            var dto = new SharedTripPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                Notes = plan.Notes,
                AccessType = shareToken.AccessType.ToString(),
                Destinations = plan.Destinations.Select(d => new DestinationDto
                {
                    Id = d.Id,
                    TripPlanId = d.TripPlanId,
                    Name = d.Name,
                    Location = d.Location,
                    ArrivalDate = d.ArrivalDate,
                    DepartureDate = d.DepartureDate,
                    Description = d.Description
                }).ToList(),
                Activities = plan.Activities.Select(a => new ActivityDto
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
                }).ToList(),
                ChecklistItems = plan.ChecklistItems.Select(c => new ChecklistItemDto
                {
                    Id = c.Id,
                    TripPlanId = c.TripPlanId,
                    Name = c.Name,
                    IsDone = c.IsDone
                }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/share/{token}/tripplan/{tripPlanId}/destinations
        [HttpPost("share/{token}/tripplan/{tripPlanId}/destinations")]
        [AllowAnonymous]
        public async Task<ActionResult> CreateDestinationViaShare(string token, Guid tripPlanId, CreateDestinationDto request)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

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

            return Ok(new DestinationDto
            {
                Id = destination.Id,
                TripPlanId = destination.TripPlanId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description
            });
        }

        // DELETE: api/share/{token}/tripplan/{tripPlanId}/destinations/{id}
        [HttpDelete("share/{token}/tripplan/{tripPlanId}/destinations/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult> DeleteDestinationViaShare(string token, Guid tripPlanId, Guid id)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

            var destination = await _context.Destinations
                .FirstOrDefaultAsync(d => d.Id == id && d.TripPlanId == tripPlanId);
            if (destination == null) return NotFound();

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/share/{token}/tripplan/{tripPlanId}/activities
        [HttpPost("share/{token}/tripplan/{tripPlanId}/activities")]
        [AllowAnonymous]
        public async Task<ActionResult> CreateActivityViaShare(string token, Guid tripPlanId, CreateActivityDto request)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

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

            return Ok(new ActivityDto
            {
                Id = activity.Id,
                TripPlanId = activity.TripPlanId,
                Date = activity.Date,
                Name = activity.Name,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status.ToString()
            });
        }

        // DELETE: api/share/{token}/tripplan/{tripPlanId}/activities/{id}
        [HttpDelete("share/{token}/tripplan/{tripPlanId}/activities/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult> DeleteActivityViaShare(string token, Guid tripPlanId, Guid id)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.Id == id && a.TripPlanId == tripPlanId);
            if (activity == null) return NotFound();

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/share/{token}/tripplan/{tripPlanId}/checklist
        [HttpPost("share/{token}/tripplan/{tripPlanId}/checklist")]
        [AllowAnonymous]
        public async Task<ActionResult> CreateChecklistItemViaShare(string token, Guid tripPlanId, CreateChecklistItemDto request)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

            var item = new ChecklistItem
            {
                TripPlanId = tripPlanId,
                Name = request.Name,
                IsDone = false
            };

            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new ChecklistItemDto { Id = item.Id, TripPlanId = item.TripPlanId, Name = item.Name, IsDone = item.IsDone });
        }

        // PUT: api/share/{token}/tripplan/{tripPlanId}/checklist/{id}/toggle
        [HttpPut("share/{token}/tripplan/{tripPlanId}/checklist/{id}/toggle")]
        [AllowAnonymous]
        public async Task<ActionResult> ToggleChecklistItemViaShare(string token, Guid tripPlanId, Guid id)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

            var item = await _context.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == id && c.TripPlanId == tripPlanId);
            if (item == null) return NotFound();

            item.IsDone = !item.IsDone;
            await _context.SaveChangesAsync();
            return Ok(new ChecklistItemDto { Id = item.Id, TripPlanId = item.TripPlanId, Name = item.Name, IsDone = item.IsDone });
        }

        // DELETE: api/share/{token}/tripplan/{tripPlanId}/checklist/{id}
        [HttpDelete("share/{token}/tripplan/{tripPlanId}/checklist/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult> DeleteChecklistItemViaShare(string token, Guid tripPlanId, Guid id)
        {
            var valid = await ValidateEditTokenOrNull(token, tripPlanId);
            if (valid == null) return Forbid();

            var item = await _context.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == id && c.TripPlanId == tripPlanId);
            if (item == null) return NotFound();

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<ShareToken> ValidateEditTokenOrNull(string token, Guid tripPlanId)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(s => s.Token == token && s.TripPlanId == tripPlanId);

            if (shareToken == null) return null;
            if (shareToken.ExpiresAt < DateTime.UtcNow) return null;
            if (shareToken.AccessType != AccessType.EDIT) return null;

            return shareToken;
        }
    }
}
