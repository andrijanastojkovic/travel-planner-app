using System;
using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.DTOs
{
    public class CreateDestinationDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }

        public string Description { get; set; }
    }
}
