using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TripPlanningService.Models
{
    public class ChecklistItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripPlanId { get; set; }

        [ForeignKey(nameof(TripPlanId))]
        public TripPlan TripPlan { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public bool IsDone { get; set; } = false;
    }
}
