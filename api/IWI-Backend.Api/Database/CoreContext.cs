using Microsoft.EntityFrameworkCore;

namespace IWI_Backend.Api.Database;

public partial class CoreContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        OnBackroomsModelCreating(builder);
    }
}