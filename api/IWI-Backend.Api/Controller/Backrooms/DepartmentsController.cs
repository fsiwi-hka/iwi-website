using IWI_Backend.Api.Database;
using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>Fachbereiche. Die Leitung ist eine Rolle (<c>leadPositionId</c>), wird sie geloescht, wird der Verweis null.</summary>
[Route("/api/backrooms/content/departments")]
public class DepartmentsController(CoreContext db)
    : ContentCrudController<DepartmentEntity, DepartmentDto, DepartmentUpsertDto>(db)
{
    protected override DepartmentDto ToDto(DepartmentEntity e) => new()
    {
        Id = e.Id,
        Order = e.Order,
        Name = e.Name,
        LeadPositionId = e.LeadPositionId,
        Tasks = e.Tasks,
        UpdatedAt = UpdatedAt(e),
    };

    protected override void Apply(DepartmentEntity e, DepartmentUpsertDto r)
    {
        e.Name = r.Name.Trim();
        e.LeadPositionId = r.LeadPositionId;
        e.Tasks = r.Tasks.Select(t => t.Trim()).ToList();
        e.Order = r.Order;
    }

    protected override async Task<string?> ValidateAsync(DepartmentUpsertDto r, Guid? id, CancellationToken ct)
    {
        if (r.Tasks.Any(string.IsNullOrWhiteSpace)) return "Aufgaben duerfen nicht leer sein.";
        if (r.Tasks.Any(t => t.Length > 160)) return "Eine Aufgabe ist laenger als 160 Zeichen.";
        if (r.LeadPositionId is { } lead && !await Db.Positions.AnyAsync(p => p.Id == lead, ct))
            return "Die Leitungsrolle existiert nicht.";
        return null;
    }
}
