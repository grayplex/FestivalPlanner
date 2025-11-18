namespace FestivalPlanner.Api.Models;

public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
}

public class ArtistDto
{
    public string Name { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
}
