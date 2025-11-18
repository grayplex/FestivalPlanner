using Microsoft.AspNetCore.Mvc;
using FestivalPlanner.Api.Services;
using FestivalPlanner.Api.Models;

namespace FestivalPlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public ArtistsController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Artist>> GetAllArtists()
    {
        return Ok(_scheduleService.GetAllArtists());
    }

    [HttpGet("by-date/{date}")]
    public ActionResult<IEnumerable<Artist>> GetArtistsByDate(string date)
    {
        return Ok(_scheduleService.GetArtistsByDate(date));
    }

    [HttpGet("{name}/{date}")]
    public ActionResult<Artist> GetArtist(string name, string date)
    {
        var artist = _scheduleService.GetArtistByName(name, date);
        if (artist == null)
            return NotFound();
        return Ok(artist);
    }

    [HttpGet("stages")]
    public ActionResult<IEnumerable<string>> GetStages()
    {
        return Ok(_scheduleService.GetStages());
    }

    [HttpGet("timeslots")]
    public ActionResult<IEnumerable<string>> GetTimeSlots()
    {
        return Ok(_scheduleService.GetTimeSlots());
    }
}
