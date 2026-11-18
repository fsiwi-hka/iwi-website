using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>Markdown-Seiten. Die Website laedt sie ueber den Slug (<c>/by-slug/{slug}</c>).</summary>
[Route("/api/backrooms/content/pages")]
public class PagesController(CoreContext db)
    : ContentCrudController<ContentPageEntity, ContentPageDto, ContentPageUpsertDto>(db)
{
    protected override IEnumerable<ContentPageEntity> SortUnordered(IEnumerable<ContentPageEntity> items) =>
        items.OrderBy(p => p.Title, StringComparer.CurrentCultureIgnoreCase);

    [HttpGet("by-slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ContentPageDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var page = await Db.ContentPages.AsNoTracking().FirstOrDefaultAsync(p => p.Slug == slug, ct);
        return page is null ? NotFound() : ToDto(page);
    }

    protected override ContentPageDto ToDto(ContentPageEntity e) => new()
    {
        Id = e.Id,
        Slug = e.Slug,
        Title = e.Title,
        Body = e.Body,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(ContentPageEntity e, ContentPageUpsertDto r)
    {
        e.Slug = r.Slug;
        e.Title = r.Title.Trim();
        e.Body = r.Body;
    }

    protected override async Task<string?> ValidateAsync(ContentPageUpsertDto r, Guid? id, CancellationToken ct) =>
        await Db.ContentPages.AnyAsync(p => p.Slug == r.Slug && p.Id != id, ct)
            ? $"Der Slug '{r.Slug}' ist schon vergeben."
            : null;
}
