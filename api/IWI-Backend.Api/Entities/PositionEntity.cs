namespace IWI_Backend.Api.Entities;

/// <summary>Gruppen, in denen die Website die Rollen anzeigt.</summary>
public static class PositionGroups
{
    public const string Board = "board";
    public const string Role = "role";
    public const string Department = "department";

    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
        { Board, Role, Department };
}

/// <summary>
/// Eine Rolle der Fachschaft ("1. Vorsitz", "FB Events", ...). Kann unbesetzt
/// sein oder mehrere Mitglieder haben.
/// </summary>
public class PositionEntity : IBaseEntity, IOrderedEntity
{
    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Group { get; set; } = PositionGroups.Role;

    public List<PositionMemberEntity> Members { get; set; } = [];

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>n:m-Zuordnung Rolle &lt;-&gt; Mitglied mit Reihenfolge innerhalb der Rolle.</summary>
public class PositionMemberEntity
{
    public Guid PositionId { get; set; }
    public PositionEntity Position { get; set; } = null!;

    public Guid MemberId { get; set; }
    public MemberEntity Member { get; set; } = null!;

    /// <summary>Anzeige-Reihenfolge der Mitglieder innerhalb der Rolle (0-basiert).</summary>
    public int Order { get; set; }
}
