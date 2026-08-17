using System;
using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.DTOs
{
    public class CreateActivityDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public TimeSpan? Time { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public string? Description { get; set; }

        public decimal EstimatedCost { get; set; }

        public Models.ActivityStatus Status { get; set; } = Models.ActivityStatus.Planirano;
    }
}
