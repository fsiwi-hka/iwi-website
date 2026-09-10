using IWI_Backend.Api.Configuration;
using IwiDisplayBackend.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

/// <summary>
/// Hält den aktuellen Zustand (Slides + effektive Config) im Speicher.
/// Aktualisierung per atomarem Referenz-Tausch, daher lockfrei lesbar.
/// </summary>
public sealed class MediaStore
{
    private volatile IReadOnlyList<SlideDto> _slides = Array.Empty<SlideDto>();
    private volatile MediaConfig _config = new();

    public string CacheDirectory { get; }
    public DateTimeOffset? LastSync { get; private set; }

    public MediaStore(IOptions<SyncOptions> opts)
    {
        CacheDirectory = Path.GetFullPath(opts.Value.CacheDirectory);
        Directory.CreateDirectory(CacheDirectory);
    }

    public IReadOnlyList<SlideDto> Slides => _slides;
    public MediaConfig Config => _config;

    public void Update(IReadOnlyList<SlideDto> slides, MediaConfig config)
    {
        _slides = slides;
        _config = config;
        LastSync = DateTimeOffset.UtcNow;
    }
}
