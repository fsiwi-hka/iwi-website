using System.Text.Json.Serialization;

namespace IwiDisplayBackend.Models;

/// <summary>
/// Entspricht dem Format der config.json im WebDAV-Ordner.
/// </summary>
public sealed class MediaConfig
{
    [JsonPropertyName("files")]
    public List<MediaEntry> Files { get; set; } = new();
}

public sealed class MediaEntry
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("duration")]
    public int Duration { get; set; } = 30;

    [JsonPropertyName("upload_date")]
    public string? UploadDate { get; set; }

    [JsonPropertyName("active")]
    public bool Active { get; set; } = true;
}

/// <summary>
/// Wird vom Frontend konsumiert: { type, src, duration, alt }.
/// </summary>
public sealed record SlideDto(string Type, string Src, int Duration, string Alt);
