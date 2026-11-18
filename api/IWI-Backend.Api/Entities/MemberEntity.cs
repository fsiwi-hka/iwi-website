namespace IWI_Backend.Api.Entities;

/// <summary>
/// Ein Mitglied der Fachschaft (eine Person). Die Rollen haengen ueber
/// <see cref="PositionMemberEntity"/> daran, damit eine Person mehrere Rollen
/// ausfuellen kann. <see cref="IBaseEntity.IsActive"/> steht hier fuer
/// "aktives Mitglied"; Ehemalige bleiben erhalten.
/// </summary>
public class MemberEntity : IBaseEntity
{
    public string Name { get; set; } = "";
    public MediaRef? Image { get; set; }

    public List<PositionMemberEntity> Positions { get; set; } = [];

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; } = true;
}
