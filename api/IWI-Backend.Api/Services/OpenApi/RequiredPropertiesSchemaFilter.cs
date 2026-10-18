using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace IWI_Backend.Api.Services.OpenApi;

/// <summary>
/// Markiert jede serialisierte Eigenschaft im Schema als "required".
///
/// System.Text.Json schreibt jede Eigenschaft immer mit raus, auch wenn sie null ist.
/// Swashbuckle laesst "required" trotzdem leer, und der daraus generierte
/// TypeScript-Client macht dann jedes Feld optional ("title?: string"). Mit
/// "required" wird daraus "title: string" bzw. "url: string | null" - ob ein Feld
/// null sein darf, steuert weiterhin die Nullable-Annotation in C#
/// (SupportNonNullableReferenceTypes).
/// </summary>
public sealed class RequiredPropertiesSchemaFilter : ISchemaFilter
{
    private readonly NullabilityInfoContext _nullability = new();

    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema is not OpenApiSchema concrete || concrete.Properties is null || concrete.Properties.Count == 0)
            return;

        foreach (var property in context.Type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (property.GetCustomAttribute<JsonIgnoreAttribute>() is not null) continue;

            var name = property.GetCustomAttribute<JsonPropertyNameAttribute>()?.Name
                       ?? JsonNamingPolicy.CamelCase.ConvertName(property.Name);
            if (!concrete.Properties.ContainsKey(name)) continue;

            concrete.Required ??= new HashSet<string>();
            concrete.Required.Add(name);

            // Eine nullable Referenz ("InstagramUserDto? User") steht sonst als nacktes
            // $ref im Schema - OpenAPI 3.0 ignoriert "nullable" neben $ref, das "?" ginge
            // verloren. In ein allOf gepackt bleibt es erhalten.
            if (concrete.Properties[name] is OpenApiSchemaReference reference
                && _nullability.Create(property).ReadState == NullabilityState.Nullable)
            {
                concrete.Properties[name] = new OpenApiSchema
                {
                    AllOf = [reference],
                    Type = JsonSchemaType.Null
                };
            }
        }
    }
}
