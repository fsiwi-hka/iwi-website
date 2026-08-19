using System.Text.Json;
using System.Text.Json.Serialization;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

public class InstagramGraphApiService(
    InstagramTokenStore tokenStore,
    IHttpClientFactory httpFactory)
{
    private const string BaseUrl = "https://graph.instagram.com";

    private static readonly string[] MediaFields =
    [
        "id", "media_url", "thumbnail_url", "media_type", "caption",
        "permalink", "timestamp", "like_count", "comments_count",
        "children{id,media_type,media_url}"
    ];

    private static readonly string[] ProfileFields =
    [
        "id", "username", "profile_picture_url"
    ];

    public async Task<IReadOnlyList<InstagramMedia>> GetInstagramPostsAsync(int limit = 5, CancellationToken ct = default)
    {
        var client = httpFactory.CreateClient();
        var url = await GraphApiUrlBuilder("me/media", MediaFields, limit);

        var resp = await client.GetFromJsonAsync<MediaResponse>(url, ct);
        return resp?.Data ?? [];
    }

    public async Task<InstagramProfile?> GetProfileAsync(CancellationToken ct = default)
    {
        var client = httpFactory.CreateClient();
        var url = await GraphApiUrlBuilder("me", ProfileFields);

        return await client.GetFromJsonAsync<InstagramProfile>(url, ct);
    }

    /// <summary>
    /// Lädt eine signierte CDN-URL herunter. Der Aufrufer muss sicherstellen,
    /// dass die URL frisch ist - abgelaufene Links antworten mit 403.
    /// </summary>
    public async Task<Stream> OpenMediaStreamAsync(string url, CancellationToken ct)
    {
        var client = httpFactory.CreateClient();
        var resp = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, ct);
        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadAsStreamAsync(ct);
    }

    private async Task<string> GraphApiUrlBuilder(string route, IReadOnlyList<string> fields, int? limit = null)
    {
        var token = await tokenStore.GetTokenAsync();
        if (string.IsNullOrEmpty(token)) throw new InvalidOperationException("No token available");

        var query =
            $"fields={string.Join(",", fields.Select(Uri.EscapeDataString))}"
            + $"&access_token={Uri.EscapeDataString(token)}";
        if (limit is { } l) query += $"&limit={l}";

        return $"{BaseUrl}/{route}?{query}";
    }
}

public sealed class InstagramTokenStore(IOptions<InstagramGraphOptions> options)
{
    private readonly InstagramGraphOptions _opt = options.Value;
    private readonly SemaphoreSlim _lock = new(1, 1);

    /// <summary>
    /// Bevorzugt das zuletzt erneuerte Token aus der Datei; faellt auf das
    /// konfigurierte Token zurueck, wenn die Datei fehlt, leer oder kaputt ist.
    ///
    /// Wichtig fuers Deployment: die Datei liegt auf einem persistenten Volume und
    /// ueberlebt jeden Redeploy. Damit ein rotiertes Secret trotzdem greift, merkt
    /// sich die Datei, aus welchem konfigurierten Token ihre Refresh-Kette stammt -
    /// aendert sich Instagram:AccessToken, gewinnt die Konfiguration.
    /// </summary>
    public async Task<string> GetTokenAsync()
    {
        var configured = _opt.AccessToken;
        var stored = await ReadStoredAsync();

        if (string.IsNullOrEmpty(stored?.AccessToken)) return configured;
        if (string.IsNullOrEmpty(configured)) return stored.AccessToken;

        return stored.Seed == configured ? stored.AccessToken : configured;
    }

    private async Task<TokenData?> ReadStoredAsync()
    {
        if (!File.Exists(_opt.TokenFilePath)) return null;
        try
        {
            var json = await File.ReadAllTextAsync(_opt.TokenFilePath);
            return string.IsNullOrWhiteSpace(json) ? null : JsonSerializer.Deserialize<TokenData>(json);
        }
        catch (JsonException)
        {
            // Beschaedigte Token-Datei darf den Start nicht blockieren.
            return null;
        }
    }

    public async Task SaveTokenAsync(string token, DateTimeOffset expiresAt)
    {
        await _lock.WaitAsync();
        try
        {
            var json = JsonSerializer.Serialize(new TokenData(token, expiresAt, _opt.AccessToken));
            var tmp = _opt.TokenFilePath + ".tmp";
            await File.WriteAllTextAsync(tmp, json);
            File.Move(tmp, _opt.TokenFilePath, overwrite: true);
        }
        finally { _lock.Release(); }
    }

    /// <param name="Seed">Das konfigurierte Token, aus dem dieses erneuerte Token hervorging.</param>
    private record TokenData(string AccessToken, DateTimeOffset ExpiresAt, string? Seed = null);
}

public class InstagramTokenRefresher(
    InstagramTokenStore store, 
    IHttpClientFactory http,
    ILogger<InstagramTokenRefresher> logger
    )
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                var current = await store.GetTokenAsync();
                var client = http.CreateClient();
                var url =
                    $"https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={current}";
                var resp = await client.GetFromJsonAsync<RefreshResponse>(url, ct);

                if (resp?.AccessToken is { } token)
                    await store.SaveTokenAsync(token, DateTimeOffset.UtcNow.AddSeconds(resp.ExpiresIn));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Instagram-Token-Refresh fehlgeschlagen");
            }

            await Task.Delay(TimeSpan.FromDays(1), ct);
        }
    }

    private record RefreshResponse(
        [property: JsonPropertyName("access_token")] string AccessToken,
        [property: JsonPropertyName("expires_in")] int ExpiresIn);
}