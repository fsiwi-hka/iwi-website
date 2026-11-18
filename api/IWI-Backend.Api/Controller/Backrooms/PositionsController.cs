using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Rollen der Fachschaft inkl. Zuordnung der Mitglieder (n:m). Ein Mitglied
/// kann in beliebig vielen Rollen stehen; die Reihenfolge von
/// <c>memberIds</c> ist die Anzeige-Reihenfolge.
/// </summary>
[Route("/api/backrooms/content/positions")]
public class PositionsController(CoreContext db)
    : ContentCrudController<PositionEntity, PositionDto, PositionUpsertDto>(db)
{
    protected override IQueryable<PositionEntity> Query() => Db.Positions.Include(p => p.Members);

    protected override PositionDto ToDto(PositionEntity e) => PositionDto.From(e);

    protected override void Apply(PositionEntity e, PositionUpsertDto r)
    {
        e.Title = r.Title.Trim();
        e.Group = r.Group;
        e.Order = r.Order;

        // Zuordnung komplett ersetzen: einfacher als ein Diff und haelt die Reihenfolge exakt.
        Db.PositionMembers.RemoveRange(e.Members);
        e.Members = r.MemberIds.Distinct()
            .Select((memberId, index) => new PositionMemberEntity { MemberId = memberId, Order = index })
            .ToList();
    }

    protected override async Task<string?> ValidateAsync(PositionUpsertDto r, Guid? id, CancellationToken ct)
    {
        if (!PositionGroups.All.Contains(r.Group))
            return $"Unbekannte Gruppe '{r.Group}'.";

        var ids = r.MemberIds.Distinct().ToList();
        if (ids.Count == 0) return null;
        var known = await Db.Members.CountAsync(m => ids.Contains(m.Id), ct);
        return known == ids.Count ? null : "Unbekanntes Mitglied in memberIds.";
    }
}
