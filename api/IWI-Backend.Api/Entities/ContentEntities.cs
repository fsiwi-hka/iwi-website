namespace IWI_Backend.Api.Entities;

// Inhalte der Backrooms, die bisher fest im Code der Website oder als Dateien
// in der Nextcloud lagen. Feldnamen entsprechen den Modellen in
// backrooms/src/app/shared/models/. IsActive heisst ueberall "auf der Website
// sichtbar"; Typen ohne diesen Schalter lassen es auf true.

/// <summary>Fachbereich mit Aufgaben; die Leitung ist eine Rolle.</summary>
public class DepartmentEntity : IBaseEntity, IOrderedEntity
{
    public int Order { get; set; }
    public string Name { get; set; } = "";

    public Guid? LeadPositionId { get; set; }
    public PositionEntity? LeadPosition { get; set; }

    public List<string> Tasks { get; set; } = [];

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>Sponsor/Partner fuer das Logo-Karussell.</summary>
public class SponsorEntity : IBaseEntity, IOrderedEntity
{
    public int Order { get; set; }
    public string Name { get; set; } = "";
    public MediaRef? Logo { get; set; }

    /// <summary>Renderbreite des Logos in Pixeln.</summary>
    public int Width { get; set; } = 120;

    public string Website { get; set; } = "";

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>Freitext-Seite in Markdown; der Slug ist der stabile Schluessel der Website.</summary>
public class ContentPageEntity : IBaseEntity
{
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Einzel-Dokument (Semestertermine, Website-Einstellungen) als JSON. Die
/// Struktur pruefen die typisierten DTOs im <c>DocumentsController</c>.
/// </summary>
public class DocumentEntity
{
    public string Key { get; set; } = "";
    public string Json { get; set; } = "{}";
    public DateTimeOffset Modified { get; set; }
}
