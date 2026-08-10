using System.ComponentModel.DataAnnotations;

namespace TripPlanningService.DTOs
{
    public class CreateChecklistItemDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
    }
}
