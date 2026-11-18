using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

[Route("/api/backrooms/content/infoscreen-slides")]
public class InfoscreenSlidesController(CoreContext db)
    : ContentCrudController<InfoscreenSlideEntity, InfoscreenSlideDto, InfoscreenSlideUpsertDto>(db)
{
    protected override InfoscreenSlideDto ToDto(InfoscreenSlideEntity e) => new()
    {
        Id = e.Id,
        Order = e.Order,
        Name = e.Name,
        Type = e.Type,
        Media = e.Media,
        DurationSeconds = e.DurationSeconds,
        Active = e.IsActive,
        UploadedAt = e.UploadedAt,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(InfoscreenSlideEntity e, InfoscreenSlideUpsertDto r)
    {
        e.Name = r.Name.Trim();
        e.Type = r.Type;
        // Neues Medium -> neuer Upload-Zeitpunkt, sonst bleibt der alte.
        if (e.Media?.Url != r.Media?.Url || e.UploadedAt == default)
            e.UploadedAt = r.UploadedAt ?? DateTimeOffset.UtcNow;
        e.Media = r.Media;
        e.DurationSeconds = r.DurationSeconds;
        e.IsActive = r.Active;
        e.Order = r.Order;
    }

    protected override Task<string?> ValidateAsync(InfoscreenSlideUpsertDto r, Guid? id, CancellationToken ct)
    {
        if (!InfoscreenSlideTypes.All.Contains(r.Type))
            return Task.FromResult<string?>($"Unbekannter Typ '{r.Type}' (erlaubt: image, video).");
        if (r.Media is { } media && !media.ContentType.StartsWith(r.Type + "/", StringComparison.Ordinal))
            return Task.FromResult<string?>("Datei passt nicht zum Typ des Slides.");
        return Task.FromResult<string?>(null);
    }
}
