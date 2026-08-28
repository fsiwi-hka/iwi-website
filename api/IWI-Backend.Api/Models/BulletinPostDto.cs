using System.Globalization;
using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;

public class BulletinPostDto : IBulletinBase
{
    
    public string Title { get; set; } = "";
    public string Type { get; set; } = "";

    public string Content { get; set; } = "";
    
    public int Id { get; set; }
    public string Creator { get; set; } = "";

    public IEnumerable<string> CoursesOfStudy { get; set; } = [];
    public IEnumerable<string> Departments { get; set; } = [];
    
    public DateTimeOffset PublicationTimestamp { set; get; }
}

public interface IBulletinBase
{
    public string Content { get; set; }
    public IEnumerable<string> CoursesOfStudy { get; set; }
    public string Creator { get; set; }
    public IEnumerable<string> Departments { get; set; }
    public int Id { get; set; }
    public DateTimeOffset PublicationTimestamp { get; }
    public string Title { get; set; }
    public string Type { get; set; }
}

public class BulletinPostEntity : IBulletinBase
{
    public record AttachedFiles(int Id, string Name, string Type, string Url);

    public string Content { get; set; } = "";
    public IEnumerable<string> CoursesOfStudy { get; set; } = [];
    public string Creator { get; set; } = "";
    public IEnumerable<string> Departments { get; set; } = [];
    public int Id { get; set; }
    
    public string Title { get; set; } = "";
    public string Type { get; set; } = "";

    [JsonPropertyName("expirationDate")]
    public string ExpirationDateRaw { get; set; } = "";

    [JsonPropertyName("publicationTimestamp")]
    public string PublicationTimestampRaw { get; set; } = "";

    [JsonIgnore]
    public DateOnly ExpirationDate =>
        DateOnly.ParseExact(ExpirationDateRaw, "yyyy-MM-dd", CultureInfo.InvariantCulture);
    
    [JsonIgnore]
    public DateTimeOffset PublicationTimestamp =>
        DateTimeOffset.TryParseExact(
            PublicationTimestampRaw,
            "yyyy-MM-dd HH:mm:ss.fff",
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal,
            out var dt)
            ? dt
            : DateTimeOffset.MinValue;
}