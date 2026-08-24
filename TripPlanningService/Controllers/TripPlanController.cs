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
using System.Net.Http;
using Microsoft.Extensions.Configuration;

namespace TripPlanningService.Controllers
{
    [ApiController]
    [Route("api/tripplans")]
    [Authorize]
    public class TripPlanController : ControllerBase
    {
        private readonly TripPlanningDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TripPlanController(TripPlanningDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(userIdClaim);
        }

        // GET: api/TripPlan
        [HttpGet]
        public async Task<ActionResult> GetMyTripPlans()
        {
            var userId = GetUserId();

            var plans = await _context.TripPlans
                .Where(t => t.UserId == userId)
                .Select(t => new TripPlanDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    Name = t.Name,
                    Description = t.Description,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Budget = t.Budget,
                    Notes = t.Notes,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(plans);
        }

        // GET: api/TripPlan/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> GetTripPlan(Guid id)
        {
            var userId = GetUserId();

            var plan = await _context.TripPlans
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .Include(t => t.ChecklistItems)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (plan == null)
                return NotFound();

            if (plan.UserId != userId)
                return Forbid();

            return Ok(plan);
        }

        // POST: api/TripPlan
        [HttpPost]
        public async Task<ActionResult> CreateTripPlan(CreateTripPlanDto request)
        {
            if (request.EndDate < request.StartDate)
                return BadRequest(new { message = "Krajnji datum ne može biti pre početnog datuma." });

            if (request.Budget < 0)
                return BadRequest(new { message = "Budžet ne može imati negativnu vrednost." });

            var userId = GetUserId();

            var plan = new TripPlan
            {
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Budget = request.Budget,
                Notes = request.Notes
            };

            _context.TripPlans.Add(plan);
            await _context.SaveChangesAsync();

            var dto = new TripPlanDto
            {
                Id = plan.Id,
                UserId = plan.UserId,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                Notes = plan.Notes,
                CreatedAt = plan.CreatedAt
            };

            return CreatedAtAction(nameof(GetTripPlan), new { id = plan.Id }, dto);
        }

        // PUT: api/TripPlan/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTripPlan(Guid id, CreateTripPlanDto request)
        {
            if (request.EndDate < request.StartDate)
                return BadRequest(new { message = "Krajnji datum ne može biti pre početnog datuma." });

            if (request.Budget < 0)
                return BadRequest(new { message = "Budžet ne može imati negativnu vrednost." });

            var userId = GetUserId();
            var plan = await _context.TripPlans.FindAsync(id);

            if (plan == null)
                return NotFound();

            if (plan.UserId != userId)
                return Forbid();

            plan.Name = request.Name;
            plan.Description = request.Description;
            plan.StartDate = request.StartDate;
            plan.EndDate = request.EndDate;
            plan.Budget = request.Budget;
            plan.Notes = request.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TripPlan/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTripPlan(Guid id)
        {
            var userId = GetUserId();
            var plan = await _context.TripPlans.FindAsync(id);

            if (plan == null)
                return NotFound();

            if (plan.UserId != userId)
                return Forbid();

            try
            {
                var expenseServiceUrl = _configuration["ExternalServices:ExpenseServiceUrl"];
                var client = _httpClientFactory.CreateClient();
                await client.DeleteAsync($"{expenseServiceUrl}/api/tripplans/{id}/expenses/all");
            }
            catch
            {
                // Ako ExpenseService nije dostupan, nastavljamo sa brisanjem plana.
            }

            _context.TripPlans.Remove(plan);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
