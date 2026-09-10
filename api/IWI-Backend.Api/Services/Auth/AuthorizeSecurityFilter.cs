using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace IWI_Backend.Api.Services.Auth;

/// <summary>
/// Haengt die Security-Anforderung an genau die Endpunkte mit [Authorize]. Ein
/// globales AddSecurityRequirement wuerde in Swagger auch alle oeffentlichen
/// Endpunkte als geschuetzt anzeigen.
///
/// Bewusst ein IDocumentFilter und kein IOperationFilter: OpenApiSecuritySchemeReference
/// braucht das OpenApiDocument, um den Schema-Namen aufzuloesen. Ohne das serialisiert
/// die Anforderung als leeres "{}" - Swagger UI haengt dann trotz Login keinen
/// Authorization-Header an und man bekommt 401.
/// </summary>
public sealed class AuthorizeSecurityFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument doc, DocumentFilterContext context)
    {
        var secured = context.ApiDescriptions
            .Where(RequiresAuth)
            .Select(a => "/" + a.RelativePath?.TrimEnd('/'))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var (path, item) in doc.Paths)
        {
            if (!secured.Contains(path.TrimEnd('/')) || item.Operations is null) continue;

            foreach (var op in item.Operations.Values)
            {
                op.Responses?.TryAdd("401", new OpenApiResponse { Description = "Token fehlt oder ist ungueltig" });
                op.Security =
                [
                    new OpenApiSecurityRequirement
                    {
                        [new OpenApiSecuritySchemeReference(FixedTokenHandler.SchemeName, doc)] = []
                    }
                ];
            }
        }
    }

    private static bool RequiresAuth(ApiDescription api) =>
        api.ActionDescriptor is ControllerActionDescriptor d
        && (d.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
            || d.ControllerTypeInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any());
}
