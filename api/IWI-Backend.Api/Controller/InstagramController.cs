using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using IWI_Backend.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/insta")]
public class InstagramController(
    InstagramStore store,
    InstagramSyncService sync,
    FileExtensionContentTypeProvider contentTypes,
    IOptions<SyncOptions> options
) : ControllerBase
{

    [HttpGet("insta-posts")]
    public ActionResult<InstagramFeedDto> GetInstagramPosts([FromQuery] int limit = 5)
    {
        var feed = store.Feed;
        return feed with { Data = feed.Data.Take(Math.Max(0, limit)).ToList() };
    }
    
    [HttpGet("insta-media/{name}")]
    public ActionResult GetInstagramMedia(string name)
    {
        if (name.Contains('/') || name.Contains('\\') || name.Contains("..") || Path.IsPathRooted(name))
            return BadRequest();

        var full = Path.GetFullPath(Path.Combine(store.CacheDirectory, name));
        var root = store.CacheDirectory + Path.DirectorySeparatorChar;
        if (!full.StartsWith(root, StringComparison.Ordinal) || !System.IO.File.Exists(full))
            return NotFound();

        if (!contentTypes.TryGetContentType(full, out var contentType))
            contentType = "application/octet-stream";

        Response.Headers.CacheControl = "public, max-age=31536000, immutable";
        return PhysicalFile(full, contentType, enableRangeProcessing: true);
    }

    [Authorize]
    [HttpGet("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        var token = options.Value.RefreshToken;
        if (!string.IsNullOrEmpty(token) &&
            Request.Headers["X-Refresh-Token"].ToString() != token)
        {
            return Unauthorized();
        }

        await sync.SyncAsync(ct);
        return Ok(new { status = "synced", posts = store.Feed.Data.Count, lastSync = store.LastSync });
    }

}
