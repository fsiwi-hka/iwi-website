using System.Collections.Concurrent;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace IWI_Backend.Api.Services.Raumzeit;

public class BulletinApiService(HttpClient http, BulletinCache bulletinCache)
{
    public async Task<List<BulletinPostEntity>> GetBulletinPosts(
        string courseOfStudy, CancellationToken ct = default)
    {
        var key = $"bulletin-posts-{courseOfStudy}";

        return await bulletinCache.GetOrAddAsync(key, async (x) =>
        {
            var url = $"newsbulletinboard/public/courseofstudy/{Uri.EscapeDataString(courseOfStudy)}";
            return (await http.GetFromJsonAsync<List<BulletinPostEntity>>(url, ct) ?? [])
                .OrderByDescending(p => p.PublicationTimestamp)
                .ToList();
        }) ?? [];
    }
}

public class BulletinCache(IMemoryCache cache)
{
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _sources = new();

    public Task<T?> GetOrAddAsync<T>(string key, Func<ICacheEntry, Task<T>> factory) =>
        cache.GetOrCreateAsync(key, entry =>
        {
            var cts = _sources.GetOrAdd(key, _ => new CancellationTokenSource());
            entry.AddExpirationToken(new CancellationChangeToken(cts.Token));
            
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7);

            return factory(entry);
        });
    
    public void Invalidate(string key)
    {
        if (!_sources.TryRemove(key, out var cts)) return;
        
        cts.Cancel();
        cts.Dispose();
    }
}

