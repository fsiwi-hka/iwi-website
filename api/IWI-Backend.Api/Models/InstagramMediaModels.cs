using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;

// ---------------------------------------------------------------------------
// Rohantworten der Graph API. media_url/thumbnail_url/profile_picture_url sind
// signierte CDN-URLs mit kurzer Lebensdauer und dürfen nicht persistiert oder
// ans Frontend durchgereicht werden - siehe InstagramSyncService.
// ---------------------------------------------------------------------------

public sealed record MediaResponse(
    [property: JsonPropertyName("data")] List<InstagramMedia> Data);

public sealed record InstagramMedia(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("media_type")] string MediaType,
    [property: JsonPropertyName("media_url")] string? MediaUrl,
    [property: JsonPropertyName("thumbnail_url")] string? ThumbnailUrl,
    [property: JsonPropertyName("caption")] string? Caption,
    [property: JsonPropertyName("permalink")] string Permalink,
    [property: JsonPropertyName("timestamp")] string Timestamp,
    [property: JsonPropertyName("like_count")] int? LikeCount,
    [property: JsonPropertyName("comments_count")] int? CommentsCount,
    [property: JsonPropertyName("children")] InstagramChildren? Children);

public sealed record InstagramChildren(
    [property: JsonPropertyName("data")] List<InstagramChild> Data);

public sealed record InstagramChild(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("media_type")] string MediaType,
    [property: JsonPropertyName("media_url")] string? MediaUrl);

public sealed record InstagramProfile(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("username")] string? Username,
    [property: JsonPropertyName("profile_picture_url")] string? ProfilePictureUrl);

// ---------------------------------------------------------------------------
// Was das Frontend bekommt: identische Feldnamen, aber alle *_url zeigen auf
// unseren eigenen Endpunkt und laufen damit nicht ab.
// ---------------------------------------------------------------------------

public sealed record InstagramFeedDto(
    [property: JsonPropertyName("user")] InstagramUserDto? User,
    [property: JsonPropertyName("data")] IReadOnlyList<InstagramPostDto> Data);

public sealed record InstagramUserDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("username")] string? Username,
    [property: JsonPropertyName("profile_picture_url")] string? ProfilePictureUrl);

public sealed record InstagramPostDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("media_type")] string MediaType,
    [property: JsonPropertyName("media_url")] string? MediaUrl,
    [property: JsonPropertyName("thumbnail_url")] string? ThumbnailUrl,
    [property: JsonPropertyName("caption")] string? Caption,
    [property: JsonPropertyName("permalink")] string Permalink,
    [property: JsonPropertyName("timestamp")] string Timestamp,
    [property: JsonPropertyName("like_count")] int? LikeCount,
    [property: JsonPropertyName("comments_count")] int? CommentsCount,
    [property: JsonPropertyName("children")] IReadOnlyList<InstagramChildDto>? Children,
    // Masse des gespiegelten Bildes, damit das Frontend das echte Seitenverhaeltnis
    // reservieren kann statt auf 1:1 zu beschneiden.
    [property: JsonPropertyName("width")] int? Width = null,
    [property: JsonPropertyName("height")] int? Height = null);

public sealed record InstagramChildDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("media_type")] string MediaType,
    [property: JsonPropertyName("media_url")] string? MediaUrl,
    [property: JsonPropertyName("width")] int? Width = null,
    [property: JsonPropertyName("height")] int? Height = null);
