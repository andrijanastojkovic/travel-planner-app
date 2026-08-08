using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TripPlanningService.Models
{
    public enum AccessType
    {
        VIEW,
        EDIT
    }

    public class ShareToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripPlanId { get; set; }

        [ForeignKey(nameof(TripPlanId))]
        public TripPlan TripPlan { get; set; }

        [Required]
        public string Token { get; set; } = Guid.NewGuid().ToString("N");

        public AccessType AccessType { get; set; } = AccessType.VIEW;

        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);
    }
}
