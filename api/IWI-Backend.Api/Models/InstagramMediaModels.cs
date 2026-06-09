using System.Text.Json.Serialization;

namespace IWI_Backend.Api.Models;

public sealed record MediaResponse(
    [property: JsonPropertyName("data")] List<InstagramMedia> Data);

public sealed record InstagramMedia(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("media_type")] string MediaType,
    [property: JsonPropertyName("media_url")] string? MediaUrl,
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