using System.Text.Json;
using IWI_Backend.Api.Controller;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services.OPhase;

public class OPhaseSyncService(
    IOptions<OPhaseOptions> opt, 
    ILogger<OPhaseSyncService> logger,
    WebDavClient webdav
    ) : BackgroundService
{
    
    private readonly SemaphoreSlim _gate = new(1, 1);
    
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(opt.Value.SyncIntervalMinutes));
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
                logger.LogError(ex, "O-Phase Sync fehlgeschlagen - behalte vorhandenen Cache.");
            }
        }
        while (await timer.WaitForNextTickAsync(ct));
    }

    public async Task<OPhaseInfoDto> ReadOptionsFileAsync(CancellationToken ct)
    {
        var cacheDir = opt.Value.CacheDirectory;

        var full = Path.GetFullPath(Path.Combine(cacheDir, $"ophase.json"));
        
        if (!File.Exists(full))
            return new OPhaseInfoDto();
        
        var json = await File.ReadAllTextAsync(full, ct);
        var res = JsonSerializer.Deserialize<OPhaseInfoDto>
                   (json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new OPhaseInfoDto();
        
        res.ChangedAt = DateOnly.FromDateTime(File.GetLastWriteTimeUtc(full));

        return res;
    }
    
    public async Task SyncAsync(CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var folder = webdav.GetFolder(opt.Value.BaseUrl);
            await WriteFilesAsync(folder, ct);
        }
        finally
        {
            _gate.Release();
        }
    }
    
    private static readonly HashSet<string> KnownExt = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png" };
    
    private async Task WriteFilesAsync(WebDavFolder root, CancellationToken ct)
    {
        
        var semester = (await root.ListAsync(ct))
            .Folders
            .OrderByDescending(s => int.Parse(s.Name[2..]))     
            .ThenByDescending(s => s.Name.StartsWith("SS") ? 0 : 1)
            .ToList();
        
        var nextSemester = semester.FirstOrDefault();
        
        if (nextSemester is not null)
        {
            var optionFile = (await nextSemester.ListAsync(ct)).Files.FirstOrDefault(f => f.Name == "info.json");
            if (optionFile is null) return;
            
            await optionFile.DownloadToAsync(Path.Combine(opt.Value.CacheDirectory, "ophase.json"), ct);
            
            var files = (await nextSemester.ListAsync(ct)).Files;
            var timeTableFiles = files.Where(f => KnownExt.Contains(Path.GetExtension(f.Name)));
            
            foreach (var file in timeTableFiles)
            {
                await file.DownloadToAsync(Path.Combine(opt.Value.CacheDirectory, file.Name), ct);
            }
        }
        
        
    }
}