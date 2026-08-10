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
        [HttpPost("tripplan/{tripPlanId}/share")]
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
    }
}
