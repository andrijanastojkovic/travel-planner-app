using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseService.Data;
using ExpenseService.DTOs;
using ExpenseService.Models;

namespace ExpenseService.Controllers
{
    [ApiController]
    [Route("api/tripplan/{tripPlanId}/[controller]")]
    [Authorize]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public ExpenseController(ExpenseDbContext context)
        {
            _context = context;
        }

        private static ExpenseDto ToDto(Expense e) => new ExpenseDto
        {
            Id = e.Id,
            TripPlanId = e.TripPlanId,
            Name = e.Name,
            Category = e.Category.ToString(),
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description
        };

        // GET: api/tripplan/{tripPlanId}/expense
        [HttpGet]
        public async Task<ActionResult> GetExpenses(Guid tripPlanId)
        {
            var expenses = await _context.Expenses
                .Where(e => e.TripPlanId == tripPlanId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Ok(expenses.Select(ToDto));
        }

        // GET: api/tripplan/{tripPlanId}/expense/summary
        [HttpGet("summary")]
        public async Task<ActionResult<BudgetSummaryDto>> GetSummary(Guid tripPlanId)
        {
            var expenses = await _context.Expenses
                .Where(e => e.TripPlanId == tripPlanId)
                .ToListAsync();

            var summary = new BudgetSummaryDto
            {
                TotalSpent = expenses.Sum(e => e.Amount),
                ExpenseCount = expenses.Count
            };

            return Ok(summary);
        }

        // POST: api/tripplan/{tripPlanId}/expense
        [HttpPost]
        public async Task<ActionResult> CreateExpense(Guid tripPlanId, CreateExpenseDto request)
        {
            if (request.Amount < 0)
                return BadRequest(new { message = "Iznos troška ne može biti negativan." });

            var expense = new Expense
            {
                TripPlanId = tripPlanId,
                Name = request.Name,
                Category = request.Category,
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpenses), new { tripPlanId }, ToDto(expense));
        }

        // PUT: api/tripplan/{tripPlanId}/expense/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateExpense(Guid tripPlanId, Guid id, CreateExpenseDto request)
        {
            if (request.Amount < 0)
                return BadRequest(new { message = "Iznos troška ne može biti negativan." });

            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.TripPlanId == tripPlanId);

            if (expense == null) return NotFound();

            expense.Name = request.Name;
            expense.Category = request.Category;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.Description = request.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tripplan/{tripPlanId}/expense/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(Guid tripPlanId, Guid id)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.TripPlanId == tripPlanId);

            if (expense == null) return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}