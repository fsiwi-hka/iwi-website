using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using IWI_Backend.Api.Database;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.Auth;

public sealed class FixedTokenOptions : AuthenticationSchemeOptions
{
    /// <summary>Fester Token aus der Konfiguration (Auth:Token bzw. Auth__Token).</summary>
    public string Token { get; set; } = "";
}

/// <summary>
/// Prueft "Authorization: Bearer &lt;token&gt;". Zwei Arten von Tokens:
/// <list type="bullet">
/// <item>der fest konfigurierte Service-Token (Auth:Token) fuer Automationen;
/// er hat alle Rollen. Ohne konfigurierten Wert gilt er nie - ein leeres
/// Secret darf nicht "alles erlaubt" bedeuten.</item>
/// <item>Session-Tokens aus der Backrooms-Anmeldung (Tabelle BackroomsSessions,
/// gespeichert als SHA-256).</item>
/// </list>
/// </summary>
public sealed class FixedTokenHandler(
    IOptionsMonitor<FixedTokenOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    CoreContext db)
    : AuthenticationHandler<FixedTokenOptions>(options, logger, encoder)
{
    public const string SchemeName = "Bearer";

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!AuthenticationHeaderValue.TryParse(Request.Headers.Authorization, out var header)
            || !SchemeName.Equals(header.Scheme, StringComparison.OrdinalIgnoreCase)
            || string.IsNullOrEmpty(header.Parameter))
            return AuthenticateResult.NoResult();

        var token = header.Parameter;

        if (!string.IsNullOrWhiteSpace(Options.Token)
            && CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(token), Encoding.UTF8.GetBytes(Options.Token)))
        {
            return Success(
                new Claim(ClaimTypes.Name, "service"),
                new Claim(ClaimTypes.NameIdentifier, "service"),
                new Claim(ClaimTypes.Role, BackroomsRoles.Admin),
                new Claim(ClaimTypes.Role, BackroomsRoles.Editor));
        }

        var hash = SessionTokens.Hash(token);
        var now = DateTimeOffset.UtcNow;
        var session = await db.BackroomsSessions.AsNoTracking()
            .FirstOrDefaultAsync(s => s.TokenHash == hash, Context.RequestAborted);
        if (session is null || session.ExpiresAt <= now)
            return AuthenticateResult.Fail("Ungueltiges oder abgelaufenes Token.");

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, session.Username),
            new(ClaimTypes.NameIdentifier, session.UserId),
            new(SessionTokens.DisplayNameClaim, session.DisplayName),
            new(SessionTokens.HashClaim, hash),
        };
        if (session.Email is { } email) claims.Add(new Claim(ClaimTypes.Email, email));
        claims.AddRange(session.Roles.Select(r => new Claim(ClaimTypes.Role, r)));
        return Success(claims.ToArray());
    }

    private static AuthenticateResult Success(params Claim[] claims) =>
        AuthenticateResult.Success(new AuthenticationTicket(
            new ClaimsPrincipal(new ClaimsIdentity(claims, SchemeName)), SchemeName));
}
