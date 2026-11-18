using System.ComponentModel.DataAnnotations;

namespace IWI_Backend.Api.Models.Backrooms;

public class CredentialsDto
{
    [Required, MaxLength(200)] public string Username { get; set; } = "";
    [Required, MaxLength(500)] public string Password { get; set; } = "";
}

public class BackroomsUserDto
{
    public string Id { get; set; } = "";
    public string Username { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string? Email { get; set; }
    /// <summary>admin und/oder editor.</summary>
    public List<string> Roles { get; set; } = [];
}

public class SessionDto
{
    /// <summary>Bearer-Token fuer den Authorization-Header.</summary>
    public string Token { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
    public BackroomsUserDto User { get; set; } = new();
}
