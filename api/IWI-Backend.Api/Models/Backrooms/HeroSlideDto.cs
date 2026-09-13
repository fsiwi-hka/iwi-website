using System.ComponentModel.DataAnnotations;
using IWI_Backend.Api.Entities;

namespace IWI_Backend.Api.Models.Backrooms;

public class HeroSlideDto
{
    public Guid Id { get; set; }

    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public MediaRef? Image { get; set; }
    public string ButtonText { get; set; } = "";
    public string ButtonLink { get; set; } = "";
}

public class HeroSlideUpsertDto
{
    public Guid? Id { get; set; }

    [MaxLength(120)]
    public string Title { get; set; } = "";

    [MaxLength(240)]
    public string Subtitle { get; set; } = "";

    public MediaRef? Image { get; set; }

    [MaxLength(60)]
    public string ButtonText { get; set; } = "";

    [MaxLength(500)]
    public string ButtonLink { get; set; } = "";

    public bool IsActive { get; set; } = true;
    public int Order { get; set; }
}