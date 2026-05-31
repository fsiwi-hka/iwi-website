using System.Text.Encodings.Web;
using System.Text.Json;
using IWI_Backend.Api.Configuration;
using IwiDisplayBackend.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

/// <summary>
/// Synchronisiert alle N Stunden den WebDAV-Ordner:
///  1. Dateien listen + herunterladen (unveränderte werden übersprungen)
///  2. Remote-config.json laden und mit Defaults für neue Dateien zusammenführen
///  3. Effektive Config + Manifest lokal cachen
///  4. Slide-Liste für die API erzeugen
/// Bei Fehlern bleibt der vorhandene Cache erhalten.
/// </summary>
public sealed class MediaSyncService : BackgroundService
{
    private static readonly HashSet<string> ImageExt = new(StringComparer.OrdinalIgnoreCase)
        { ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif" };
    private static readonly HashSet<string> VideoExt = new(StringComparer.OrdinalIgnoreCase)
        { ".mp4", ".webm", ".mov" };

    private static readonly JsonSerializerOptions Json = new()
    {
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, // Umlaute lesbar statt \uXXXX
    };

    private readonly WebDavClient _webdav;
    private readonly MediaStore _store;
    private readonly SyncOptions _opts;
    private readonly WebDavOptions _webdavOpts;
    private readonly ILogger<MediaSyncService> _logger;
    private readonly SemaphoreSlim _gate = new(1, 1);

    public MediaSyncService(
        WebDavClient webdav, MediaStore store,
        IOptions<SyncOptions> opts, IOptions<WebDavOptions> webdavOpts,
        ILogger<MediaSyncService> logger)
    {
        _webdav = webdav;
        _store = store;
        _opts = opts.Value;
        _webdavOpts = webdavOpts.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Beim Start sofort den lokalen Cache laden, damit die API antwortet,
        // auch wenn der erste Remote-Sync noch läuft oder fehlschlägt.
        LoadFromCache();

        var interval = TimeSpan.FromHours(Math.Max(1, _opts.IntervalHours));
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
                _logger.LogError(ex, "WebDAV-Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    /// <summary>Ein vollständiger Sync-Durchlauf (auch manuell über /api/refresh nutzbar).</summary>
    public async Task SyncAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            _logger.LogInformation("Starte WebDAV-Sync ...");
            var remote = await _webdav.ListAsync(ct);

            // --- Remote-Config laden (falls vorhanden) ---
            var configFile = remote.FirstOrDefault(f =>
                string.Equals(f.Name, _webdavOpts.ConfigFileName, StringComparison.OrdinalIgnoreCase));

            MediaConfig remoteConfig = new();
            if (configFile is not null)
            {
                var path = Path.Combine(_store.CacheDirectory, "config.remote.json");
                await _webdav.DownloadToAsync(configFile.Href, path, ct);
                remoteConfig = JsonSerializer.Deserialize<MediaConfig>(
                    await File.ReadAllTextAsync(path, ct), Json) ?? new MediaConfig();
            }

            // --- Mediendateien herunterladen (unveränderte überspringen) ---
            var mediaFiles = remote.Where(f => IsMedia(f.Name)).ToList();
            var manifest = LoadManifest();
            var newManifest = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

            foreach (var f in mediaFiles)
            {
                var dest = Path.Combine(_store.CacheDirectory, f.Name);
                var unchanged = File.Exists(dest)
                    && manifest.TryGetValue(f.Name, out var prev)
                    && prev == f.LastModified;

                if (!unchanged)
                {
                    _logger.LogInformation("Lade {Name}", f.Name);
                    await _webdav.DownloadToAsync(f.Href, dest, ct);
                }
                newManifest[f.Name] = f.LastModified;
            }

            // --- Verwaiste Dateien (nicht mehr remote) lokal entfernen ---
            var remoteNames = mediaFiles.Select(f => f.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
            foreach (var local in Directory.GetFiles(_store.CacheDirectory))
            {
                var name = Path.GetFileName(local);
                if (IsMedia(name) && !remoteNames.Contains(name))
                {
                    _logger.LogInformation("Entferne verwaiste Datei {Name}", name);
                    TryDelete(local);
                }
            }

            // --- Effektive Config + Slides bauen, cachen, veröffentlichen ---
            var effective = BuildEffectiveConfig(remoteConfig, mediaFiles);
            var slides = BuildSlides(effective);

            await File.WriteAllTextAsync(
                Path.Combine(_store.CacheDirectory, "config.cached.json"),
                JsonSerializer.Serialize(effective, Json), ct);
            SaveManifest(newManifest);

            _store.Update(slides, effective);
            _logger.LogInformation("Sync fertig: {Count} aktive Slides.", slides.Count);
        }
        finally
        {
            _gate.Release();
        }
    }

    /// <summary>
    /// Reihenfolge aus der Remote-Config bleibt erhalten; Dateien ohne Eintrag
    /// bekommen einen Standard-Eintrag (duration = Default, active = true).
    /// Einträge ohne existierende Datei werden verworfen.
    /// </summary>
    private MediaConfig BuildEffectiveConfig(MediaConfig source, List<WebDavFile> mediaFiles)
    {
        var result = new MediaConfig();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var mediaNames = mediaFiles.Select(f => f.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);

        // 1) bestehende Einträge in Original-Reihenfolge
        foreach (var entry in source.Files)
        {
            if (mediaNames.Contains(entry.Name) && seen.Add(entry.Name))
                result.Files.Add(entry);
        }

        // 2) neue Dateien (alphabetisch) mit Standard-Eintrag ergänzen
        foreach (var f in mediaFiles.OrderBy(f => f.Name, StringComparer.OrdinalIgnoreCase))
        {
            if (seen.Add(f.Name))
            {
                result.Files.Add(new MediaEntry
                {
                    Name = f.Name,
                    Duration = _opts.DefaultDurationSeconds,
                    Active = true,
                    UploadDate = ParseDate(f.LastModified) ?? DateTime.UtcNow.ToString("yyyy-MM-dd"),
                });
            }
        }

        return result;
    }

    private List<SlideDto> BuildSlides(MediaConfig config)
    {
        var slides = new List<SlideDto>();
        foreach (var e in config.Files)
        {
            if (!e.Active) continue;
            if (!File.Exists(Path.Combine(_store.CacheDirectory, e.Name))) continue;

            var type = VideoExt.Contains(Path.GetExtension(e.Name)) ? "video" : "image";
            var duration = e.Duration > 0 ? e.Duration : _opts.DefaultDurationSeconds;
            var alt = Path.GetFileNameWithoutExtension(e.Name);
            var src = $"/api/info/{Uri.EscapeDataString(e.Name)}";
            slides.Add(new SlideDto(type, src, duration, alt));
        }
        return slides;
    }

    private void LoadFromCache()
    {
        try
        {
            var cached = Path.Combine(_store.CacheDirectory, "config.cached.json");
            if (!File.Exists(cached)) return;

            var config = JsonSerializer.Deserialize<MediaConfig>(File.ReadAllText(cached), Json) ?? new();
            _store.Update(BuildSlides(config), config);
            _logger.LogInformation("Cache geladen: {Count} Slides.", _store.Slides.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Konnte lokalen Cache nicht laden.");
        }
    }

    private Dictionary<string, string?> LoadManifest()
    {
        var path = Path.Combine(_store.CacheDirectory, "manifest.json");
        if (!File.Exists(path)) return new(StringComparer.OrdinalIgnoreCase);
        try
        {
            var dict = JsonSerializer.Deserialize<Dictionary<string, string?>>(File.ReadAllText(path));
            return dict is null ? new(StringComparer.OrdinalIgnoreCase)
                                : new(dict, StringComparer.OrdinalIgnoreCase);
        }
        catch { return new(StringComparer.OrdinalIgnoreCase); }
    }

    private void SaveManifest(Dictionary<string, string?> manifest)
        => File.WriteAllText(Path.Combine(_store.CacheDirectory, "manifest.json"),
                             JsonSerializer.Serialize(manifest, Json));

    private static bool IsMedia(string name)
    {
        var ext = Path.GetExtension(name);
        return ImageExt.Contains(ext) || VideoExt.Contains(ext);
    }

    private static string? ParseDate(string? lastModified)
        => DateTimeOffset.TryParse(lastModified, out var dt) ? dt.ToString("yyyy-MM-dd") : null;

    private static void TryDelete(string path)
    {
        try { File.Delete(path); } catch { /* ignore */ }
    }
}
