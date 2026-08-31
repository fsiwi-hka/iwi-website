using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Controller;
using IWI_Backend.Api.Services;
using IWI_Backend.Api.Services.Auth;
using IWI_Backend.Api.Services.OPhase;
using IWI_Backend.Api.Services.Raumzeit;
using Microsoft.AspNetCore.StaticFiles;

if (args is ["key", var info])
{
    Console.WriteLine(ApiKey.Create(info, Environment.GetEnvironmentVariable("Board__Secret")!));
    return;
}


var builder = WebApplication.CreateBuilder(args);

builder
    .Configuration
    .AddJsonFile($"appsettings.json", true, true)
    .AddJsonFile($"appsettings.Development.json", true, true)
    .AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true)
    .AddJsonFile($"appsettings.Production.json", true, true)
    .AddEnvironmentVariables();

builder.Services.Configure<OPhaseOptions>(builder.Configuration.GetSection("OPhase"));
builder.Services.Configure<WebDavOptions>(builder.Configuration.GetSection("WebDav"));
builder.Services.Configure<ProtocolOptions>(builder.Configuration.GetSection("Protocols"));
builder.Services.Configure<MediaOptions>(builder.Configuration.GetSection("Media"));
builder.Services.Configure<SyncOptions>(builder.Configuration.GetSection("Sync"));
builder.Services.Configure<InstagramGraphOptions>(
    builder.Configuration.GetSection("Instagram"));

builder.Services.AddHttpClient<WebDavClient>(c => c.Timeout = TimeSpan.FromMinutes(5));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddMemoryCache();

builder.Services.AddSingleton<BulletinCache>();

builder.Services.AddHttpClient();
builder.Services.AddHttpClient<BulletinApiService>(c =>
    c.BaseAddress = new Uri("https://raumzeit.hka-iwi.de/api/v1/"));
builder.Services.AddSingleton<InstagramTokenStore>();
builder.Services.AddHostedService<InstagramTokenRefresher>();
builder.Services.AddSingleton<InstagramGraphApiService>();
builder.Services.AddSingleton<InstagramStore>();
builder.Services.AddSingleton<InstagramSyncService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<InstagramSyncService>());


builder.Services.AddSingleton<MediaStore>();
builder.Services.AddSingleton<MediaSyncService>();
builder.Services.AddSingleton<OPhaseSyncService>();
builder.Services.AddSingleton<ProtocolSyncService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<MediaSyncService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<ProtocolSyncService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<OPhaseSyncService>());

builder.Services.AddSingleton(_ =>
{
    var p = new FileExtensionContentTypeProvider
    {
        Mappings =
        {
            [".avif"] = "image/avif",
            [".heic"] = "image/heic"
        }
    };
    return p;
});

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddHttpContextAccessor();

var app = builder.Build();
app.UseCors();

app.MapGet("/api/health", (MediaStore store, InstagramStore instagram) =>
    Results.Ok(new
    {
        status = "ok",
        lastSync = store.LastSync,
        slides = store.Slides.Count,
        instagramLastSync = instagram.LastSync,
        instagramPosts = instagram.Feed.Data.Count
    }));

app.MapGet("/api/config", (MediaStore store) => Results.Ok(store.Config));

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.Run();