using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

/// <summary>
/// Hält den zuletzt gespiegelten Instagram-Feed im Speicher.
/// Aktualisierung per atomarem Referenz-Tausch, daher lockfrei lesbar.
/// </summary>
public sealed class InstagramStore
{
    private volatile InstagramFeedDto _feed = new(null, []);

    public string CacheDirectory { get; }
    public DateTimeOffset? LastSync { get; private set; }

    public InstagramStore(IOptions<InstagramGraphOptions> opts)
    {
        CacheDirectory = Path.GetFullPath(opts.Value.CacheDirectory);
        Directory.CreateDirectory(CacheDirectory);
    }

    public InstagramFeedDto Feed => _feed;

    public void Update(InstagramFeedDto feed)
    {
        _feed = feed;
        LastSync = DateTimeOffset.UtcNow;
    }
}
