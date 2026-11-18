using System.ComponentModel.DataAnnotations;
using IWI_Backend.Api.Entities;

namespace IWI_Backend.Api.Models.Backrooms;

public class MemberDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public MediaRef? Image { get; set; }
    public bool Active { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public static MemberDto From(MemberEntity e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Image = e.Image,
        Active = e.IsActive,
        UpdatedAt = e.Modified ?? e.Created,
    };
}

public class MemberUpsertDto
{
    [Required, MaxLength(80)]
    public string Name { get; set; } = "";

    public MediaRef? Image { get; set; }

    public bool Active { get; set; } = true;
}

public class PositionDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Group { get; set; } = "";

    /// <summary>Zugeordnete Mitglieder in Anzeige-Reihenfolge.</summary>
    public List<Guid> MemberIds { get; set; } = [];

    public DateTimeOffset UpdatedAt { get; set; }

    public static PositionDto From(PositionEntity e) => new()
    {
        Id = e.Id,
        Order = e.Order,
        Title = e.Title,
        Group = e.Group,
        MemberIds = e.Members.OrderBy(m => m.Order).Select(m => m.MemberId).ToList(),
        UpdatedAt = e.Modified ?? e.Created,
    };
}

public class PositionUpsertDto
{
    [Required, MaxLength(60)]
    public string Title { get; set; } = "";

    /// <summary>board, role oder department.</summary>
    [Required, MaxLength(20)]
    public string Group { get; set; } = PositionGroups.Role;

    public List<Guid> MemberIds { get; set; } = [];

    /// <summary>0 = ans Ende.</summary>
    public int Order { get; set; }
}

/// <summary>Neue Reihenfolge als Liste von Ids (Index = neue Position), fuer alle sortierbaren Listen.</summary>
public class ReorderDto
{
    public List<Guid> Ids { get; set; } = [];
}

/// <summary>Neue Reihenfolge bei WebDAV-Spiegeln: Ids sind dort Dateinamen.</summary>
public class FileOrderDto
{
    public List<string> Ids { get; set; } = [];
}
