using IWI_Backend.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Database;

public partial class CoreContext
{

    public DbSet<HeroSlideEntity>  HeroSlides => Set<HeroSlideEntity>();

    private static void OnBackroomsModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("backrooms");

        builder.Entity<HeroSlideEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            e.Property(x => x.Title).HasMaxLength(120).IsRequired();
            e.Property(x => x.Subtitle).HasMaxLength(240);
            e.Property(x => x.ButtonText).HasMaxLength(60);
            e.Property(x => x.ButtonLink).HasMaxLength(500);
            e.HasIndex(x => x.Order);

            e.OwnsOne(x => x.Image, i => i.ToJson());
        });

    }


}