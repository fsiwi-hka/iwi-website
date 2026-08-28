using IWI_Backend.Api.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace IWI_Backend.Api.Services.Raumzeit;

public class BulletinApiService(HttpClient http, BulletinCache bulletinCache)
{
    private static readonly TimeSpan Ttl = TimeSpan.FromMinutes(120);
    
    public async Task<List<BulletinPostEntity>> GetBulletinPosts(
        string courseOfStudy, CancellationToken ct = default)
    {
        var key = $"bulletin-posts-{courseOfStudy}";

        return await bulletinCache.Cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = Ttl;
            entry.AddExpirationToken(bulletinCache.Token);
            
            var url = $"newsbulletinboard/public/courseofstudy/{Uri.EscapeDataString(courseOfStudy)}";
            return (await http.GetFromJsonAsync<List<BulletinPostEntity>>(url, ct) ?? [])
                .OrderByDescending(p => p.PublicationTimestamp)
                .ToList();
        }) ?? [];
    }
    
}

public class BulletinCache(IMemoryCache cache)
{
    private CancellationTokenSource _cts = new();
    public IChangeToken Token => new CancellationChangeToken(_cts.Token);

    public IMemoryCache Cache = cache;
    
    public void Invalidate()
    {
        var old = Interlocked.Exchange(ref _cts, new CancellationTokenSource());
        old.Cancel();
        old.Dispose();
    }
}

