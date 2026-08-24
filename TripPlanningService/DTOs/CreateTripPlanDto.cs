using System;
using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.DTOs
{
    public class CreateTripPlanDto
    {
        public Guid? TargetUserId { get; set; }

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
    }
}
