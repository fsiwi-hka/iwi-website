using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;


public class Zeitraum
{
    // Nullable, damit ein fehlender Wert als null rausgeht. DateOnly.MinValue
    // wuerde als "0001-01-01" serialisiert und im Frontend als "1.1.1" landen.
    [JsonPropertyName("beginn")]
    public DateOnly? Beginn { get; set; }

    [JsonPropertyName("ende")]
    public DateOnly? Ende { get; set; }
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
    
    // Null, solange kein Cache existiert - sonst serialisiert DateOnly.MinValue als
    // "0001-01-01" und das Frontend zeigt "1.1.1" statt eines Platzhalters an.
    public DateOnly? ChangedAt { get; set; }

    /* Semester kommt als "SS26" / "WS26" aus der info.json. Fehlt die Datei oder
     * der Schluessel, ist der String leer - deshalb wird hier nicht blind
     * gesubstringt. Ein Substring auf "" hat beim Serialisieren die ganze
     * Response mit einer ArgumentOutOfRangeException abgerissen. */
    public string SemesterName => Semester.Length < 2
        ? string.Empty
        : Semester.StartsWith("SS", StringComparison.OrdinalIgnoreCase)
            ? "Sommersemester"
            : Semester.StartsWith("WS", StringComparison.OrdinalIgnoreCase)
                ? "Wintersemester"
                : string.Empty;

    public string SemesterYear => Semester.Length > 2 ? Semester[2..] : string.Empty;
}