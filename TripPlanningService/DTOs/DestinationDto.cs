using System;

namespace TripPlanningService.DTOs
{
    public class DestinationDto
    {
        public Guid Id { get; set; }
        public Guid TripPlanId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; }
    }
}
