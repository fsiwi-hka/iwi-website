using IWI_Backend.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/content")]
public class ContentController(
    InstagramGraphApiService graphService
) : ControllerBase
{
    
    [HttpGet("insta-posts")]
    public async Task<IActionResult> GetInstagramPosts([FromQuery] int limit = 5)
    {
        var posts = await graphService.GetInstagramPostsAsync(limit);
        return Ok(posts);
    }

}