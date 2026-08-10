using System;

namespace TripPlanningService.DTOs
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public Guid TripPlanId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public TimeSpan? Time { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public decimal EstimatedCost { get; set; }
        public string Status { get; set; }
    }
}
