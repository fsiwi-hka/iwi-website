using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using IWI_Backend.Api.Configuration;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.Auth;

public sealed record NextcloudUser(string Id, string DisplayName, string? Email, IReadOnlyList<string> Groups);

/// <summary>
/// Prueft Zugangsdaten gegen die Nextcloud: GET /ocs/v2.php/cloud/user mit
/// Basic-Auth liefert bei Erfolg den eigenen Nutzer inkl. Gruppen. Das
/// Passwort wird nur durchgereicht, nie gespeichert oder geloggt.
/// </summary>
public sealed class NextcloudAuthenticator(HttpClient http, IOptions<BackroomsAuthOptions> options, ILogger<NextcloudAuthenticator> log)
{
    /// <returns>Den Nutzer, oder null bei falschen Zugangsdaten.</returns>
    /// <exception cref="HttpRequestException">Nextcloud nicht erreichbar oder Fehlerantwort.</exception>
    public async Task<NextcloudUser?> VerifyAsync(string username, string password, CancellationToken ct)
    {
        var url = $"{options.Value.NextcloudUrl.TrimEnd('/')}/ocs/v2.php/cloud/user?format=json";
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic",
            Convert.ToBase64String(Encoding.UTF8.GetBytes($"{username}:{password}")));
        request.Headers.Add("OCS-APIRequest", "true");
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await http.SendAsync(request, ct);
        if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            return null;
        response.EnsureSuccessStatusCode();

        using var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
        var data = json.RootElement.GetProperty("ocs").GetProperty("data");

        var id = data.GetProperty("id").GetString() ?? username;
        var displayName = data.TryGetProperty("displayname", out var dn) && dn.GetString() is { Length: > 0 } name
            ? name
            : id;
        var email = data.TryGetProperty("email", out var em) && em.ValueKind == JsonValueKind.String ? em.GetString() : null;
        var groups = data.TryGetProperty("groups", out var gr) && gr.ValueKind == JsonValueKind.Array
            ? gr.EnumerateArray().Select(g => g.GetString()).OfType<string>().ToList()
            : [];

        log.LogInformation("Backrooms-Anmeldung von {User} gegen Nextcloud erfolgreich", id);
        return new NextcloudUser(id, displayName, string.IsNullOrWhiteSpace(email) ? null : email, groups);
    }
}
