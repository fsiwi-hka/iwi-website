using System.Text.Json;
using Netina.Stomp.Client;
using Netina.Stomp.Client.Interfaces;

namespace IWI_Backend.Api.Services.Raumzeit;

public class BulletinListener(
    ILogger<BulletinListener> logger,
    IServiceProvider serviceProvider,
    BulletinCache cache
    ) : BackgroundService
{
    
    private const string WebsocketUrl = "wss://raumzeit.hka-iwi.de/ws-bulletinboard/websocket";
    
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        try
        {
            IStompClient client = new StompClient(
                WebsocketUrl
            );

            await client.ConnectAsync(new Dictionary<string, string>());
            
            await client.SubscribeAsync("/topic/ws-bulletinboard", new Dictionary<string, string>(),
                (sender, message) =>
                {
                    logger.LogInformation("Nachricht empfangen: {Body}", message.Body);
                    _ = HandleAsync(message.Body, ct);
                });

            logger.LogInformation("Abonniert.");

            await Task.Delay(Timeout.Infinite, ct);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private readonly SemaphoreSlim _gate = new(1, 1);
    
    private async Task HandleAsync(string body, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);

        try
        {
            using var scope = serviceProvider.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<BulletinApiService>();
            
            var categories = JsonSerializer.Deserialize<string[]>(body)??[];

            foreach (var category in categories)
            {
                cache.Invalidate($"bulletin-posts-{category}");
                
                //Calling the API will also update the cache, return value is ignored.
                await service.GetBulletinPosts(category, ct);
            }

            logger.LogInformation("Nachricht empfangen: {body}", body);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        finally
        {
            _gate.Release();
        }
    }
}