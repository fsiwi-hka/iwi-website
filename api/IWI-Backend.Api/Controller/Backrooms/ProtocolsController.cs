using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Sitzungsprotokolle, die in den Backrooms gepflegt werden. Getrennt vom
/// Nextcloud-Spiegel unter /api/protocols, der bis zur Umstellung weiterlaeuft.
/// </summary>
[Route("/api/backrooms/content/protocols")]
public class BackroomsProtocolsController(CoreContext db)
    : ContentCrudController<ProtocolEntity, ProtocolDto, ProtocolUpsertDto>(db)
{
    /// <summary>Neueste Sitzung zuerst, Eintraege ohne Datum am Ende.</summary>
    protected override IEnumerable<ProtocolEntity> SortUnordered(IEnumerable<ProtocolEntity> items) =>
        items.OrderByDescending(p => p.MeetingDate.HasValue).ThenByDescending(p => p.MeetingDate)
            .ThenByDescending(p => p.Created);

    protected override ProtocolDto ToDto(ProtocolEntity e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Semester = e.Semester,
        MeetingDate = e.MeetingDate,
        File = e.File,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(ProtocolEntity e, ProtocolUpsertDto r)
    {
        e.Title = r.Title.Trim();
        e.Semester = r.Semester.Trim();
        e.MeetingDate = r.MeetingDate;
        e.File = r.File;
    }

    protected override Task<string?> ValidateAsync(ProtocolUpsertDto r, Guid? id, CancellationToken ct) =>
        Task.FromResult(r.File is { } file && file.ContentType != "application/pdf"
            ? "Protokolle muessen PDF-Dateien sein."
            : null);
}
