using System.Globalization;
using IWI_Backend.Api.Models.Backrooms;
using IWI_Backend.Api.Services;
using IwiDisplayBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Spiegel des Infoscreen-Ordners im WebDAV ("Information System"). Die
/// Dateien und die Config (Reihenfolge, Dauer, aktiv) bleiben dort; die
/// Backrooms lesen den gecachten Stand und schreiben direkt ins WebDAV,
/// danach wird neu synchronisiert. Id eines Slides = Dateiname.
/// </summary>
[ApiController]
[Authorize]
[Route("/api/backrooms/content/infoscreen-slides")]
public class InfoscreenSlidesController(
    MediaSyncService sync,
    MediaStore store,
    WebDavClient webdav,
    MediaLibrary library,
    FileExtensionContentTypeProvider contentTypes,
    ILogger<InfoscreenSlidesController> logger
) : ControllerBase
{
    /// <summary>Schreibzugriffe nacheinander, damit sich Config-Aenderungen nicht ueberholen.</summary>
    private static readonly SemaphoreSlim Gate = new(1, 1);

    [HttpGet]
    public ActionResult<IReadOnlyList<InfoscreenSlideDto>> List([FromQuery] bool? active) =>
        store.Config.Files
            .Select((entry, index) => ToDto(entry, index))
            .Where(dto => active is not { } flag || dto.Active == flag)
            .ToList();

    [HttpGet("{id}")]
    public ActionResult<InfoscreenSlideDto> Get(string id)
    {
        var index = store.Config.Files.FindIndex(e => Same(e.Name, id));
        return index < 0 ? NotFound() : ToDto(store.Config.Files[index], index);
    }

    [HttpPost]
    public Task<ActionResult<InfoscreenSlideDto>> Create(InfoscreenSlideUpsertDto request, CancellationToken ct) =>
        WriteAsync(async config =>
        {
            if (!WebDavFiles.IsUpload(request.Media))
                return BadRequest(new { error = "Bitte ein Bild oder Video hochladen." });
            var fileName = request.Name.Trim() + WebDavFiles.Extension(request.Media!);
            if (Check(request, fileName) is { } error) return BadRequest(new { error });
            if (config.Files.Any(e => Same(e.Name, fileName)))
                return Conflict(new { error = $"Im Infoscreen-Ordner gibt es schon \"{fileName}\"." });

            if (!await WebDavFiles.MoveUploadAsync(webdav, library, request.Media!, FileUri(fileName), ct))
                return BadRequest(new { error = "Der Upload ist nicht mehr vorhanden, bitte erneut hochladen." });

            config.Files.Add(new MediaEntry
            {
                Name = fileName,
                Duration = request.DurationSeconds,
                Active = request.Active,
                UploadDate = Today(),
            });
            return fileName;
        }, ct);

    [HttpPut("{id}")]
    public Task<ActionResult<InfoscreenSlideDto>> Update(string id, InfoscreenSlideUpsertDto request, CancellationToken ct) =>
        WriteAsync(async config =>
        {
            var entry = config.Files.FirstOrDefault(e => Same(e.Name, id));
            if (entry is null) return NotFound();

            var upload = WebDavFiles.IsUpload(request.Media);
            var fileName = request.Name.Trim()
                + (upload ? WebDavFiles.Extension(request.Media!) : Path.GetExtension(entry.Name));
            if (Check(request, fileName) is { } error) return BadRequest(new { error });
            var renamed = !string.Equals(fileName, entry.Name, StringComparison.Ordinal);
            if (renamed && config.Files.Any(e => e != entry && Same(e.Name, fileName)))
                return Conflict(new { error = $"Im Infoscreen-Ordner gibt es schon \"{fileName}\"." });

            if (upload)
            {
                // Neue Datei: hochladen, dann die alte entfernen (bei gleichem Namen ersetzt der Upload sie).
                if (!await WebDavFiles.MoveUploadAsync(webdav, library, request.Media!, FileUri(fileName), ct))
                    return BadRequest(new { error = "Der Upload ist nicht mehr vorhanden, bitte erneut hochladen." });
                if (!Same(fileName, entry.Name)) await webdav.DeleteAsync(FileUri(entry.Name), ct);
                entry.UploadDate = Today();
            }
            else if (renamed)
            {
                await webdav.MoveAsync(FileUri(entry.Name), FileUri(fileName), ct);
            }

            entry.Name = fileName;
            entry.Duration = request.DurationSeconds;
            entry.Active = request.Active;
            return fileName;
        }, ct);

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var result = await WriteAsync(async config =>
        {
            var entry = config.Files.FirstOrDefault(e => Same(e.Name, id));
            if (entry is null) return NotFound();
            await webdav.DeleteAsync(FileUri(entry.Name), ct);
            config.Files.Remove(entry);
            return (string?)null;
        }, ct);
        return result.Result!;
    }

    /// <summary>Neue Abspielreihenfolge als Liste aller Dateinamen.</summary>
    [HttpPut("order")]
    public async Task<IActionResult> Reorder(FileOrderDto request, CancellationToken ct)
    {
        var result = await WriteAsync(config =>
        {
            var byName = config.Files.ToDictionary(e => e.Name, StringComparer.OrdinalIgnoreCase);
            if (request.Ids.Count != byName.Count
                || request.Ids.Distinct(StringComparer.OrdinalIgnoreCase).Count() != byName.Count
                || request.Ids.Any(name => !byName.ContainsKey(name)))
                return Task.FromResult<ActionResult<string?>>(BadRequest(new
                {
                    error = "Die Reihenfolge muss alle Slides genau einmal enthalten. Bitte neu laden.",
                }));

            var ordered = request.Ids.Select(name => byName[name]).ToList();
            config.Files.Clear();
            config.Files.AddRange(ordered);
            return Task.FromResult<ActionResult<string?>>((string?)null);
        }, ct);
        return result.Result!;
    }

    /// <summary>
    /// Liest die aktuelle Config aus dem WebDAV, wendet die Aenderung an,
    /// schreibt sie zurueck und synchronisiert. Die Aenderung liefert den
    /// Dateinamen des Ergebnisses (oder null) bzw. eine Fehlerantwort.
    /// </summary>
    private async Task<ActionResult<InfoscreenSlideDto>> WriteAsync(
        Func<MediaConfig, Task<ActionResult<string?>>> change, CancellationToken ct)
    {
        await Gate.WaitAsync(ct);
        try
        {
            var config = await sync.ReadEffectiveRemoteConfigAsync(ct);
            var outcome = await change(config);
            if (outcome.Result is { } failed) return failed;

            await sync.WriteRemoteConfigAsync(config, ct);
            await sync.SyncAsync(ct);

            if (outcome.Value is not { } fileName) return NoContent();
            var index = store.Config.Files.FindIndex(e => Same(e.Name, fileName));
            return index < 0 ? StatusCode(StatusCodes.Status502BadGateway) : ToDto(store.Config.Files[index], index);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "WebDAV-Zugriff fuer den Infoscreen fehlgeschlagen.");
            return StatusCode(StatusCodes.Status502BadGateway,
                new { error = $"Die Nextcloud hat die Aenderung abgelehnt ({(int?)ex.StatusCode})." });
        }
        finally
        {
            Gate.Release();
        }
    }

    private static string? Check(InfoscreenSlideUpsertDto request, string fileName)
    {
        if (WebDavFiles.CheckName(request.Name.Trim()) is { } error) return error;
        if (!MediaSyncService.IsMedia(fileName)) return "Erlaubt sind Bilder (PNG, JPG, WebP, GIF, SVG, AVIF) und Videos (MP4, WebM, MOV).";
        var type = MediaSyncService.IsVideo(fileName) ? "video" : "image";
        return request.Type == type ? null : "Datei passt nicht zum Typ des Slides.";
    }

    private InfoscreenSlideDto ToDto(MediaEntry entry, int index)
    {
        var cached = new FileInfo(Path.Combine(store.CacheDirectory, entry.Name));
        if (!contentTypes.TryGetContentType(entry.Name, out var contentType))
            contentType = "application/octet-stream";
        var uploaded = DateTimeOffset.TryParseExact(entry.UploadDate, "yyyy-MM-dd", CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal, out var date) ? date : DateTimeOffset.UnixEpoch;

        return new InfoscreenSlideDto
        {
            Id = entry.Name,
            Order = index + 1,
            Name = Path.GetFileNameWithoutExtension(entry.Name),
            Type = MediaSyncService.IsVideo(entry.Name) ? "video" : "image",
            Media = new Entities.MediaRef
            {
                Url = $"/api/info/{Uri.EscapeDataString(entry.Name)}",
                Name = entry.Name,
                ContentType = contentType,
                Size = cached.Exists ? cached.Length : 0,
            },
            DurationSeconds = entry.Duration,
            Active = entry.Active,
            UploadedAt = uploaded,
            UpdatedAt = cached.Exists ? cached.LastWriteTimeUtc : uploaded,
        };
    }

    private Uri FileUri(string fileName) => WebDavClient.Child(sync.FolderUri, fileName);

    private static bool Same(string a, string b) => string.Equals(a, b, StringComparison.OrdinalIgnoreCase);

    private static string Today() => DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
}
