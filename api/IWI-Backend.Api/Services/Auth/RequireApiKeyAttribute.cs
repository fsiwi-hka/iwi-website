using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace IWI_Backend.Api.Services.Auth;

/// <summary>Prüft X-Api-Key und legt die Absender-Info in HttpContext.Items["key"] ab.</summary>
public sealed class RequireApiKeyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext ctx)
    {
        var secret = ctx.HttpContext.RequestServices
            .GetRequiredService<IConfiguration>()["Board:Secret"] ?? "";

        if (ApiKey.TryRead(ctx.HttpContext.Request.Headers["X-Api-Key"], secret, out var info))
            ctx.HttpContext.Items["key"] = info;
        else
            ctx.Result = new UnauthorizedResult();
    }
}

/// <summary>
/// API-Key im Format base64url(info).base64url(hmac). Die Info steht lesbar im
/// Key (signiert, nicht verschlüsselt) – also nichts Geheimes hineinschreiben.
/// </summary>
public static class ApiKey
{
    public static string Create(string info, string secret) =>
        B64(Encoding.UTF8.GetBytes(info)) is var body
            ? body + "." + B64(Sign(body, secret))
            : throw new UnreachableException();

    public static bool TryRead(string? key, string secret, out string info)
    {
        info = "";
        if (string.IsNullOrEmpty(key) || string.IsNullOrWhiteSpace(secret)) return false;

        var parts = key.Split('.');
        if (parts.Length != 2) return false;

        try
        {
            if (!CryptographicOperations.FixedTimeEquals(UnB64(parts[1]), Sign(parts[0], secret)))
                return false;
            info = Encoding.UTF8.GetString(UnB64(parts[0]));
            return true;
        }
        catch (FormatException) { return false; }
    }

    private static byte[] Sign(string body, string secret) =>
        HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(body));

    private static string B64(byte[] d) =>
        Convert.ToBase64String(d).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] UnB64(string s)
    {
        s = s.Replace('-', '+').Replace('_', '/');
        return Convert.FromBase64String(s.PadRight((s.Length + 3) / 4 * 4, '='));
    }
}