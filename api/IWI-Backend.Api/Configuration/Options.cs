namespace IWI_Backend.Api.Configuration;

public sealed class WebDavOptions
{
    /// <summary>URL des Ordners, mit Slash am Ende. Z.B. https://cloud.example.com/remote.php/dav/files/USER/Display/</summary>
    public string BaseUrl { get; set; } = "";
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string ConfigFileName { get; set; } = "config.json";
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
}
