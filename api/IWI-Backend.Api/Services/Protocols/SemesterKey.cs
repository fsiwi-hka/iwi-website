using System.Text.RegularExpressions;

namespace IWI_Backend.Api.Services.Protocols;

/// <summary>
/// Semester-Ordner der Protokolle im WebDAV ("25WS", "26SS"; toleriert auch
/// "WS2025") und ihre Anzeigeform in den Backrooms ("WS 2025/26", "SS 2026").
/// </summary>
public static partial class SemesterKey
{
    private sealed record Parts(int Year, bool Winter);

    [GeneratedRegex(@"^(?:(\d{2}|\d{4})\s*(WS|SS)|(WS|SS)\s*(\d{2}|\d{4}))$", RegexOptions.IgnoreCase)]
    private static partial Regex KeyPattern();

    [GeneratedRegex(@"^(?:WS (\d{4})/\d{2}|SS (\d{4}))$")]
    private static partial Regex LabelPattern();

    private static Parts? Parse(string key)
    {
        var m = KeyPattern().Match(key.Trim());
        if (!m.Success) return null;
        var digits = m.Groups[1].Success ? m.Groups[1].Value : m.Groups[4].Value;
        var term = m.Groups[2].Success ? m.Groups[2].Value : m.Groups[3].Value;
        var year = int.Parse(digits);
        return new Parts(year < 100 ? 2000 + year : year, term.Equals("WS", StringComparison.OrdinalIgnoreCase));
    }

    /// <summary>Neuestes Semester hat den groessten Wert; Unbekanntes landet am Ende.</summary>
    public static int SortKey(string key) =>
        Parse(key) is { } p ? p.Year * 2 + (p.Winter ? 1 : 0) : int.MinValue;

    /// <summary>"25WS" -> "WS 2025/26". Unbekannte Ordnernamen bleiben, wie sie sind.</summary>
    public static string ToLabel(string key) =>
        Parse(key) is { } p
            ? p.Winter ? $"WS {p.Year}/{(p.Year + 1) % 100:00}" : $"SS {p.Year}"
            : key;

    /// <summary>
    /// "WS 2025/26" -> Ordnername. Gibt es das Semester schon, wird dessen Ordner
    /// genommen; sonst wird die Schreibweise der vorhandenen Ordner uebernommen
    /// (Standard "25WS"). Ein vorhandener Ordnername wird direkt akzeptiert.
    /// </summary>
    public static string? ToKey(string label, IReadOnlyCollection<string> existing)
    {
        label = label.Trim();
        var direct = existing.FirstOrDefault(k => k == label || ToLabel(k) == label);
        if (direct is not null) return direct;

        var m = LabelPattern().Match(label);
        if (!m.Success) return null;
        var winter = m.Groups[1].Success;
        var year = int.Parse(winter ? m.Groups[1].Value : m.Groups[2].Value);
        var term = winter ? "WS" : "SS";

        var sample = existing.Where(k => Parse(k) is not null).OrderByDescending(SortKey).FirstOrDefault();
        if (sample is null) return $"{year % 100:00}{term}";

        var termFirst = char.IsLetter(sample[0]);
        var fourDigits = sample.Count(char.IsDigit) == 4;
        var yearText = fourDigits ? $"{year}" : $"{year % 100:00}";
        return termFirst ? $"{term}{yearText}" : $"{yearText}{term}";
    }
}
