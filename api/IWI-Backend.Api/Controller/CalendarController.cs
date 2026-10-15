using System.Globalization;
using System.Text;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using IWI_Backend.Api.Services.Calendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/calendar")]
public class CalendarController(
    ILogger<CalendarController> logger,
    IOptions<CalendarOptions> opt,
    CalendarStore store,
    CalendarSyncService syncService
) : ControllerBase
{
    private const string IcsContentType = "text/calendar; charset=utf-8";

    /// <summary>Termine, die den Zeitraum [from, to) überschneiden. Ohne Parameter alle gecachten.</summary>
    [HttpGet("events")]
    public ActionResult<IEnumerable<CalendarEventDto>> Events([FromQuery] string? from, [FromQuery] string? to)
    {
        DateTime? fromUtc = null, toUtc = null;
        if (from != null)
        {
            if (!TryParseDate(from, out var d)) return BadRequest("from muss das Format yyyy-MM-dd haben.");
            fromUtc = d;
        }
        if (to != null)
        {
            if (!TryParseDate(to, out var d)) return BadRequest("to muss das Format yyyy-MM-dd haben.");
            toUtc = d;
        }
        if (fromUtc > toUtc) return BadRequest("from darf nicht nach to liegen.");

        var events = store.Events
            .Where(e => (fromUtc == null || e.EndUtc > fromUtc) && (toUtc == null || e.StartUtc < toUtc));

        Response.Headers.CacheControl = "public, max-age=300";
        return Ok(events);
    }

    [HttpGet("events/{id}.ics")]
    public IActionResult EventIcs(string id)
    {
        var ev = store.Find(id);
        if (ev == null) return NotFound();

        var ics = CalendarProcessor.BuildSingleEventIcs(ev, store.TimeZone, opt.Value.CalendarName);
        return File(Encoding.UTF8.GetBytes(ics), IcsContentType, $"{SafeFileName(ev.Title)}.ics");
    }

    /// <summary>Gefilterter Kalender zum Abonnieren.</summary>
    [HttpGet("/api/calendar.ics")]
    public IActionResult CalendarIcs()
    {
        var ics = store.Ics;
        if (ics == null) return NotFound();

        Response.Headers.CacheControl = "public, max-age=300";
        return Content(ics, IcsContentType);
    }

    [Authorize]
    [HttpGet("refresh")]
    public async Task<IActionResult> Refresh()
    {
        try
        {
            await syncService.SyncAsync(HttpContext.RequestAborted);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogError(ex, "Kalender-Sync fehlgeschlagen - behalte vorhandenen Cache.");
            return StatusCode(StatusCodes.Status502BadGateway, "Kalender-Sync fehlgeschlagen.");
        }

        return Ok(new { lastSync = store.LastSync, events = store.Events.Count });
    }

    private bool TryParseDate(string s, out DateTime utc)
    {
        utc = default;
        if (!DateOnly.TryParseExact(s, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d))
            return false;
        utc = TimeZoneInfo.ConvertTimeToUtc(d.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), store.TimeZone);
        return true;
    }

    private static string SafeFileName(string title)
    {
        var invalid = Path.GetInvalidFileNameChars().Append('"').ToHashSet();
        var cleaned = new string(title.Select(c => invalid.Contains(c) ? '_' : c).ToArray()).Trim();
        return string.IsNullOrEmpty(cleaned) ? "termin" : cleaned;
    }
}
