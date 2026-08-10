using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseService.DTOs
{
    public class CreateExpenseDto
    {
        [Required]
        public Guid TripPlanId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public Models.ExpenseCategory Category { get; set; } = Models.ExpenseCategory.Ostalo;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string Description { get; set; }
    }
}
