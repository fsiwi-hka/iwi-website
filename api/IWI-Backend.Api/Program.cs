using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Services;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

builder
    .Configuration
    .AddJsonFile($"appsettings.json", true, true)
    .AddJsonFile($"appsettings.Development.json", true, true)
    .AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true)
    .AddEnvironmentVariables();

builder.Services.Configure<WebDavOptions>(builder.Configuration.GetSection("WebDav"));
builder.Services.Configure<SyncOptions>(builder.Configuration.GetSection("Sync"));

builder.Services.AddHttpClient<WebDavClient>(c => c.Timeout = TimeSpan.FromMinutes(5));

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerUI();
builder.Services.AddControllers();

builder.Services.AddSingleton<MediaStore>();
builder.Services.AddSingleton<MediaSyncService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<MediaSyncService>());

builder.Services.AddSingleton(_ =>
{
    var p = new FileExtensionContentTypeProvider
    {
        Mappings =
        {
            [".avif"] = "image/avif"
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

app.MapGet("/api/health", (MediaStore store) =>
    Results.Ok(new { status = "ok", lastSync = store.LastSync, slides = store.Slides.Count }));

app.MapGet("/api/config", (MediaStore store) => Results.Ok(store.Config));

app.MapOpenApi();
app.MapSwaggerUI();
app.MapControllers();

app.Run();