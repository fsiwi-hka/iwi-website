namespace IWI_Backend.Api.Entities;

public class HeroSlideEntity : IBaseEntity
{
    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public MediaRef? Image { get; set; }
    public string ButtonText { get; set; } = "";
    public string ButtonLink { get; set; } = "";

    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset Created { get; set; }
    public Guid? ModifierId { get; set; }
    public DateTimeOffset? Modified { get; set; }
    public bool IsActive { get; set; }
}

public class MediaRef
{
    public string? Id { get; set; }
    public string Url { get; set; } = "";
    public string Name { get; set; } = "";
    public string ContentType { get; set; } = "";
    public long Size { get; set; }
}