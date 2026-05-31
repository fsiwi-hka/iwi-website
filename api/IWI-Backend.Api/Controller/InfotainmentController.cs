using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Services;
using IwiDisplayBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/info")]
public class InfotainmentController(
    MediaStore store,
    FileExtensionContentTypeProvider contentTypes,
    MediaSyncService sync,
    IOptions<SyncOptions> options
) : ControllerBase
{

    [HttpGet]
    public ActionResult<IList<SlideDto>> GetSlides() =>
        store.Slides.ToList();

    [HttpGet("{name}")]
    public ActionResult<SlideDto> GetSlide(string name)
    {
        if (name.Contains('/') || name.Contains('\\') || name.Contains("..") || Path.IsPathRooted(name))
            return BadRequest();

        var full = Path.GetFullPath(Path.Combine(store.CacheDirectory, name));
        var root = store.CacheDirectory + Path.DirectorySeparatorChar;
        if (!full.StartsWith(root, StringComparison.Ordinal) || !System.IO.File.Exists(full))
            return NotFound();

        if (!contentTypes.TryGetContentType(full, out var contentType))
            contentType = "application/octet-stream";

        return PhysicalFile(full, contentType, enableRangeProcessing: true);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        var token = options.Value.RefreshToken;
        if (!string.IsNullOrEmpty(token) &&
            Request.Headers["X-Refresh-Token"].ToString() != token)
        {
            return Unauthorized();
        }

        await sync.SyncAsync(ct);
        return Ok(new { status = "synced" });
    }

}