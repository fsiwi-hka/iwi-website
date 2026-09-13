using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Controller.Backrooms;

[ApiController]
[Route("/api/backrooms/content/hero-slides")]
[Authorize]
public class HeroSlidesController(CoreContext db) : ControllerBase
{

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<HeroSlideDto>>> ListSlides(CancellationToken ct)
    {
        return await db.HeroSlides.AsNoTracking()
            .Where(x => x.IsActive)
            .Select(x => new HeroSlideDto
            {
                Id = x.Id,
                Title = x.Title,
                Subtitle = x.Subtitle,
                ButtonText = x.ButtonText,
                ButtonLink = x.ButtonLink,
                Order = x.Order,
                Image = x.Image
            })
            .ToListAsync(ct);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<HeroSlideDto>> GetSlide(Guid id, CancellationToken ct)
    {
        var slide = await db.HeroSlides.AsNoTracking()
            .Where(x => x.Id == id && x.IsActive)
            .Select(x => new HeroSlideDto
            {
                Id = x.Id,
                Title = x.Title,
                Subtitle = x.Subtitle,
                ButtonText = x.ButtonText,
                ButtonLink = x.ButtonLink,
                Order = x.Order,
                Image = x.Image
            })
            .FirstOrDefaultAsync(ct);

        return slide is null ? NotFound() : Ok(slide);
    }

    [HttpPost]
    public async Task<ActionResult<HeroSlideDto>> UpsertSlide(HeroSlideUpsertDto request, CancellationToken ct)
    {
        HeroSlideEntity? entity;
        if (request.Id is null)
        {
            entity = new HeroSlideEntity
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Subtitle = request.Subtitle,
                ButtonText = request.ButtonText,
                ButtonLink = request.ButtonLink,
                Order = request.Order,
                Image = request.Image,
                Created = DateTimeOffset.UtcNow,
                CreatorId = Guid.Empty,
                IsActive = true
            };
            db.HeroSlides.Add(entity);

            return CreatedAtAction(nameof(GetSlide), new { id = entity.Id }, new HeroSlideDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Subtitle = entity.Subtitle,
                ButtonText = entity.ButtonText,
                ButtonLink = entity.ButtonLink,
                Order = entity.Order,
                Image = entity.Image
            });
        }

        entity = await db.HeroSlides
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, ct);

        if (entity is null) return NotFound();

        entity.Title = request.Title;
        entity.Subtitle = request.Subtitle;
        entity.ButtonText = request.ButtonText;
        entity.ButtonLink = request.ButtonLink;
        entity.Order = request.Order;
        entity.Image = request.Image;

        await db.SaveChangesAsync(ct);

        return Ok(new HeroSlideDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Subtitle = entity.Subtitle,
            ButtonText = entity.ButtonText,
            ButtonLink = entity.ButtonLink,
            Order = entity.Order,
            Image = entity.Image
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSlide([FromRoute] Guid id, CancellationToken ct)
    {
        var slides = await db.HeroSlides.OrderBy(s => s.Order).ToListAsync(ct);
        var slide = slides.FirstOrDefault(s => s.Id == id);
        if (slide is null) return NotFound();

        db.HeroSlides.Remove(slide);
        slides.Remove(slide);

        await db.SaveChangesAsync(ct);
        return NoContent();
    }


}