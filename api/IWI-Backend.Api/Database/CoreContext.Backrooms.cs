using IWI_Backend.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace IWI_Backend.Api.Database;

public partial class CoreContext
{

    public DbSet<HeroSlideEntity>  HeroSlides => Set<HeroSlideEntity>();
    public DbSet<MemberEntity> Members => Set<MemberEntity>();
    public DbSet<PositionEntity> Positions => Set<PositionEntity>();
    public DbSet<PositionMemberEntity> PositionMembers => Set<PositionMemberEntity>();
    public DbSet<DepartmentEntity> Departments => Set<DepartmentEntity>();
    public DbSet<SponsorEntity> Sponsors => Set<SponsorEntity>();
    public DbSet<ProtocolEntity> Protocols => Set<ProtocolEntity>();
    public DbSet<InfoscreenSlideEntity> InfoscreenSlides => Set<InfoscreenSlideEntity>();
    public DbSet<ContentPageEntity> ContentPages => Set<ContentPageEntity>();
    public DbSet<DocumentEntity> Documents => Set<DocumentEntity>();
    public DbSet<BackroomsSessionEntity> BackroomsSessions => Set<BackroomsSessionEntity>();

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

        builder.Entity<MemberEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(80).IsRequired();
            e.HasIndex(x => x.Name);

            e.OwnsOne(x => x.Image, i => i.ToJson());
        });

        builder.Entity<PositionEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(60).IsRequired();
            e.Property(x => x.Group).HasMaxLength(20).IsRequired();
            e.HasIndex(x => x.Order);
        });

        // n:m mit Nutzlast (Reihenfolge innerhalb der Rolle). Loeschen einer
        // Rolle oder eines Mitglieds entfernt nur die Zuordnung.
        builder.Entity<PositionMemberEntity>(e =>
        {
            e.HasKey(x => new { x.PositionId, x.MemberId });
            e.HasOne(x => x.Position).WithMany(p => p.Members)
                .HasForeignKey(x => x.PositionId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Member).WithMany(m => m.Positions)
                .HasForeignKey(x => x.MemberId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.MemberId);
        });

        builder.Entity<DepartmentEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(60).IsRequired();
            // Primitive Collection: SQLite speichert die Aufgaben als JSON-Array.
            e.Property(x => x.Tasks);
            e.HasOne(x => x.LeadPosition).WithMany()
                .HasForeignKey(x => x.LeadPositionId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(x => x.Order);
        });

        builder.Entity<SponsorEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(80).IsRequired();
            e.Property(x => x.Website).HasMaxLength(500);
            e.HasIndex(x => x.Order);
            e.OwnsOne(x => x.Logo, i => i.ToJson());
        });

        builder.Entity<ProtocolEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(120).IsRequired();
            e.Property(x => x.Semester).HasMaxLength(20);
            e.HasIndex(x => x.MeetingDate);
            e.OwnsOne(x => x.File, i => i.ToJson());
        });

        builder.Entity<InfoscreenSlideEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(120).IsRequired();
            e.Property(x => x.Type).HasMaxLength(10).IsRequired();
            e.HasIndex(x => x.Order);
            e.OwnsOne(x => x.Media, i => i.ToJson());
        });

        builder.Entity<ContentPageEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Slug).HasMaxLength(60).IsRequired();
            e.Property(x => x.Title).HasMaxLength(120).IsRequired();
            e.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<DocumentEntity>(e =>
        {
            e.HasKey(x => x.Key);
            e.Property(x => x.Key).HasMaxLength(40);
            e.Property(x => x.Json).IsRequired();
        });

        builder.Entity<BackroomsSessionEntity>(e =>
        {
            e.HasKey(x => x.TokenHash);
            e.Property(x => x.TokenHash).HasMaxLength(64);
            e.Property(x => x.UserId).HasMaxLength(200);
            e.Property(x => x.Username).HasMaxLength(200);
            e.Property(x => x.DisplayName).HasMaxLength(200);
            e.Property(x => x.Email).HasMaxLength(200);
            // SQLite kann DateTimeOffset nicht vergleichen; als Zahl gespeichert
            // funktioniert "abgelaufene Sessions loeschen" direkt in der Datenbank.
            e.Property(x => x.ExpiresAt).HasConversion<DateTimeOffsetToBinaryConverter>();
            e.Property(x => x.Created).HasConversion<DateTimeOffsetToBinaryConverter>();
            e.HasIndex(x => x.ExpiresAt);
        });

    }


}