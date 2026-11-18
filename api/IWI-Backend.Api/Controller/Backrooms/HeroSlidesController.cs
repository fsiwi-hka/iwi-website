using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

[Route("/api/backrooms/content/hero-slides")]
public class HeroSlidesController(CoreContext db)
    : ContentCrudController<HeroSlideEntity, HeroSlideDto, HeroSlideUpsertDto>(db)
{
    protected override HeroSlideDto ToDto(HeroSlideEntity e) => new()
    {
        Id = e.Id,
        Order = e.Order,
        Title = e.Title,
        Subtitle = e.Subtitle,
        Image = e.Image,
        ImageOverlay = e.ImageOverlay,
        ButtonText = e.ButtonText,
        ButtonLink = e.ButtonLink,
        Active = e.IsActive,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(HeroSlideEntity e, HeroSlideUpsertDto r)
    {
        e.Title = r.Title.Trim();
        e.Subtitle = r.Subtitle.Trim();
        e.Image = r.Image;
        e.ImageOverlay = r.ImageOverlay;
        e.ButtonText = r.ButtonText.Trim();
        e.ButtonLink = r.ButtonLink.Trim();
        e.IsActive = r.Active;
        e.Order = r.Order;
    }
}
