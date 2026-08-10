using System;

namespace TripPlanningService.DTOs
{
    public class ChecklistItemDto
    {
        public Guid Id { get; set; }
        public Guid TripPlanId { get; set; }
        public string Name { get; set; }
        public bool IsDone { get; set; }
    }
}
