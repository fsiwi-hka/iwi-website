namespace IWI_Backend.Api.Entities;

/// <summary>
/// Angemeldete Backrooms-Sitzung. Gespeichert wird nur der SHA-256 des
/// Tokens, nie das Token selbst.
/// </summary>
public class BackroomsSessionEntity
{
    public string TokenHash { get; set; } = "";
    public string UserId { get; set; } = "";
    public string Username { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string? Email { get; set; }
    public List<string> Roles { get; set; } = [];
    public DateTimeOffset Created { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
}
