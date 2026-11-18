namespace IWI_Backend.Api.Entities;

/// <summary>Datensaetze mit frei sortierbarer Reihenfolge (1-basiert).</summary>
public interface IOrderedEntity
{
    public int Order { get; set; }
}
