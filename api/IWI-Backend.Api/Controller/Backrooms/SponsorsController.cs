using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

[Route("/api/backrooms/content/sponsors")]
public class SponsorsController(CoreContext db)
    : ContentCrudController<SponsorEntity, SponsorDto, SponsorUpsertDto>(db)
{
    protected override SponsorDto ToDto(SponsorEntity e) => new()
    {
        Id = e.Id,
        Order = e.Order,
        Name = e.Name,
        Logo = e.Logo,
        Width = e.Width,
        Website = e.Website,
        Active = e.IsActive,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(SponsorEntity e, SponsorUpsertDto r)
    {
        e.Name = r.Name.Trim();
        e.Logo = r.Logo;
        e.Width = r.Width;
        e.Website = r.Website.Trim();
        e.IsActive = r.Active;
        e.Order = r.Order;
    }

    protected override Task<string?> ValidateAsync(SponsorUpsertDto r, Guid? id, CancellationToken ct) =>
        Task.FromResult(Validation.HttpUrl(r.Website, "Website"));
}
