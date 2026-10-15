namespace IWI_Backend.Api.Configuration;

public sealed class WebDavOptions
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public sealed class MediaOptions
{
    public string BaseUrl { get; set; } = "";
    public string ConfigFileName { get; set; } = "config.json";
}

public sealed class ProtocolOptions {
    public string BaseUrl { get; set; } = "";
    public string CacheDirectory { get; set; } = "cache/protocol";
    public int SyncIntervalMinutes { get; set; } = 60 * 60 * 24;
    public string IndexFileName { get; set; } = "index.cached.json";
}

public sealed class SyncOptions
{
    public int IntervalHours { get; set; } = 6;
    public string CacheDirectory { get; set; } = "cache";
    public int DefaultDurationSeconds { get; set; } = 30;

    /// <summary>Optional. Wenn gesetzt, verlangt POST /api/refresh den Header X-Refresh-Token.</summary>
    public string? RefreshToken { get; set; }
}

public sealed class InstagramGraphOptions
{
    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string AccessToken { get; set; } = "";
    public string TokenFilePath { get; set; } = "";

    /// <summary>Ablageort der gespiegelten Instagram-Medien.</summary>
    public string CacheDirectory { get; set; } = "cache/instagram";

    /// <summary>Muss deutlich unter der Lebensdauer der signierten CDN-URLs liegen.</summary>
    public int SyncIntervalMinutes { get; set; } = 30;

    /// <summary>Anzahl der Posts, die gespiegelt werden.</summary>
    public int PostLimit { get; set; } = 12;
}

public sealed class CalendarOptions
{
    /// <summary>CalDAV-Export-URL, z. B. https://cloud.iwi-hka.de/remote.php/dav/calendars/USER/KALENDER/?export</summary>
    public string ExportUrl { get; set; } = "";
    public int SyncIntervalMinutes { get; set; } = 15;
    public string CacheDirectory { get; set; } = "cache/calendar";

    /// <summary>Expansionsfenster für Serientermine, relativ zum Sync-Zeitpunkt.</summary>
    public int PastMonths { get; set; } = 3;
    public int FutureMonths { get; set; } = 12;

    /// <summary>Zeitzone für Floating Times und die Ausgabe.</summary>
    public string TimeZone { get; set; } = "Europe/Berlin";

    /// <summary>Name des gespiegelten Kalenders beim Abonnieren (X-WR-CALNAME).</summary>
    public string CalendarName { get; set; } = "Fachschaft IWI";
}
