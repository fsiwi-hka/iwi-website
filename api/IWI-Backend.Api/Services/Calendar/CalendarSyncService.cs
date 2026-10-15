using System.Net.Http.Headers;
using System.Text;
using IWI_Backend.Api.Configuration;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.Calendar;

/// <summary>Spiegelt den FS-Kalender aus der Nextcloud (CalDAV-Export) periodisch in den <see cref="CalendarStore"/>.</summary>
public class CalendarSyncService(
    IOptions<CalendarOptions> opt,
    IOptions<WebDavOptions> webDavOpt,
    IHttpClientFactory httpFactory,
    CalendarStore store,
    ILogger<CalendarSyncService> logger
) : BackgroundService
{
    private readonly SemaphoreSlim _gate = new(1, 1);

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(opt.Value.ExportUrl))
        {
            logger.LogWarning("Calendar:ExportUrl ist nicht gesetzt - Kalender-Sync deaktiviert.");
            return;
        }

        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(opt.Value.SyncIntervalMinutes));
        do
        {
            try
            {
                await SyncAsync(ct);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Kalender-Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }
        while (await timer.WaitForNextTickAsync(ct));
    }

    public async Task SyncAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var o = opt.Value;
            using var req = new HttpRequestMessage(HttpMethod.Get, o.ExportUrl);
            var w = webDavOpt.Value;
            if (!string.IsNullOrEmpty(w.Username))
            {
                var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{w.Username}:{w.Password}"));
                req.Headers.Authorization = new AuthenticationHeaderValue("Basic", token);
            }

            using var resp = await httpFactory.CreateClient().SendAsync(req, ct);
            resp.EnsureSuccessStatusCode();
            var ics = await resp.Content.ReadAsStringAsync(ct);

            var now = DateTime.UtcNow;
            var result = CalendarProcessor.Process(ics, now.AddMonths(-o.PastMonths), now.AddMonths(o.FutureMonths),
                store.TimeZone, o.CalendarName);

            await store.UpdateAsync(result, ct);
            logger.LogInformation("Kalender gespiegelt: {Count} Termine.", result.Events.Count);
        }
        finally
        {
            _gate.Release();
        }
    }
}
