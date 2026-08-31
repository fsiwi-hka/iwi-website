using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/protocols")]
public class ProtocolController(
    ProtocolSyncService syncService,
    IOptions<ProtocolOptions> opts,
    WebDavClient webDav
    ) : ControllerBase
{
    
    [HttpGet("sync")]
    public async Task<IActionResult> Sync()
    {
        if (syncService.ExecuteTask == null) return BadRequest();
        
        var token = new CancellationTokenSource(TimeSpan.FromMinutes(10));

        await syncService.SyncAsync(token.Token);

        return Ok();
    }
    
    [HttpGet]
    public async Task<ActionResult<Dictionary<string, List<string>>>> ListProtocols(CancellationToken ct)
    {
        var index = await syncService.ReadProtocolsAsync(ct);
        
        var result = index.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Select(e => e.FileName).ToList());

        return Ok(result);
    }
    
    [HttpGet("{fileName}")]
    public async Task<IActionResult> DownloadProtocolFile(string fileName, CancellationToken ct)
    {
        if (fileName.Contains("..") || fileName.Contains('/') || fileName.Contains('\\'))
            return BadRequest("Ungültiger Dateiname.");

        var cacheDir = opts.Value.CacheDirectory;
        var localPath = Path.Combine(cacheDir, fileName);
        
        if (!System.IO.File.Exists(localPath))
        {
            var index = await syncService.ReadProtocolsAsync(ct);
            var entry = index.Values.SelectMany(list => list)
                .FirstOrDefault(e => e.FileName == fileName);
            if (entry is null)
                return NotFound();

            Directory.CreateDirectory(cacheDir);
            await webDav.DownloadToAsync(new Uri(entry.Href), localPath, ct);
        }
        
        var stream = System.IO.File.OpenRead(localPath);
        return File(stream, "application/pdf", fileName);
    }
    
    
}