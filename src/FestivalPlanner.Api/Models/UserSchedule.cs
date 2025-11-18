namespace FestivalPlanner.Api.Models;

public class UserSchedule
{
    public string UserId { get; set; } = string.Empty;
    public List<ScheduledArtist> Artists { get; set; } = new();
}

public class ScheduledArtist
{
    public string Name { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
}

public class AddToScheduleRequest
{
    public string UserId { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}

public class RemoveFromScheduleRequest
{
    public string UserId { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}
