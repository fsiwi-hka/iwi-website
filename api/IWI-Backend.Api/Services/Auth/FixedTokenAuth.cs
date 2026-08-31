using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.Auth;

public sealed class FixedTokenOptions : AuthenticationSchemeOptions
{
    /// <summary>Fester Token aus der Konfiguration (Auth:Token bzw. Auth__Token).</summary>
    public string Token { get; set; } = "";
}

/// <summary>
/// Prueft "Authorization: Bearer &lt;token&gt;" gegen einen fest konfigurierten Wert.
/// Ohne konfigurierten Token schlaegt jede Anfrage fehl - ein leeres Secret darf
/// nie "alles erlaubt" bedeuten.
/// </summary>
public sealed class FixedTokenHandler(
    IOptionsMonitor<FixedTokenOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<FixedTokenOptions>(options, logger, encoder)
{
    public const string SchemeName = "Bearer";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (string.IsNullOrWhiteSpace(Options.Token))
            return Task.FromResult(AuthenticateResult.Fail("Kein Auth:Token konfiguriert."));

        if (!AuthenticationHeaderValue.TryParse(Request.Headers.Authorization, out var header)
            || !SchemeName.Equals(header.Scheme, StringComparison.OrdinalIgnoreCase)
            || string.IsNullOrEmpty(header.Parameter))
            return Task.FromResult(AuthenticateResult.NoResult());

        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(header.Parameter),
                Encoding.UTF8.GetBytes(Options.Token)))
            return Task.FromResult(AuthenticateResult.Fail("Ungueltiges Token."));

        var identity = new ClaimsIdentity([new Claim(ClaimTypes.Name, "service")], SchemeName);
        return Task.FromResult(AuthenticateResult.Success(
            new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName)));
    }
}
