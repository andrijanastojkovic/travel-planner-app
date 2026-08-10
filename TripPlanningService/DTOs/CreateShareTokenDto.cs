namespace TripPlanningService.DTOs
{
    public class CreateShareTokenDto
    {
        public Models.AccessType AccessType { get; set; } = Models.AccessType.VIEW;
    }
}
