using System.Globalization;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;
using IWI_Backend.Api.Models;

namespace IWI_Backend.Api.Services.Calendar;

/// <summary>
/// Reine Verarbeitung ohne IO: filtert nicht-öffentliche Events heraus und löst
/// Serientermine in einzelne Instanzen auf. Bewusst getrennt vom Sync, damit sich
/// die Logik mit einer festen ICS-Datei testen lässt.
/// </summary>
public static class CalendarProcessor
{
    private static readonly HashSet<string> HiddenClasses = new(StringComparer.OrdinalIgnoreCase)
        { "PRIVATE", "CONFIDENTIAL" };

    public static List<CalendarEventDto> Process(string ics, DateTime windowStartUtc, DateTime windowEndUtc,
        TimeZoneInfo tz)
    {
        var calendar = Ical.Net.Calendar.Load(ics) ?? throw new FormatException("ICS konnte nicht geparst werden.");

        RemoveHiddenEvents(calendar);
        return Expand(calendar, windowStartUtc, windowEndUtc, tz);
    }

    /// <summary>
    /// Entfernt private/vertrauliche Events. Ist die Serie privat, fliegen auch ihre
    /// Overrides (gleiche UID mit RECURRENCE-ID) raus, selbst wenn dort CLASS fehlt.
    /// </summary>
    private static void RemoveHiddenEvents(Ical.Net.Calendar calendar)
    {
        var hiddenUids = calendar.Events
            .Where(e => e.Class != null && HiddenClasses.Contains(e.Class))
            .Select(e => e.Uid)
            .Where(uid => uid != null)
            .ToHashSet(StringComparer.Ordinal);

        var toRemove = calendar.Events
            .Where(e => (e.Class != null && HiddenClasses.Contains(e.Class)) ||
                        (e.Uid != null && hiddenUids.Contains(e.Uid)))
            .ToList();

        foreach (var ev in toRemove)
            calendar.Events.Remove(ev);
    }

    private static List<CalendarEventDto> Expand(Ical.Net.Calendar calendar, DateTime windowStartUtc,
        DateTime windowEndUtc, TimeZoneInfo tz)
    {
        // Start eine Woche früher abfragen, damit mehrtägige Events, die vor dem
        // Fenster beginnen und hineinragen, nicht verloren gehen.
        var queryStart = new CalDateTime(windowStartUtc.AddDays(-7), CalDateTime.UtcTzId);

        var result = new List<CalendarEventDto>();
        foreach (var occ in calendar.GetOccurrences<CalendarEvent>(queryStart))
        {
            var start = occ.Period.StartTime;
            if (ToUtc(start, tz) >= windowEndUtc) break; // Occurrences kommen sortiert

            if (occ.Source is not CalendarEvent ev) continue;
            if (string.Equals(ev.Status, "CANCELLED", StringComparison.OrdinalIgnoreCase)) continue;

            var dto = ToDto(ev, start, occ.Period.EffectiveEndTime, tz);
            if (dto.EndUtc <= windowStartUtc) continue;

            result.Add(dto);
        }

        return result
            .OrderBy(e => e.StartUtc)
            .ThenBy(e => e.Title, StringComparer.CurrentCulture)
            .ToList();
    }

    private static CalendarEventDto ToDto(CalendarEvent ev, CalDateTime start, CalDateTime? end, TimeZoneInfo tz)
    {
        var allDay = !start.HasTime;
        var dto = new CalendarEventDto
        {
            Uid = ev.Uid ?? "",
            Title = string.IsNullOrWhiteSpace(ev.Summary) ? "(ohne Titel)" : ev.Summary.Trim(),
            AllDay = allDay,
            Location = NullIfEmpty(ev.Location),
            Description = NullIfEmpty(ev.Description),
            Url = ev.Url?.ToString()
        };

        if (allDay)
        {
            var startDate = start.Date;
            // Ohne DTEND dauert ein ganztägiges Event genau einen Tag (RFC 5545).
            var endDate = end is { } e && e.Date > startDate ? e.Date : startDate.AddDays(1);

            dto.Start = startDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            dto.End = endDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            dto.StartUtc = DateOnlyToUtc(startDate, tz);
            dto.EndUtc = DateOnlyToUtc(endDate, tz);
        }
        else
        {
            var startUtc = ToUtc(start, tz);
            var endUtc = end is { HasTime: true } e ? ToUtc(e, tz) : startUtc;
            if (endUtc < startUtc) endUtc = startUtc;

            dto.Start = FormatLocal(startUtc, tz);
            dto.End = FormatLocal(endUtc, tz);
            dto.StartUtc = startUtc;
            dto.EndUtc = endUtc;
        }

        dto.Id = $"{dto.Uid}_{dto.StartUtc:yyyyMMdd'T'HHmmss'Z'}";
        return dto;
    }

    /// <summary>Floating Times (ohne TZID) werden als Ortszeit in <paramref name="tz"/> gelesen.</summary>
    private static DateTime ToUtc(CalDateTime dt, TimeZoneInfo tz)
    {
        if (!dt.HasTime) return DateOnlyToUtc(dt.Date, tz);
        if (dt.IsFloating)
            return TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(dt.Value, DateTimeKind.Unspecified), tz);
        return dt.AsUtc;
    }

    private static DateTime DateOnlyToUtc(DateOnly date, TimeZoneInfo tz) =>
        TimeZoneInfo.ConvertTimeToUtc(date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), tz);

    private static string FormatLocal(DateTime utc, TimeZoneInfo tz)
    {
        var local = TimeZoneInfo.ConvertTimeFromUtc(utc, tz);
        return new DateTimeOffset(local, tz.GetUtcOffset(utc)).ToString("yyyy-MM-dd'T'HH:mm:sszzz",
            CultureInfo.InvariantCulture);
    }

    private static string? NullIfEmpty(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();

    /// <summary>Berechnet StartUtc/EndUtc neu, z. B. nach dem Laden aus dem JSON-Cache.</summary>
    public static void RestoreUtc(CalendarEventDto dto, TimeZoneInfo tz)
    {
        if (dto.AllDay)
        {
            dto.StartUtc = DateOnlyToUtc(DateOnly.ParseExact(dto.Start, "yyyy-MM-dd", CultureInfo.InvariantCulture), tz);
            dto.EndUtc = DateOnlyToUtc(DateOnly.ParseExact(dto.End, "yyyy-MM-dd", CultureInfo.InvariantCulture), tz);
        }
        else
        {
            dto.StartUtc = DateTimeOffset.Parse(dto.Start, CultureInfo.InvariantCulture).UtcDateTime;
            dto.EndUtc = DateTimeOffset.Parse(dto.End, CultureInfo.InvariantCulture).UtcDateTime;
        }
    }

    /// <summary>Baut einen einzelnen Termin als eigenständige ICS-Datei („Zu meinem Kalender hinzufügen“).</summary>
    public static string BuildSingleEventIcs(CalendarEventDto dto, TimeZoneInfo tz, string calendarName)
    {
        var calendar = new Ical.Net.Calendar { ProductId = $"-//{calendarName}//Website//DE" };
        var ev = new CalendarEvent
        {
            Uid = dto.Id,
            Summary = dto.Title,
            Location = dto.Location,
            Description = dto.Description,
            Url = dto.Url != null && Uri.TryCreate(dto.Url, UriKind.Absolute, out var u) ? u : null,
            DtStamp = new CalDateTime(DateTime.UtcNow, CalDateTime.UtcTzId)
        };

        if (dto.AllDay)
        {
            ev.DtStart = new CalDateTime(DateOnly.ParseExact(dto.Start, "yyyy-MM-dd", CultureInfo.InvariantCulture));
            ev.DtEnd = new CalDateTime(DateOnly.ParseExact(dto.End, "yyyy-MM-dd", CultureInfo.InvariantCulture));
        }
        else
        {
            ev.DtStart = new CalDateTime(dto.StartUtc, CalDateTime.UtcTzId);
            ev.DtEnd = new CalDateTime(dto.EndUtc, CalDateTime.UtcTzId);
        }

        calendar.Events.Add(ev);
        return new CalendarSerializer().SerializeToString(calendar) ?? "";
    }
}
