using System.Security.Cryptography;
using System.Text;

namespace IWI_Backend.Api.Services.Auth;

public static class SessionTokens
{
    public const string HashClaim = "backrooms:session";
    public const string DisplayNameClaim = "backrooms:display-name";

    public static string Hash(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}

public static class RateLimits
{
    public const string Login = "backrooms-login";
}
