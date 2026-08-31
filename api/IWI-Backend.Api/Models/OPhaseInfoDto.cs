using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;


public class Zeitraum
{
    [JsonPropertyName("beginn")]
    public DateOnly Beginn { get; set; }

    [JsonPropertyName("ende")]
    public DateOnly Ende { get; set; }
}

public class Vorkurse
{
    [JsonPropertyName("mathe")]
    public Zeitraum Mathe { get; set; } = new();

    [JsonPropertyName("programmieren")]
    public Zeitraum Programmieren { get; set; } = new();
}

public class OPhaseInfoDto
{
    [JsonPropertyName("semester")]
    public string Semester { get; set; } = string.Empty;

    [JsonPropertyName("vorkurse")]
    public Vorkurse Vorkurse { get; set; } = new();

    [JsonPropertyName("orientierungsphase")]
    public Zeitraum Orientierungsphase { get; set; } = new();

    [JsonPropertyName("vorlesungszeit")]
    public Zeitraum Vorlesungszeit { get; set; } = new();
    
    public DateOnly ChangedAt { get; set; } = DateOnly.MinValue;
    
    public string SemesterName => Semester.Substring(0, 2) == "SS" ? "Sommersemester" : "Wintersemester";
    
    public string SemesterYear => Semester.Substring(2);
}