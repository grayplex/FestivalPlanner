namespace FestivalPlanner.Api.Models;

public class ArtistPriority
{
    public string UserId { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Priority { get; set; } = "normal"; // normal, scheduled, dimmed
}

public class SetPriorityRequest
{
    public string UserId { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Priority { get; set; } = "normal";
}

public class UserPriorities
{
    public string UserId { get; set; } = string.Empty;
    public Dictionary<string, string> Priorities { get; set; } = new(); // key: "artistName-date", value: priority
}
