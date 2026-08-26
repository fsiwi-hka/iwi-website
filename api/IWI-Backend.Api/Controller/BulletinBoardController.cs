using System.Text.Json.Serialization;
using IWI_Backend.Api.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller;

public class BulletinDto
{
    public BulletinContent Content { get; set; } = new BulletinContent();
    
    [JsonPropertyName("event_id")]
    public string EventId { get; set; } = "";
    
    [JsonPropertyName("origin_server_ts")]
    public long OriginServerTs { get; set; }
    public string Sender { get; set; } = "";
    public string Type { get; set; } = "";
    public record Unsigned(long Age);
    
    [JsonIgnore]
    public DateTimeOffset Timestamp => DateTimeOffset.FromUnixTimeMilliseconds(OriginServerTs);
    
    
    [JsonPropertyName("room_id")]
    public string RoomId { get; set; } = "";
}

public class BulletinContent
{
    public string Body { get; set; } = "";
    public string Format { get; set; } = "";
    
    [JsonPropertyName("formatted_body")]
    public string FormattedBody { get; set; } = "";
    public string MsgType { get; set; } = "";
}

[ApiController]
[Route("/api/bulletin")]
public class BulletinBoardController(ILogger<BulletinBoardController> logger) : ControllerBase
{
    
    [HttpPost("push/{board}")]
    [RequireApiKey]
    public async Task<IActionResult> PushBulletin([FromRoute] string board, [FromBody] BulletinDto bulletin, CancellationToken ct)
    {
        logger.LogInformation("Received bulletin: {bulletin}", bulletin);
        logger.LogInformation("From board: {board}", board);
        logger.LogInformation("From user: {user}", User.Identity?.Name);
        
        return Ok();
    }
}