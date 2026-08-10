using System;
using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.DTOs
{
    public class CreateTripPlanDto
    {
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
