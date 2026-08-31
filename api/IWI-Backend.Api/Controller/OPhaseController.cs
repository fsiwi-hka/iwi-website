using System.Text.Json;
using IWI_Backend.Api.Models;
using IWI_Backend.Api.Services;
using IWI_Backend.Api.Services.OPhase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/ophase")]
public class OPhaseController(
    ILogger<OPhaseController> logger, 
    IOptions<OPhaseOptions> opt,
    OPhaseSyncService syncService
    ) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<OPhaseInfoDto>> OPhaseInfos(CancellationToken ct)
    {
        var infos = await syncService.ReadOptionsFileAsync(ct);
        return Ok(infos);
    }

    [HttpGet("timetable")]
    public async Task<IActionResult> OPhaseTimetable([FromQuery] string course)
    {

        var cacheDir = opt.Value.CacheDirectory;
        
        var full = Path.GetFullPath(Path.Combine(cacheDir, $"timetable-{course.ToLowerInvariant()}.png"));
        var root = Path.GetFullPath(cacheDir) + Path.DirectorySeparatorChar;

        if (!full.StartsWith(root, StringComparison.Ordinal) || !System.IO.File.Exists(full))
            return NotFound();

        const string contentType = "application/octet-stream";

        Response.Headers.CacheControl = "public, max-age=31536000, immutable";
        return PhysicalFile(full, "image/png", enableRangeProcessing: true);
    }

    [HttpGet("refresh")]
    public async Task<IActionResult> RefreshOPhaseCache()
    {
        await syncService.SyncAsync(HttpContext.RequestAborted).ContinueWith(t =>
        {
            if (t.IsFaulted)
            {
                logger.LogError(t.Exception, "O-Phase Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }, TaskScheduler.Default);
        
        return Ok();
    }


}

public sealed class OPhaseOptions
{
    public string BaseUrl { get; set; } = "";
    public int SyncIntervalMinutes { get; set; } = 60 * 24;
    public string CacheDirectory { get; set; } = "cache/ophase";
}