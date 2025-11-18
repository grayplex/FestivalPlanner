namespace FestivalPlanner.Api.Models;

public class ScheduleConflict
{
    public string Date { get; set; } = string.Empty;
    public string TimeSlot { get; set; } = string.Empty;
    public List<string> ConflictingArtists { get; set; } = new();
}

public class DiscoveryGap
{
    public string Date { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
}

public class ScheduleStats
{
    public int TotalScheduled { get; set; }
    public int Day1Count { get; set; }
    public int Day2Count { get; set; }
    public int Day3Count { get; set; }
    public int ConflictCount { get; set; }
    public int GapCount { get; set; }
}
