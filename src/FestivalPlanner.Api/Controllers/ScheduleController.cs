using Microsoft.AspNetCore.Mvc;
using FestivalPlanner.Api.Services;
using FestivalPlanner.Api.Models;

namespace FestivalPlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public ScheduleController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpGet("user/{userId}")]
    public ActionResult<UserSchedule> GetUserSchedule(string userId)
    {
        return Ok(_scheduleService.GetUserSchedule(userId));
    }

    [HttpPost("user")]
    public ActionResult AddToSchedule([FromBody] AddToScheduleRequest request)
    {
        var result = _scheduleService.AddToUserSchedule(request.UserId, request.ArtistName, request.Date);
        if (!result)
            return BadRequest("Could not add artist to schedule");
        return Ok();
    }

    [HttpDelete("user")]
    public ActionResult RemoveFromSchedule([FromBody] RemoveFromScheduleRequest request)
    {
        var result = _scheduleService.RemoveFromUserSchedule(request.UserId, request.ArtistName, request.Date);
        if (!result)
            return NotFound();
        return Ok();
    }

    [HttpGet("priorities/{userId}")]
    public ActionResult<UserPriorities> GetPriorities(string userId)
    {
        return Ok(_scheduleService.GetUserPriorities(userId));
    }

    [HttpPost("priorities")]
    public ActionResult SetPriority([FromBody] SetPriorityRequest request)
    {
        var result = _scheduleService.SetArtistPriority(request.UserId, request.ArtistName, request.Date, request.Priority);
        if (!result)
            return BadRequest();
        return Ok();
    }

    [HttpGet("conflicts/{userId}")]
    public ActionResult<IEnumerable<ScheduleConflict>> GetConflicts(string userId)
    {
        return Ok(_scheduleService.GetScheduleConflicts(userId));
    }

    [HttpGet("gaps/{userId}")]
    public ActionResult<IEnumerable<DiscoveryGap>> GetGaps(string userId)
    {
        return Ok(_scheduleService.GetDiscoveryGaps(userId));
    }

    [HttpGet("stats/{userId}")]
    public ActionResult<ScheduleStats> GetStats(string userId)
    {
        return Ok(_scheduleService.GetScheduleStats(userId));
    }
}
