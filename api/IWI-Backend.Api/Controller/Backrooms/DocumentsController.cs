using System.Text.Json;
using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using IWI_Backend.Api.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Einzel-Dokumente der Backrooms (GET/PUT /api/backrooms/documents/{key}).
/// Gespeichert wird JSON, die Struktur geben die typisierten DTOs vor. Fehlt
/// ein Dokument noch, kommt ein leeres zurueck statt 404, damit das
/// Formular im Frontend direkt befuellt werden kann.
/// </summary>
[ApiController]
[Route("/api/backrooms/documents")]
[Authorize]
public class DocumentsController(CoreContext db) : ControllerBase
{
    private const string SemesterDatesKey = "semester-dates";
    private const string SiteSettingsKey = "site-settings";

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    [HttpGet(SemesterDatesKey)]
    [AllowAnonymous]
    public async Task<ActionResult<SemesterDatesDto>> GetSemesterDates(CancellationToken ct) =>
        await Load<SemesterDatesDto>(SemesterDatesKey, ct);

    [HttpPut(SemesterDatesKey)]
    public async Task<ActionResult<SemesterDatesDto>> SaveSemesterDates(SemesterDatesDto request, CancellationToken ct)
    {
        foreach (var (range, label) in new[]
                 {
                     (request.Vorkurse.Mathe, "Vorkurs Mathe"),
                     (request.Vorkurse.Programmieren, "Vorkurs Programmieren"),
                     (request.Orientierungsphase, "Orientierungsphase"),
                     (request.Vorlesungszeit, "Vorlesungszeit"),
                 })
        {
            if (range is { Beginn: { } from, Ende: { } to } && to < from)
                return BadRequest(new { error = $"{label}: Ende liegt vor Beginn." });
        }

        request.ChangedAt = DateTimeOffset.UtcNow;
        await Store(SemesterDatesKey, request, ct);
        return request;
    }

    [HttpGet(SiteSettingsKey)]
    [AllowAnonymous]
    public async Task<ActionResult<SiteSettingsDto>> GetSiteSettings(CancellationToken ct) =>
        await Load<SiteSettingsDto>(SiteSettingsKey, ct);

    /// <summary>Nur fuer Admins (Rolle <c>admin</c>).</summary>
    [HttpPut(SiteSettingsKey)]
    [Authorize(Roles = BackroomsRoles.Admin)]
    public async Task<ActionResult<SiteSettingsDto>> SaveSiteSettings(SiteSettingsDto request, CancellationToken ct)
    {
        var error = Validation.Mail(request.ContactMail, "Kontakt-Mail")
                    ?? Validation.Mail(request.SponsoringMail, "Sponsoring-Mail")
                    ?? Validation.Mail(request.AssociationMail, "Foerderverein-Mail")
                    ?? Validation.HttpUrl(request.DiscordUrl, "Discord-Link")
                    ?? Validation.HttpUrl(request.InstagramUrl, "Instagram-Link");
        if (error is not null) return BadRequest(new { error });

        await Store(SiteSettingsKey, request, ct);
        return request;
    }

    private async Task<T> Load<T>(string key, CancellationToken ct) where T : new()
    {
        var doc = await db.Documents.FindAsync([key], ct);
        return doc is null ? new T() : JsonSerializer.Deserialize<T>(doc.Json, Json) ?? new T();
    }

    private async Task Store<T>(string key, T value, CancellationToken ct)
    {
        var doc = await db.Documents.FindAsync([key], ct);
        if (doc is null)
        {
            doc = new DocumentEntity { Key = key };
            db.Documents.Add(doc);
        }

        doc.Json = JsonSerializer.Serialize(value, Json);
        doc.Modified = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}
