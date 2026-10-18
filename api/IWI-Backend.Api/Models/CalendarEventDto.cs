using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;

public sealed class CalendarEventDto
{
    /// <summary>UID + Instanz-Start (UTC). Eindeutig pro Instanz eines Serientermins.</summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("uid")]
    public string Uid { get; set; } = "";

    [JsonPropertyName("title")]
    public string Title { get; set; } = "";

    /// <summary>ISO 8601 mit Offset, bei ganztägigen Events reines Datum (yyyy-MM-dd).</summary>
    [JsonPropertyName("start")]
    public string Start { get; set; } = "";

    /// <summary>Wie Start. Bei ganztägigen Events exklusiv (wie in iCal).</summary>
    [JsonPropertyName("end")]
    public string End { get; set; } = "";

    [JsonPropertyName("allDay")]
    public bool AllDay { get; set; }

    /// <summary>Instanz eines Serientermins (z. B. die wöchentliche FS-Sitzung).</summary>
    [JsonPropertyName("recurring")]
    public bool Recurring { get; set; }

    [JsonPropertyName("location")]
    public string? Location { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    /// <summary>Start/Ende in UTC fürs Filtern im Backend, geht nicht ans Frontend.</summary>
    [JsonIgnore]
    public DateTime StartUtc { get; set; }

    [JsonIgnore]
    public DateTime EndUtc { get; set; }
}
