using FestivalPlanner.Api.Models;
using FestivalPlanner.Api.Data;

namespace FestivalPlanner.Api.Services;

public class ScheduleService : IScheduleService
{
    private readonly List<Artist> _artists;
    private readonly List<string> _stages;
    private readonly List<string> _timeSlots;
    private readonly Dictionary<string, UserSchedule> _userSchedules = new();
    private readonly Dictionary<string, UserPriorities> _userPriorities = new();

    public ScheduleService()
    {
        _artists = SeedData.GetArtists();
        _stages = SeedData.GetStages();
        _timeSlots = SeedData.GetTimeSlots();
    }

    public IEnumerable<Artist> GetAllArtists() => _artists;

    public IEnumerable<Artist> GetArtistsByDate(string date) =>
        _artists.Where(a => a.Date == date);

    public Artist? GetArtistByName(string name, string date) =>
        _artists.FirstOrDefault(a => a.Name == name && a.Date == date);

    public IEnumerable<string> GetStages() => _stages;

    public IEnumerable<string> GetTimeSlots() => _timeSlots;

    public UserSchedule GetUserSchedule(string userId)
    {
        if (!_userSchedules.ContainsKey(userId))
        {
            _userSchedules[userId] = new UserSchedule { UserId = userId };
        }
        return _userSchedules[userId];
    }

    public bool AddToUserSchedule(string userId, string artistName, string date)
    {
        var artist = GetArtistByName(artistName, date);
        if (artist == null) return false;

        var userSchedule = GetUserSchedule(userId);

        // Check if already in schedule
        if (userSchedule.Artists.Any(a => a.Name == artistName && a.Date == date))
            return false;

        userSchedule.Artists.Add(new ScheduledArtist
        {
            Name = artist.Name,
            Date = artist.Date,
            StartTime = artist.StartTime,
            EndTime = artist.EndTime,
            Stage = artist.Stage
        });

        // Auto-set priority to scheduled
        SetArtistPriority(userId, artistName, date, "scheduled");

        return true;
    }

    public bool RemoveFromUserSchedule(string userId, string artistName, string date)
    {
        if (!_userSchedules.ContainsKey(userId)) return false;

        var userSchedule = _userSchedules[userId];
        var artist = userSchedule.Artists.FirstOrDefault(a => a.Name == artistName && a.Date == date);

        if (artist == null) return false;

        userSchedule.Artists.Remove(artist);

        // Reset priority to normal
        SetArtistPriority(userId, artistName, date, "normal");

        return true;
    }

    public UserPriorities GetUserPriorities(string userId)
    {
        if (!_userPriorities.ContainsKey(userId))
        {
            _userPriorities[userId] = new UserPriorities { UserId = userId };
        }
        return _userPriorities[userId];
    }

    public bool SetArtistPriority(string userId, string artistName, string date, string priority)
    {
        var userPriorities = GetUserPriorities(userId);
        var key = $"{artistName}-{date}";
        userPriorities.Priorities[key] = priority;
        return true;
    }

    public IEnumerable<ScheduleConflict> GetScheduleConflicts(string userId)
    {
        var userSchedule = GetUserSchedule(userId);
        var conflicts = new List<ScheduleConflict>();

        var artistsByDate = userSchedule.Artists.GroupBy(a => a.Date);

        foreach (var dayGroup in artistsByDate)
        {
            var artists = dayGroup.OrderBy(a => a.StartTime).ToList();

            for (int i = 0; i < artists.Count; i++)
            {
                for (int j = i + 1; j < artists.Count; j++)
                {
                    if (TimesOverlap(artists[i].StartTime, artists[i].EndTime,
                                     artists[j].StartTime, artists[j].EndTime))
                    {
                        conflicts.Add(new ScheduleConflict
                        {
                            Date = dayGroup.Key,
                            TimeSlot = artists[i].StartTime,
                            ConflictingArtists = new List<string> { artists[i].Name, artists[j].Name }
                        });
                    }
                }
            }
        }

        return conflicts;
    }

    public IEnumerable<DiscoveryGap> GetDiscoveryGaps(string userId)
    {
        var userSchedule = GetUserSchedule(userId);
        var gaps = new List<DiscoveryGap>();

        var artistsByDate = userSchedule.Artists.GroupBy(a => a.Date);

        foreach (var dayGroup in artistsByDate)
        {
            var artists = dayGroup.OrderBy(a => a.StartTime).ToList();

            for (int i = 0; i < artists.Count - 1; i++)
            {
                var endTime = TimeSpan.Parse(artists[i].EndTime == "00:00" ? "24:00" : artists[i].EndTime);
                var nextStartTime = TimeSpan.Parse(artists[i + 1].StartTime);

                var gapMinutes = (int)(nextStartTime - endTime).TotalMinutes;

                if (gapMinutes >= 30)
                {
                    gaps.Add(new DiscoveryGap
                    {
                        Date = dayGroup.Key,
                        StartTime = artists[i].EndTime,
                        EndTime = artists[i + 1].StartTime,
                        DurationMinutes = gapMinutes
                    });
                }
            }
        }

        return gaps;
    }

    public ScheduleStats GetScheduleStats(string userId)
    {
        var userSchedule = GetUserSchedule(userId);
        var conflicts = GetScheduleConflicts(userId);
        var gaps = GetDiscoveryGaps(userId);

        return new ScheduleStats
        {
            TotalScheduled = userSchedule.Artists.Count,
            Day1Count = userSchedule.Artists.Count(a => a.Date == "2025-08-29"),
            Day2Count = userSchedule.Artists.Count(a => a.Date == "2025-08-30"),
            Day3Count = userSchedule.Artists.Count(a => a.Date == "2025-08-31"),
            ConflictCount = conflicts.Count(),
            GapCount = gaps.Count()
        };
    }

    private bool TimesOverlap(string start1, string end1, string start2, string end2)
    {
        var s1 = TimeSpan.Parse(start1);
        var e1 = TimeSpan.Parse(end1 == "00:00" ? "24:00" : end1);
        var s2 = TimeSpan.Parse(start2);
        var e2 = TimeSpan.Parse(end2 == "00:00" ? "24:00" : end2);

        return s1 < e2 && s2 < e1;
    }
}
