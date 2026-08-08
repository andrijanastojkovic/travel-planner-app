using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseService.Models
{
    public enum ExpenseCategory
    {
        Prevoz,
        Smestaj,
        Hrana,
        Ulaznice,
        Kupovina,
        Ostalo
    }

    public class Expense
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripPlanId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public ExpenseCategory Category { get; set; } = ExpenseCategory.Ostalo;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string Description { get; set; }
    }
}
