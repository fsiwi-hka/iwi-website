namespace IWI_Backend.Api.Controller.Backrooms;

internal static class Validation
{
    /// <summary>Leer ist erlaubt, sonst muss es eine absolute http(s)-URL sein.</summary>
    public static string? HttpUrl(string value, string field) =>
        string.IsNullOrWhiteSpace(value)
        || (Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https")
            ? null
            : $"{field} muss eine http(s)-Adresse sein.";

    /// <summary>Leer ist erlaubt, sonst eine plausible Mailadresse.</summary>
    public static string? Mail(string value, string field) =>
        string.IsNullOrWhiteSpace(value)
        || System.Net.Mail.MailAddress.TryCreate(value, out var mail) && mail.Address == value.Trim()
            ? null
            : $"{field} ist keine gueltige Mailadresse.";
}
