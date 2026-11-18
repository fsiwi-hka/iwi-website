using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using IWI_Backend.Api.Entities;

namespace IWI_Backend.Api.Models.Backrooms;

// DTOs der Backrooms-Inhalte. Feldnamen = backrooms/src/app/shared/models/.
// "Upsert" ist der Body von POST und PUT (ohne id/updatedAt).

public class HeroSlideDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public MediaRef? Image { get; set; }
    public bool ImageOverlay { get; set; }
    public string ButtonText { get; set; } = "";
    public string ButtonLink { get; set; } = "";
    public bool Active { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class HeroSlideUpsertDto
{
    [Required, MaxLength(120)] public string Title { get; set; } = "";
    [MaxLength(240)] public string Subtitle { get; set; } = "";
    public MediaRef? Image { get; set; }
    public bool ImageOverlay { get; set; } = true;
    [MaxLength(60)] public string ButtonText { get; set; } = "";
    [MaxLength(500)] public string ButtonLink { get; set; } = "";
    public bool Active { get; set; } = true;
    public int Order { get; set; }
}

public class DepartmentDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = "";
    public Guid? LeadPositionId { get; set; }
    public List<string> Tasks { get; set; } = [];
    public DateTimeOffset UpdatedAt { get; set; }
}

public class DepartmentUpsertDto
{
    [Required, MaxLength(60)] public string Name { get; set; } = "";
    public Guid? LeadPositionId { get; set; }
    [MinLength(1)] public List<string> Tasks { get; set; } = [];
    public int Order { get; set; }
}

public class SponsorDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = "";
    public MediaRef? Logo { get; set; }
    public int Width { get; set; }
    public string Website { get; set; } = "";
    public bool Active { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class SponsorUpsertDto
{
    [Required, MaxLength(80)] public string Name { get; set; } = "";
    public MediaRef? Logo { get; set; }
    [Range(16, 600)] public int Width { get; set; } = 120;
    [MaxLength(500)] public string Website { get; set; } = "";
    public bool Active { get; set; } = true;
    public int Order { get; set; }
}

public class ProtocolDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Semester { get; set; } = "";
    /// <summary>YYYY-MM-DD oder null.</summary>
    public DateOnly? MeetingDate { get; set; }
    public MediaRef? File { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class ProtocolUpsertDto
{
    [Required, MaxLength(120)] public string Title { get; set; } = "";
    [MaxLength(20)] public string Semester { get; set; } = "";
    public DateOnly? MeetingDate { get; set; }
    public MediaRef? File { get; set; }
}

public class InfoscreenSlideDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = "";
    /// <summary>image oder video.</summary>
    public string Type { get; set; } = "";
    public MediaRef? Media { get; set; }
    public int DurationSeconds { get; set; }
    public bool Active { get; set; }
    public DateTimeOffset UploadedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class InfoscreenSlideUpsertDto
{
    [Required, MaxLength(120)] public string Name { get; set; } = "";
    [Required, MaxLength(10)] public string Type { get; set; } = InfoscreenSlideTypes.Image;
    public MediaRef? Media { get; set; }
    [Range(1, 3600)] public int DurationSeconds { get; set; } = 30;
    public bool Active { get; set; } = true;
    /// <summary>Leer/null: Zeitpunkt des Speicherns.</summary>
    public DateTimeOffset? UploadedAt { get; set; }
    public int Order { get; set; }
}

public class ContentPageDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    /// <summary>Markdown.</summary>
    public string Body { get; set; } = "";
    public DateTimeOffset UpdatedAt { get; set; }
}

public class ContentPageUpsertDto
{
    [Required, MaxLength(60), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Slug { get; set; } = "";
    [Required, MaxLength(120)] public string Title { get; set; } = "";
    [MaxLength(100_000)] public string Body { get; set; } = "";
}

// ---- Einzel-Dokumente ----

/// <summary>Datumsbereich; YYYY-MM-DD, null = nicht gesetzt.</summary>
public class DateRangeDto
{
    public DateOnly? Beginn { get; set; }
    public DateOnly? Ende { get; set; }
}

public class PreCoursesDto
{
    public DateRangeDto Mathe { get; set; } = new();
    public DateRangeDto Programmieren { get; set; } = new();
}

/// <summary>Stundenplaene der O-Phase je Studiengang (Schluessel wie im Frontend: I, WI).</summary>
public class TimetablesDto
{
    [JsonPropertyName("I")] public MediaRef? I { get; set; }
    [JsonPropertyName("WI")] public MediaRef? WI { get; set; }
}

/// <summary>Semestertermine. Feldnamen wie bisher in info.json / OPhaseInfoDto.</summary>
public class SemesterDatesDto
{
    /// <summary>Kurzform wie "WS26" oder "SS27".</summary>
    [MaxLength(10)] public string Semester { get; set; } = "";
    public PreCoursesDto Vorkurse { get; set; } = new();
    public DateRangeDto Orientierungsphase { get; set; } = new();
    public DateRangeDto Vorlesungszeit { get; set; } = new();
    public TimetablesDto Timetables { get; set; } = new();
    /// <summary>Setzt das Backend beim Speichern.</summary>
    public DateTimeOffset? ChangedAt { get; set; }
}

/// <summary>Globale Texte und Links der Website.</summary>
public class SiteSettingsDto
{
    [MaxLength(200)] public string ContactMail { get; set; } = "";
    [MaxLength(200)] public string SponsoringMail { get; set; } = "";
    [MaxLength(200)] public string AssociationMail { get; set; } = "";
    [MaxLength(500)] public string DiscordUrl { get; set; } = "";
    [MaxLength(500)] public string InstagramUrl { get; set; } = "";
    [MaxLength(500)] public string MeetingInfo { get; set; } = "";
}
