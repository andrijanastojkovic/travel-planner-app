using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.Models
{
    public class TripPlan
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public decimal Budget { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Destination> Destinations { get; set; } = new();
        public List<DayActivity> Activities { get; set; } = new();
        public List<ChecklistItem> ChecklistItems { get; set; } = new();
        public List<ShareToken> ShareTokens { get; set; } = new();
    }
}
