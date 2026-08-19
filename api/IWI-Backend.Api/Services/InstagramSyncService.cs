using System.Text.Encodings.Web;
using System.Text.Json;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

/// <summary>
/// Spiegelt den Instagram-Feed auf die eigene Platte.
///
/// Hintergrund: media_url, thumbnail_url und profile_picture_url der Graph API
/// sind signierte CDN-Links, die nach wenigen Stunden bis Tagen ablaufen (oe=...).
/// Sie dürfen deshalb weder gecacht noch ans Frontend durchgereicht werden.
/// Stattdessen wird die Datei einmal heruntergeladen und unter der stabilen
/// Media-ID über /api/content/insta-media/{name} ausgeliefert.
///
/// Bei Fehlern bleibt der vorhandene Cache erhalten.
/// </summary>
public sealed class InstagramSyncService : BackgroundService
{
    /// <summary>Erlaubte Dateiendungen; alles andere landet als .jpg im Cache.</summary>
    private static readonly HashSet<string> KnownExt = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".mp4" };

    private const string CacheFileName = "feed.cached.json";

    private static readonly JsonSerializerOptions Json = new()
    {
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, // Umlaute lesbar statt \uXXXX
    };

    private readonly InstagramGraphApiService _api;
    private readonly InstagramStore _store;
    private readonly InstagramGraphOptions _opts;
    private readonly ILogger<InstagramSyncService> _logger;
    private readonly SemaphoreSlim _gate = new(1, 1);

    public InstagramSyncService(
        InstagramGraphApiService api, InstagramStore store,
        IOptions<InstagramGraphOptions> opts,
        ILogger<InstagramSyncService> logger)
    {
        _api = api;
        _store = store;
        _opts = opts.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Beim Start sofort den lokalen Cache laden, damit die API antwortet,
        // auch wenn der erste Sync noch läuft oder fehlschlägt.
        LoadFromCache();

        var interval = TimeSpan.FromMinutes(Math.Max(5, _opts.SyncIntervalMinutes));
        using var timer = new PeriodicTimer(interval);
        do
        {
            try
            {
                await SyncAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Instagram-Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    /// <summary>Ein vollständiger Sync-Durchlauf (auch manuell über POST /api/content/refresh nutzbar).</summary>
    public async Task SyncAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            _logger.LogInformation("Starte Instagram-Sync ...");

            var media = await _api.GetInstagramPostsAsync(_opts.PostLimit, ct);
            var profile = await _api.GetProfileAsync(ct);

            // Namen aller Dateien, die nach diesem Durchlauf im Cache liegen sollen.
            var expected = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            var user = await MirrorProfileAsync(profile, expected, ct);

            var posts = new List<InstagramPostDto>();
            foreach (var m in media)
            {
                var post = await MirrorPostAsync(m, expected, ct);
                if (post is not null) posts.Add(post);
            }

            RemoveOrphans(expected);

            var feed = new InstagramFeedDto(user, posts);
            await File.WriteAllTextAsync(
                Path.Combine(_store.CacheDirectory, CacheFileName),
                JsonSerializer.Serialize(feed, Json), ct);

            _store.Update(feed);
            _logger.LogInformation("Instagram-Sync fertig: {Count} Posts gespiegelt.", posts.Count);
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task<InstagramUserDto?> MirrorProfileAsync(
        InstagramProfile? profile, HashSet<string> expected, CancellationToken ct)
    {
        if (profile is null) return null;

        string? src = null;
        if (!string.IsNullOrEmpty(profile.ProfilePictureUrl))
        {
            // Das Profilbild hat keine stabile ID, wohl aber einen stabilen Dateinamen
            // im URL-Pfad. Ändert sich das Bild, ändert sich der Name - die alte Datei
            // wird dann als verwaist entfernt.
            var name = "profile_" + SafeFileName(profile.ProfilePictureUrl);
            src = (await MirrorFileAsync(profile.ProfilePictureUrl, name, expected, ct))?.Path;
        }

        return new InstagramUserDto(profile.Id, profile.Username, src);
    }

    private async Task<InstagramPostDto?> MirrorPostAsync(
        InstagramMedia m, HashSet<string> expected, CancellationToken ct)
    {
        var isVideo = string.Equals(m.MediaType, "VIDEO", StringComparison.OrdinalIgnoreCase);

        // Bei Alben liefert die API media_url nicht immer auf dem Elternobjekt.
        var coverUrl = isVideo
            ? m.ThumbnailUrl
            : m.MediaUrl ?? m.Children?.Data.FirstOrDefault()?.MediaUrl;

        if (string.IsNullOrEmpty(coverUrl))
        {
            _logger.LogWarning("Post {Id} ({Type}) hat kein nutzbares Bild - übersprungen.", m.Id, m.MediaType);
            return null;
        }

        var cover = await MirrorFileAsync(coverUrl, m.Id + ExtensionOf(coverUrl), expected, ct);
        if (cover is null) return null;

        List<InstagramChildDto>? children = null;
        if (m.Children?.Data is { Count: > 0 } childData)
        {
            children = [];
            foreach (var c in childData)
            {
                if (string.IsNullOrEmpty(c.MediaUrl)) continue;
                var child = await MirrorFileAsync(c.MediaUrl, c.Id + ExtensionOf(c.MediaUrl), expected, ct);
                if (child is not null)
                    children.Add(new InstagramChildDto(c.Id, c.MediaType, child.Path, child.Width, child.Height));
            }
        }

        // Videos werden bewusst nicht gespiegelt - der Feed zeigt nur das Vorschaubild,
        // die mp4 gibt es über den permalink. media_url bleibt deshalb leer.
        return new InstagramPostDto(
            m.Id, m.MediaType,
            MediaUrl: isVideo ? null : cover.Path,
            ThumbnailUrl: isVideo ? cover.Path : null,
            m.Caption, m.Permalink, m.Timestamp, m.LikeCount, m.CommentsCount,
            children, cover.Width, cover.Height);
    }

    /// <summary>Ein gespiegeltes Medium: eigener Pfad plus Masse aus dem Dateikopf.</summary>
    private sealed record Mirrored(string Path, int? Width, int? Height);

    /// <summary>
    /// Lädt die URL nach {CacheDirectory}/{name}, falls die Datei noch nicht existiert,
    /// und gibt den öffentlichen Pfad zurück. Null, wenn der Download scheitert.
    /// </summary>
    private async Task<Mirrored?> MirrorFileAsync(
        string url, string name, HashSet<string> expected, CancellationToken ct)
    {
        expected.Add(name);
        var dest = Path.Combine(_store.CacheDirectory, name);
        var publicPath = $"/api/content/insta-media/{Uri.EscapeDataString(name)}";

        if (!File.Exists(dest))
        {
            var tmp = dest + ".tmp";
            try
            {
                _logger.LogInformation("Lade Instagram-Medium {Name}", name);
                await using (var src = await _api.OpenMediaStreamAsync(url, ct))
                await using (var dst = File.Create(tmp))
                {
                    await src.CopyToAsync(dst, ct);
                }
                File.Move(tmp, dest, overwrite: true);
            }
            catch (Exception ex)
            {
                // Meist eine bereits abgelaufene Signatur (403). Der nächste Sync holt
                // eine frische URL, deshalb hier nur warnen.
                _logger.LogWarning(ex, "Download von {Name} fehlgeschlagen.", name);
                TryDelete(tmp);
                expected.Remove(name);
                return null;
            }
        }

        var size = ImageDimensions.TryRead(dest);
        return new Mirrored(publicPath, size?.Width, size?.Height);
    }

    private void RemoveOrphans(HashSet<string> expected)
    {
        foreach (var path in Directory.GetFiles(_store.CacheDirectory))
        {
            var name = Path.GetFileName(path);
            if (name == CacheFileName || expected.Contains(name)) continue;

            _logger.LogInformation("Entferne verwaiste Datei {Name}", name);
            TryDelete(path);
        }
    }

    private void LoadFromCache()
    {
        try
        {
            var cached = Path.Combine(_store.CacheDirectory, CacheFileName);
            if (!File.Exists(cached)) return;

            var feed = JsonSerializer.Deserialize<InstagramFeedDto>(File.ReadAllText(cached), Json);
            if (feed is null) return;

            // Nur Posts übernehmen, deren Datei noch da ist.
            var posts = feed.Data.Where(p => FileExists(p.MediaUrl ?? p.ThumbnailUrl)).ToList();
            _store.Update(feed with { Data = posts });
            _logger.LogInformation("Instagram-Cache geladen: {Count} Posts.", posts.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Konnte Instagram-Cache nicht laden.");
        }
    }

    private bool FileExists(string? publicPath)
    {
        if (string.IsNullOrEmpty(publicPath)) return false;
        var name = Uri.UnescapeDataString(publicPath[(publicPath.LastIndexOf('/') + 1)..]);
        return File.Exists(Path.Combine(_store.CacheDirectory, name));
    }

    /// <summary>Endung aus dem URL-Pfad (ohne Query), auf bekannte Formate begrenzt.</summary>
    private static string ExtensionOf(string url)
    {
        var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var ext = Path.GetExtension(path);
        return KnownExt.Contains(ext) ? ext.ToLowerInvariant() : ".jpg";
    }

    /// <summary>Dateiname aus dem URL-Pfad, auf unbedenkliche Zeichen reduziert.</summary>
    private static string SafeFileName(string url)
    {
        var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var name = Path.GetFileNameWithoutExtension(path);
        var safe = new string(name.Where(char.IsLetterOrDigit).Take(64).ToArray());
        return (safe.Length > 0 ? safe : "picture") + ExtensionOf(url);
    }

    private static void TryDelete(string path)
    {
        try { File.Delete(path); } catch { /* ignore */ }
    }
}
