using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Gemeinsame REST-Abbildung aller Backrooms-Listen, passend zum Vertrag des
/// Frontends (backrooms/src/app/core/api/http/http-content-api.ts):
///
///   GET    /api/backrooms/content/{key}           Liste (optional ?active=true)
///   GET    /api/backrooms/content/{key}/{id}      Einzelner Eintrag
///   POST   /api/backrooms/content/{key}           Anlegen
///   PUT    /api/backrooms/content/{key}/{id}      Vollstaendig ersetzen
///   DELETE /api/backrooms/content/{key}/{id}      Loeschen
///   PUT    /api/backrooms/content/{key}/order     { ids } -> neue Reihenfolge
///
/// Lesen ist oeffentlich (die Website zeigt die Inhalte an), Schreiben braucht
/// ein Token. Abgeleitete Controller liefern nur Route, Mapping und Pruefungen.
/// </summary>
[ApiController]
[Authorize]
public abstract class ContentCrudController<TEntity, TDto, TUpsert>(CoreContext db) : ControllerBase
    where TEntity : class, IBaseEntity, new()
{
    protected CoreContext Db { get; } = db;

    /// <summary>Basisabfrage, z. B. mit Include fuer Navigationen.</summary>
    protected virtual IQueryable<TEntity> Query() => Db.Set<TEntity>();

    protected abstract TDto ToDto(TEntity entity);

    /// <summary>Uebernimmt den Request in die (neue oder bestehende) Entitaet.</summary>
    protected abstract void Apply(TEntity entity, TUpsert request);

    /// <summary>Fachliche Pruefung ueber die DataAnnotations hinaus; Fehlertext oder null.</summary>
    protected virtual Task<string?> ValidateAsync(TUpsert request, Guid? id, CancellationToken ct) =>
        Task.FromResult<string?>(null);

    /// <summary>Sortierung der Liste, wenn die Entitaet keine eigene Reihenfolge hat.</summary>
    protected virtual IEnumerable<TEntity> SortUnordered(IEnumerable<TEntity> items) =>
        items.OrderBy(e => e.Created);

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TDto>>> List([FromQuery] bool? active, CancellationToken ct)
    {
        var query = Query().AsNoTracking();
        if (active is { } flag) query = query.Where(e => e.IsActive == flag);

        // Listen sind klein (Dutzende Eintraege); sortiert wird im Speicher,
        // damit die Basis nicht wissen muss, ob es eine Reihenfolge gibt.
        var items = await query.ToListAsync(ct);
        var sorted = typeof(IOrderedEntity).IsAssignableFrom(typeof(TEntity))
            ? items.OrderBy(e => ((IOrderedEntity)e).Order)
            : SortUnordered(items);
        return sorted.Select(ToDto).ToList();
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TDto>> Get(Guid id, CancellationToken ct)
    {
        var entity = await Query().AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, ct);
        return entity is null ? NotFound() : ToDto(entity);
    }

    [HttpPost]
    public async Task<ActionResult<TDto>> Create(TUpsert request, CancellationToken ct)
    {
        if (await ValidateAsync(request, null, ct) is { } error) return BadRequest(new { error });

        var entity = new TEntity
        {
            Id = Guid.NewGuid(),
            Created = DateTimeOffset.UtcNow,
            IsActive = true,
        };
        Apply(entity, request);

        if (entity is IOrderedEntity ordered && ordered.Order <= 0)
        {
            var max = await Db.Set<TEntity>().AsNoTracking().ToListAsync(ct);
            ordered.Order = max.OfType<IOrderedEntity>().Select(o => o.Order).DefaultIfEmpty(0).Max() + 1;
        }

        Db.Set<TEntity>().Add(entity);
        await Db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ToDto(entity));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TDto>> Update(Guid id, TUpsert request, CancellationToken ct)
    {
        var entity = await Query().FirstOrDefaultAsync(e => e.Id == id, ct);
        if (entity is null) return NotFound();
        if (await ValidateAsync(request, id, ct) is { } error) return BadRequest(new { error });

        var order = (entity as IOrderedEntity)?.Order;
        Apply(entity, request);
        // Order 0 im Request heisst "unveraendert", nicht "an den Anfang".
        if (entity is IOrderedEntity ordered && ordered.Order <= 0 && order is { } previous)
            ordered.Order = previous;

        entity.Modified = DateTimeOffset.UtcNow;
        await Db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        // Abhaengige Zuordnungen regeln die Fremdschluessel (Cascade / Set null).
        var deleted = await Db.Set<TEntity>().Where(e => e.Id == id).ExecuteDeleteAsync(ct);
        return deleted == 0 ? NotFound() : NoContent();
    }

    /// <summary>Nur bei sortierbaren Listen vorhanden (siehe <see cref="UnorderedListConvention"/>).</summary>
    [HttpPut("order")]
    public async Task<IActionResult> Reorder(ReorderDto request, CancellationToken ct)
    {
        var items = await Db.Set<TEntity>().ToDictionaryAsync(e => e.Id, ct);
        if (request.Ids.Count != items.Count || request.Ids.Distinct().Count() != items.Count
            || request.Ids.Any(id => !items.ContainsKey(id)))
            return BadRequest(new { error = "Die Reihenfolge muss alle Eintraege genau einmal enthalten." });

        for (var i = 0; i < request.Ids.Count; i++)
            ((IOrderedEntity)items[request.Ids[i]]).Order = i + 1;

        await Db.SaveChangesAsync(ct);
        return NoContent();
    }

    protected static DateTimeOffset UpdatedAt(TEntity e) => e.Modified ?? e.Created;
}
