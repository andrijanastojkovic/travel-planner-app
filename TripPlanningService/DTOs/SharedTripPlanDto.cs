using System;
using System.Collections.Generic;

namespace TripPlanningService.DTOs
{
    public class SharedTripPlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; }
        public string AccessType { get; set; }
        public List<DestinationDto> Destinations { get; set; } = new();
        public List<ActivityDto> Activities { get; set; } = new();
        public List<ChecklistItemDto> ChecklistItems { get; set; } = new();
    }
}
