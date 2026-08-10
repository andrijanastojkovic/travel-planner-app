using System;

namespace TripPlanningService.DTOs
{
    public class ShareTokenDto
    {
        public Guid Id { get; set; }
        public Guid TripPlanId { get; set; }
        public string Token { get; set; }
        public string AccessType { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
