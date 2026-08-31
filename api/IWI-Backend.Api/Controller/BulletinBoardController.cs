using System.Text.Json.Serialization;
using IWI_Backend.Api.Models;
using IWI_Backend.Api.Services.Auth;
using IWI_Backend.Api.Services.Raumzeit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IWI_Backend.Api.Controller;

[ApiController]
[Route("/api/bulletin")]
public class BulletinBoardController(
    ILogger<BulletinBoardController> logger,
    BulletinApiService bulletinApi,
    BulletinCache cache
    ) : ControllerBase
{
    
    [HttpGet("refresh")]
    [Authorize]
    public async Task<ActionResult<bool>> RefreshBulletinBoards()
    {
        try
        {
            cache.Invalidate();
            return Ok(true);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error refreshing bulletin boards");
            return StatusCode(500, new { error = "An error occurred while refreshing bulletin boards." });
        }
    }
    
    [HttpGet("posts")]
    public async Task<ActionResult<IEnumerable<BulletinPostDto>>> GetBulletinPosts(
        [FromQuery] string board, 
        [FromQuery] int limit = 5, 
        [FromQuery] int offset = 0)
    {
        try
        {
            var posts = (await bulletinApi.GetBulletinPosts(board))
                .Select(b => new BulletinPostDto
                {
                    Title = b.Title,
                    PublicationTimestamp = b.PublicationTimestamp,
                    Content = b.Content,
                    CoursesOfStudy = b.CoursesOfStudy,
                    Departments = b.Departments,
                    Id = b.Id,
                    Creator = b.Creator,
                    Type = b.Type
                }).ToList();
            
            Response.Headers["X-Total-Count"] = posts.Count.ToString();
            posts = posts.Skip(offset).Take(limit).ToList();
            
            return Ok(posts);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error fetching bulletin posts for board {board}", board);
            return StatusCode(500, new { error = "An error occurred while fetching bulletin posts." });
        }
    }
}