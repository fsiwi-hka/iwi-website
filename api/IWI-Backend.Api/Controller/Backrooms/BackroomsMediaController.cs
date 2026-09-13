using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Models.Backrooms;

public sealed class MediaLibrary
{
    private static readonly HashSet<string> Folders = new(StringComparer.Ordinal)
        { "hero", "members", "sponsors", "protocols", "infoscreen", "timetables" };

    private string Root { get; }
    public long MaxBytes { get; }

    public MediaLibrary(IOptions<BackroomOptions> opts)
    {
        Root = Path.GetFullPath(Path.Combine(opts.Value.DataDirectory, "media"));
        MaxBytes = opts.Value.MaxUploadBytes;
        Directory.CreateDirectory(Root);
    }

    public static bool IsFolder(string folder) => Folders.Contains(folder);

    private static bool IsId(string id) => id.Length == 32 && id.All(char.IsAsciiLetterOrDigit);

    public string FolderPath(string folder)
    {
        var dir = Path.Combine(Root, folder);
        Directory.CreateDirectory(dir);
        return dir;
    }

    public string? Locate(string id) => IsId(id)
        ? Directory.EnumerateFiles(Root, id + "__*", SearchOption.AllDirectories).FirstOrDefault()
        : null;

    public static string SafeName(string name)
    {
        var cleaned = new string(Path.GetFileName(name)
            .Select(c => char.IsAsciiLetterOrDigit(c) || c is '.' or '-' or '_' ? c : '-')
            .ToArray());

        if (cleaned.Length == 0) return "datei";
        return cleaned.Length > 80 ? cleaned[^80..] : cleaned;
    }
}

[ApiController]
[Route("/api/backrooms/media")]
public sealed class BackroomsMediaController(
    FileExtensionContentTypeProvider contentTypes,
    MediaLibrary library

    ) : ControllerBase
{
    [Authorize]
    [HttpPost("{folder}")]
    public async Task<ActionResult<MediaRef>> Upload(
        [FromRoute] string folder, IFormFile file, CancellationToken ct)
    {
        if (!MediaLibrary.IsFolder(folder))
            return BadRequest(new { error = "unbekannter Ordner" });
        if (file is null or { Length: 0 })
            return BadRequest(new { error = "leere Datei" });
        if (file.Length > library.MaxBytes)
            return StatusCode(StatusCodes.Status413PayloadTooLarge);

        var name = MediaLibrary.SafeName(file.FileName);
        if (!contentTypes.TryGetContentType(name, out var contentType))
            return BadRequest(new { error = "unbekannte Dateiendung" });
        if (!contentType.StartsWith("image/", StringComparison.Ordinal)
            && !contentType.StartsWith("video/", StringComparison.Ordinal)
            && contentType != "application/pdf")
            return BadRequest(new { error = $"{contentType} ist nicht erlaubt" });

        var id = Guid.NewGuid().ToString("n");
        var target = Path.Combine(library.FolderPath(folder), $"{id}__{name}");
        await using (var stream = System.IO.File.Create(target))
            await file.CopyToAsync(stream, ct);

        return Ok(new MediaRef
        {
            Id = id,
            Url = $"/api/backrooms/media/{id}",
            Name = file.FileName,
            ContentType = contentType,
            Size = file.Length
        });
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public IActionResult Get([FromRoute] string id)
    {
        var path = library.Locate(id);
        if (path is null) return NotFound();

        if (!contentTypes.TryGetContentType(path, out var contentType))
            contentType = "application/octet-stream";

        return PhysicalFile(path, contentType, enableRangeProcessing: true);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Remove([FromRoute] string id)
    {
        var path = library.Locate(id);
        if (path is null) return NotFound();

        System.IO.File.Delete(path);
        return NoContent();
    }
}