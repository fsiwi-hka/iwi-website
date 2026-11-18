using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Mitglieder (Personen). <c>active</c> = aktives Mitglied, Ehemalige bleiben
/// erhalten. Die Rollen-Zuordnung pflegt <see cref="PositionsController"/>;
/// beim Loeschen fallen die Zuordnungen per Cascade weg.
/// </summary>
[Route("/api/backrooms/content/members")]
public class MembersController(CoreContext db)
    : ContentCrudController<MemberEntity, MemberDto, MemberUpsertDto>(db)
{
    protected override IEnumerable<MemberEntity> SortUnordered(IEnumerable<MemberEntity> items) =>
        items.OrderBy(m => m.Name, StringComparer.CurrentCultureIgnoreCase);

    protected override MemberDto ToDto(MemberEntity e) => MemberDto.From(e);

    protected override void Apply(MemberEntity e, MemberUpsertDto r)
    {
        e.Name = r.Name.Trim();
        e.Image = r.Image;
        e.IsActive = r.Active;
    }
}
