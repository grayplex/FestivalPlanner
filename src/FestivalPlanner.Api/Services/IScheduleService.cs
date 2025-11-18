using FestivalPlanner.Api.Models;

namespace FestivalPlanner.Api.Services;

public interface IScheduleService
{
    // Artists
    IEnumerable<Artist> GetAllArtists();
    IEnumerable<Artist> GetArtistsByDate(string date);
    Artist? GetArtistByName(string name, string date);

    // Stages
    IEnumerable<string> GetStages();
    IEnumerable<string> GetTimeSlots();

    // User Schedule
    UserSchedule GetUserSchedule(string userId);
    bool AddToUserSchedule(string userId, string artistName, string date);
    bool RemoveFromUserSchedule(string userId, string artistName, string date);

    // Priorities
    UserPriorities GetUserPriorities(string userId);
    bool SetArtistPriority(string userId, string artistName, string date, string priority);

    // Analytics
    IEnumerable<ScheduleConflict> GetScheduleConflicts(string userId);
    IEnumerable<DiscoveryGap> GetDiscoveryGaps(string userId);
    ScheduleStats GetScheduleStats(string userId);
}
