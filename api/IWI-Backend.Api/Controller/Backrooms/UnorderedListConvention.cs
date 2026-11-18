using IWI_Backend.Api.Entities;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Entfernt <c>PUT .../order</c> bei Listen ohne Reihenfolge (Mitglieder,
/// Protokolle, Seiten), damit die Route weder existiert noch in Swagger steht.
/// </summary>
public sealed class UnorderedListConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        var entity = EntityType(controller.ControllerType);
        if (entity is null || typeof(IOrderedEntity).IsAssignableFrom(entity)) return;

        foreach (var action in controller.Actions.Where(a => a.ActionName == "Reorder").ToList())
            controller.Actions.Remove(action);
    }

    private static Type? EntityType(Type? type)
    {
        for (; type is not null; type = type.BaseType)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(ContentCrudController<,,>))
                return type.GetGenericArguments()[0];
        }
        return null;
    }
}
