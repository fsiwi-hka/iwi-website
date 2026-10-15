using System.Text.Json;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.Calendar;

/// <summary>
/// Hält den zuletzt gespiegelten Kalender im Speicher. Beim Start wird der Cache von
/// der Platte geladen, damit die API auch ohne erreichbare Nextcloud sofort Daten hat.
/// </summary>
public sealed class CalendarStore
{
    public const string IcsFileName = "public.ics";
    public const string EventsFileName = "events.json";

    private readonly CalendarOptions _opt;
    private readonly ILogger<CalendarStore> _logger;
    private volatile Snapshot _snapshot = new([], null, null);

    private sealed record Snapshot(IReadOnlyList<CalendarEventDto> Events, string? Ics, DateTimeOffset? LastSync);

    public CalendarStore(IOptions<CalendarOptions> opt, ILogger<CalendarStore> logger)
    {
        _opt = opt.Value;
        _logger = logger;
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById(_opt.TimeZone);
        LoadFromDisk();
    }

    public TimeZoneInfo TimeZone { get; }
    public IReadOnlyList<CalendarEventDto> Events => _snapshot.Events;
    public string? Ics => _snapshot.Ics;
    public DateTimeOffset? LastSync => _snapshot.LastSync;

    public CalendarEventDto? Find(string id) => _snapshot.Events.FirstOrDefault(e => e.Id == id);

    public async Task UpdateAsync(CalendarProcessor.Result result, CancellationToken ct)
    {
        Directory.CreateDirectory(_opt.CacheDirectory);
        await WriteAtomicAsync(IcsFileName, result.PublicIcs, ct);
        await WriteAtomicAsync(EventsFileName, JsonSerializer.Serialize(result.Events), ct);
        _snapshot = new Snapshot(result.Events, result.PublicIcs, DateTimeOffset.UtcNow);
    }

    private async Task WriteAtomicAsync(string fileName, string content, CancellationToken ct)
    {
        var target = Path.Combine(_opt.CacheDirectory, fileName);
        var tmp = target + ".tmp";
        await File.WriteAllTextAsync(tmp, content, ct);
        File.Move(tmp, target, overwrite: true);
    }

    private void LoadFromDisk()
    {
        try
        {
            var icsPath = Path.Combine(_opt.CacheDirectory, IcsFileName);
            var eventsPath = Path.Combine(_opt.CacheDirectory, EventsFileName);
            if (!File.Exists(icsPath) || !File.Exists(eventsPath)) return;

            var events = JsonSerializer.Deserialize<List<CalendarEventDto>>(File.ReadAllText(eventsPath)) ?? [];
            foreach (var e in events) CalendarProcessor.RestoreUtc(e, TimeZone);

            _snapshot = new Snapshot(events, File.ReadAllText(icsPath),
                new DateTimeOffset(File.GetLastWriteTimeUtc(eventsPath), TimeSpan.Zero));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Kalender-Cache konnte nicht geladen werden - starte leer.");
        }
    }
}
