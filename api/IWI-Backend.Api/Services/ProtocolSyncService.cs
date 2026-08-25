using System.Runtime.CompilerServices;
using System.Text.Json;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

public class ProtocolSyncService(
    WebDavClient webdav,
    IOptions<ProtocolOptions> protocolOpts,
    ILogger<ProtocolSyncService> logger
    ) : BackgroundService
{
    
    private readonly SemaphoreSlim _gate = new(1, 1);
    
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromDays(7));
        do
        {
            try
            {
                await SyncAsync(ct);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Protokoll-Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }
        while (await timer.WaitForNextTickAsync(ct));
    }
    
    public async Task SyncAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var folder = webdav.GetFolder(protocolOpts.Value.BaseUrl);

            await WriteProtocolCacheAsync(folder, ct);
            await CleanUpOldCacheAsync(ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task CleanUpOldCacheAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var cacheDir = protocolOpts.Value.CacheDirectory;
            if (!Directory.Exists(cacheDir)) return;


            var index = await ReadProtocolsAsync(ct);

            var newFiles = index
                .SelectMany(x => x.Value)
                .Where(e => (e.LastModified ?? DateTimeOffset.Now) < DateTimeOffset.Now)
                .Select(e => e.FileName)
                .ToList();
            
            var files = Directory.GetFiles(cacheDir, "*.pdf");
            var newSet = newFiles.ToHashSet(StringComparer.OrdinalIgnoreCase);

            foreach (var file in files)
            {
                if (newSet.Contains(Path.GetFileName(file)))
                    File.Delete(file);
            }
            
        }
        finally
        {
            _gate.Release();
        }
    }
    
    public async Task<Dictionary<string, List<ProtocolCacheEntry>>> ReadProtocolsAsync(CancellationToken ct)
    {
        var cachePath = Path.Combine(protocolOpts.Value.CacheDirectory, protocolOpts.Value.IndexFileName);
        if (!File.Exists(cachePath))
            return new Dictionary<string, List<ProtocolCacheEntry>>();

        var json = await File.ReadAllTextAsync(cachePath, ct);
        return JsonSerializer.Deserialize<Dictionary<string, List<ProtocolCacheEntry>>>(json)
            ?? new Dictionary<string, List<ProtocolCacheEntry>>();
    }

    private async Task WriteProtocolCacheAsync(WebDavFolder root, CancellationToken ct)
    {
        var rootListing = await root.ListAsync(ct);

        var semesters = rootListing.Folders
            .Where(f => !f.Name.StartsWith("_"))
            .Where(f => !f.Name.StartsWith("."))
            .OrderByDescending(f => SemesterSortKey(f.Name))
            .ToList();
        
        var result = new Dictionary<string, object>();

        foreach (var semester in semesters)
        {
            var inner = await semester.ListAsync(ct);
            result[semester.Name] = inner.Files
                .Where(f => f.Name.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                .Select(f => new ProtocolCacheEntry
                {
                    FileName = f.Name,
                    Href = f.Href.ToString(),
                    LastModified = f.LastModified,
                })
                .OrderBy(f => f.FileName, StringComparer.OrdinalIgnoreCase)
                .ToList();
        }
        
        var json = JsonSerializer.Serialize(result);

        var tmp = protocolOpts.Value.IndexFileName + ".tmp";
        await File.WriteAllTextAsync(tmp, json, ct);
        Directory.CreateDirectory(protocolOpts.Value.CacheDirectory);
        File.Move(tmp, Path.Combine(protocolOpts.Value.CacheDirectory, protocolOpts.Value.IndexFileName), overwrite: true);
    }
    
    private static int SemesterSortKey(string name)
    {
        var term = name.Length >= 2 ? name[..2].ToUpperInvariant() : "";
        var yearOk = int.TryParse(name.AsSpan(2), out var year);
        if (!yearOk) return int.MinValue;
        var termRank = term == "WS" ? 1 : 0;
        return year * 2 + termRank;
    }
}

public class ProtocolCacheEntry
{
    public string FileName { get; set; } = "";
    public string Href { get; set; } = "";
    public DateTimeOffset? LastModified { get; set; }
}