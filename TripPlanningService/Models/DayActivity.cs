using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TripPlanningService.Models
{
    public enum ActivityStatus
    {
        Planirano,
        Rezervisano,
        Zavrseno,
        Otkazano
    }

    public class DayActivity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripPlanId { get; set; }

        [ForeignKey(nameof(TripPlanId))]
        public TripPlan TripPlan { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public TimeSpan? Time { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public string Description { get; set; }

        public decimal EstimatedCost { get; set; }

        public ActivityStatus Status { get; set; } = ActivityStatus.Planirano;
    }
}
