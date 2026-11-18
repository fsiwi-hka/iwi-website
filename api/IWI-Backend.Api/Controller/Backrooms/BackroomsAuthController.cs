using System.Security.Claims;
using System.Security.Cryptography;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using IWI_Backend.Api.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Anmeldung an den Backrooms (Vertrag: backrooms/src/app/core/api/http/http-auth-api.ts).
/// Zugangsdaten prueft die Nextcloud, danach gilt ein eigenes Session-Token.
/// </summary>
[ApiController]
[Route("/api/backrooms/auth")]
public class BackroomsAuthController(
    CoreContext db,
    NextcloudAuthenticator nextcloud,
    IOptions<BackroomsAuthOptions> options,
    ILogger<BackroomsAuthController> log) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimits.Login)]
    public async Task<ActionResult<SessionDto>> Login(CredentialsDto credentials, CancellationToken ct)
    {
        NextcloudUser? user;
        try
        {
            user = await nextcloud.VerifyAsync(credentials.Username.Trim(), credentials.Password, ct);
        }
        catch (Exception e) when (e is HttpRequestException or TaskCanceledException or KeyNotFoundException
                                       or System.Text.Json.JsonException)
        {
            log.LogWarning(e, "Nextcloud fuer die Backrooms-Anmeldung nicht erreichbar");
            return StatusCode(StatusCodes.Status502BadGateway, new { error = "Die Nextcloud ist gerade nicht erreichbar." });
        }

        if (user is null)
            return Unauthorized(new { error = "Benutzername oder Passwort ist falsch." });

        var roles = RolesFor(user.Groups);
        if (roles.Count == 0)
            return StatusCode(StatusCodes.Status403Forbidden,
                new { error = "Dein Nextcloud-Konto hat keinen Zugriff auf die Backrooms." });

        var now = DateTimeOffset.UtcNow;
        await db.BackroomsSessions.Where(s => s.ExpiresAt < now).ExecuteDeleteAsync(ct);

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        var session = new BackroomsSessionEntity
        {
            TokenHash = SessionTokens.Hash(token),
            UserId = user.Id,
            Username = credentials.Username.Trim(),
            DisplayName = user.DisplayName,
            Email = user.Email,
            Roles = roles,
            Created = now,
            ExpiresAt = now.AddHours(options.Value.SessionHours),
        };
        db.BackroomsSessions.Add(session);
        await db.SaveChangesAsync(ct);

        return new SessionDto { Token = token, ExpiresAt = session.ExpiresAt, User = ToUser(session) };
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (User.FindFirstValue(SessionTokens.HashClaim) is { } hash)
            await db.BackroomsSessions.Where(s => s.TokenHash == hash).ExecuteDeleteAsync(ct);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<BackroomsUserDto> Me() => new BackroomsUserDto
    {
        Id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "",
        Username = User.Identity?.Name ?? "",
        DisplayName = User.FindFirstValue(SessionTokens.DisplayNameClaim) ?? User.Identity?.Name ?? "",
        Email = User.FindFirstValue(ClaimTypes.Email),
        Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList(),
    };

    private List<string> RolesFor(IReadOnlyList<string> groups)
    {
        var opts = options.Value;
        bool InAny(List<string> wanted) => groups.Any(g => wanted.Contains(g, StringComparer.OrdinalIgnoreCase));

        if (InAny(opts.AdminGroups)) return [BackroomsRoles.Admin, BackroomsRoles.Editor];
        if (InAny(opts.EditorGroups)) return [BackroomsRoles.Editor];
        return [];
    }

    private static BackroomsUserDto ToUser(BackroomsSessionEntity s) => new()
    {
        Id = s.UserId,
        Username = s.Username,
        DisplayName = s.DisplayName,
        Email = s.Email,
        Roles = s.Roles,
    };
}
