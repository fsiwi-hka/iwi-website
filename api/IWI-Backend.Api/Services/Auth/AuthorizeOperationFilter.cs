using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace IWI_Backend.Api.Services.Auth;

/// <summary>
/// Haengt die Security-Anforderung nur an Endpunkte mit [Authorize]. Ein globales
/// AddSecurityRequirement wuerde in Swagger auch die oeffentlichen Endpunkte als
/// geschuetzt anzeigen.
/// </summary>
public sealed class AuthorizeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var authorized = context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
            || (context.MethodInfo.DeclaringType?.GetCustomAttributes(true)
                    .OfType<AuthorizeAttribute>().Any() ?? false);

        if (!authorized) return;

        operation.Responses.TryAdd("401", new OpenApiResponse { Description = "Token fehlt oder ist ungueltig" });
        operation.Security =
        [
            new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(FixedTokenHandler.SchemeName)] = []
            }
        ];
    }
}
