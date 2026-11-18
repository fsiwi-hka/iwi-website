using System.Globalization;
using System.Text.RegularExpressions;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using IWI_Backend.Api.Services;
using IWI_Backend.Api.Services.Protocols;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Spiegel der Sitzungsprotokolle im WebDAV (FB_Archiv/fs_sitzungsprotokolle,
/// je Semester ein Ordner wie "25WS"). Die PDFs bleiben dort; die Backrooms
/// lesen den Index des Protokoll-Syncs und schreiben direkt ins WebDAV.
/// Id = "{Ordner}:{Dateiname}", Titel = Dateiname ohne ".pdf".
/// </summary>
[ApiController]
[Authorize]
[Route("/api/backrooms/content/protocols")]
public partial class BackroomsProtocolsController(
    ProtocolSyncService sync,
    WebDavClient webdav,
    MediaLibrary library,
    ILogger<BackroomsProtocolsController> logger
) : ControllerBase
{
    private const string Pdf = "application/pdf";
    private static readonly SemaphoreSlim Gate = new(1, 1);

    private sealed record Located(string Key, ProtocolCacheEntry Entry);

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProtocolDto>>> List(CancellationToken ct)
    {
        var index = await sync.ReadProtocolsAsync(ct);
        return index
            .OrderByDescending(kvp => SemesterKey.SortKey(kvp.Key))
            .SelectMany(kvp => kvp.Value.Select(entry => ToDto(kvp.Key, entry)))
            .ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProtocolDto>> Get(string id, CancellationToken ct) =>
        await FindAsync(id, ct) is { } found ? ToDto(found.Key, found.Entry) : NotFound();

    [HttpPost]
    public Task<ActionResult<ProtocolDto>> Create(ProtocolUpsertDto request, CancellationToken ct) =>
        WriteAsync(async index =>
        {
            if (!WebDavFiles.IsUpload(request.File))
                return BadRequest(new { error = "Bitte die PDF-Datei hochladen." });
            if (Check(request, index) is { } error) return BadRequest(new { error });

            var key = SemesterKey.ToKey(request.Semester, index.Keys)!;
            var fileName = request.Title.Trim() + ".pdf";
            if (Exists(index, key, fileName))
                return Conflict(new { error = $"In {request.Semester} gibt es schon \"{fileName}\"." });

            await webdav.CreateFolderAsync(FolderUri(key), ct);
            if (!await WebDavFiles.MoveUploadAsync(webdav, library, request.File!, FileUri(key, fileName), ct))
                return BadRequest(new { error = "Der Upload ist nicht mehr vorhanden, bitte erneut hochladen." });
            return Id(key, fileName);
        }, ct);

    [HttpPut("{id}")]
    public Task<ActionResult<ProtocolDto>> Update(string id, ProtocolUpsertDto request, CancellationToken ct) =>
        WriteAsync(async index =>
        {
            if (Find(index, id) is not { } found) return NotFound();
            if (Check(request, index) is { } error) return BadRequest(new { error });

            var key = SemesterKey.ToKey(request.Semester, index.Keys)!;
            var fileName = request.Title.Trim() + ".pdf";
            var current = new Uri(found.Entry.Href);
            var target = FileUri(key, fileName);
            var moved = key != found.Key || fileName != found.Entry.FileName;
            var sameFile = key == found.Key && fileName.Equals(found.Entry.FileName, StringComparison.OrdinalIgnoreCase);
            if (moved && !sameFile && Exists(index, key, fileName))
                return Conflict(new { error = $"In {request.Semester} gibt es schon \"{fileName}\"." });

            if (key != found.Key) await webdav.CreateFolderAsync(FolderUri(key), ct);

            if (WebDavFiles.IsUpload(request.File))
            {
                // Neue Datei: hochladen, dann die alte entfernen (bei gleichem Ziel ersetzt der Upload sie).
                if (!await WebDavFiles.MoveUploadAsync(webdav, library, request.File!, target, ct))
                    return BadRequest(new { error = "Der Upload ist nicht mehr vorhanden, bitte erneut hochladen." });
                if (!sameFile) await webdav.DeleteAsync(current, ct);
            }
            else if (moved)
            {
                await webdav.MoveAsync(current, target, ct);
            }
            return Id(key, fileName);
        }, ct);

    /// <summary>Loescht die Datei im WebDAV (in der Nextcloud: Papierkorb).</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var result = await WriteAsync(async index =>
        {
            if (Find(index, id) is not { } found) return NotFound();
            await webdav.DeleteAsync(new Uri(found.Entry.Href), ct);
            return (string?)null;
        }, ct);
        return result.Result!;
    }

    /// <summary>Aenderung im WebDAV ausfuehren, danach den Index neu aufbauen.</summary>
    private async Task<ActionResult<ProtocolDto>> WriteAsync(
        Func<Dictionary<string, List<ProtocolCacheEntry>>, Task<ActionResult<string?>>> change,
        CancellationToken ct)
    {
        await Gate.WaitAsync(ct);
        try
        {
            // Vorher frisch einlesen, damit Aenderungen direkt in der Nextcloud nicht ueberschrieben werden.
            await sync.SyncAsync(ct);
            var outcome = await change(await sync.ReadProtocolsAsync(ct));
            if (outcome.Result is { } failed) return failed;

            await sync.SyncAsync(ct);
            if (outcome.Value is not { } id) return NoContent();
            return await FindAsync(id, ct) is { } found
                ? ToDto(found.Key, found.Entry)
                : StatusCode(StatusCodes.Status502BadGateway);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "WebDAV-Zugriff fuer die Protokolle fehlgeschlagen.");
            return StatusCode(StatusCodes.Status502BadGateway,
                new { error = $"Die Nextcloud hat die Aenderung abgelehnt ({(int?)ex.StatusCode})." });
        }
        finally
        {
            Gate.Release();
        }
    }

    private static string? Check(ProtocolUpsertDto request, Dictionary<string, List<ProtocolCacheEntry>> index)
    {
        if (WebDavFiles.CheckName(request.Title.Trim()) is { } error) return error;
        if (request.File is { } file && file.ContentType != Pdf) return "Protokolle muessen PDF-Dateien sein.";
        return SemesterKey.ToKey(request.Semester, index.Keys) is null
            ? "Semester bitte als \"WS 2025/26\" oder \"SS 2026\" angeben."
            : null;
    }

    private async Task<Located?> FindAsync(string id, CancellationToken ct) =>
        Find(await sync.ReadProtocolsAsync(ct), id);

    private static Located? Find(Dictionary<string, List<ProtocolCacheEntry>> index, string id)
    {
        var split = id.IndexOf(':');
        if (split <= 0) return null;
        var key = id[..split];
        var fileName = id[(split + 1)..];
        return index.TryGetValue(key, out var entries)
               && entries.FirstOrDefault(e => e.FileName == fileName) is { } entry
            ? new Located(key, entry)
            : null;
    }

    private static bool Exists(Dictionary<string, List<ProtocolCacheEntry>> index, string key, string fileName) =>
        index.TryGetValue(key, out var entries)
        && entries.Any(e => e.FileName.Equals(fileName, StringComparison.OrdinalIgnoreCase));

    private static string Id(string key, string fileName) => $"{key}:{fileName}";

    private Uri FolderUri(string key) => WebDavClient.Child(sync.FolderUri, key, isFolder: true);

    private Uri FileUri(string key, string fileName) => WebDavClient.Child(FolderUri(key), fileName);

    private static ProtocolDto ToDto(string key, ProtocolCacheEntry entry) => new()
    {
        Id = Id(key, entry.FileName),
        Title = Path.GetFileNameWithoutExtension(entry.FileName),
        Semester = SemesterKey.ToLabel(key),
        MeetingDate = DateFromName(entry.FileName)
                      ?? (entry.LastModified is { } modified ? DateOnly.FromDateTime(modified.UtcDateTime) : null),
        File = new MediaRef
        {
            Url = $"/api/protocols/{Uri.EscapeDataString(entry.FileName)}",
            Name = entry.FileName,
            ContentType = Pdf,
            Size = entry.Size,
        },
        UpdatedAt = entry.LastModified ?? DateTimeOffset.UnixEpoch,
    };

    [GeneratedRegex(@"(?<!\d)(?:(\d{4})-?(\d{2})-?(\d{2})|(\d{2})\.(\d{2})\.(\d{4}))(?!\d)")]
    private static partial Regex DatePattern();

    /// <summary>Sitzungsdatum aus Namen wie "2026-03-11 Protokoll", "20260311_FS" oder "11.03.2026".</summary>
    private static DateOnly? DateFromName(string fileName)
    {
        var m = DatePattern().Match(fileName);
        if (!m.Success) return null;
        var text = m.Groups[1].Success
            ? $"{m.Groups[1].Value}-{m.Groups[2].Value}-{m.Groups[3].Value}"
            : $"{m.Groups[6].Value}-{m.Groups[5].Value}-{m.Groups[4].Value}";
        return DateOnly.TryParseExact(text, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : null;
    }
}
