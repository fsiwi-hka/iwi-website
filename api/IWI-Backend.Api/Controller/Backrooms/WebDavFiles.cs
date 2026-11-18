using IWI_Backend.Api.Entities;
using IWI_Backend.Api.Models.Backrooms;
using IWI_Backend.Api.Services;

namespace IWI_Backend.Api.Controller.Backrooms;

/// <summary>
/// Gemeinsames fuer die WebDAV-Spiegel (Infoscreen, Protokolle): Dateinamen
/// pruefen und frische Uploads aus der Backrooms-Mediathek ins WebDAV legen.
/// </summary>
public static class WebDavFiles
{
    /// <summary>Fehlertext, wenn der Name nicht als Dateiname taugt, sonst null.</summary>
    public static string? CheckName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "Der Name darf nicht leer sein.";
        if (name.Length > 120) return "Der Name ist zu lang (max. 120 Zeichen).";
        if (name.StartsWith('.') || name.Contains("..")) return "Der Name darf nicht mit einem Punkt beginnen.";
        if (name.IndexOfAny(['/', '\\', ':', '*', '?', '"', '<', '>', '|']) >= 0 || name.Any(char.IsControl))
            return "Der Name darf keines dieser Zeichen enthalten: / \\ : * ? \" < > |";
        return null;
    }

    /// <summary>Ist das ein frischer Upload aus der Mediathek (statt der schon im WebDAV liegenden Datei)?</summary>
    public static bool IsUpload(MediaRef? media) => !string.IsNullOrEmpty(media?.Id);

    /// <summary>
    /// Legt einen Mediathek-Upload unter <paramref name="target"/> ins WebDAV und
    /// entfernt ihn danach aus der Mediathek. Null, wenn der Upload fehlt.
    /// </summary>
    public static async Task<bool> MoveUploadAsync(
        WebDavClient webdav, MediaLibrary library, MediaRef media, Uri target, CancellationToken ct)
    {
        var path = media.Id is { } id ? library.Locate(id) : null;
        if (path is null) return false;

        await using (var stream = File.OpenRead(path))
            await webdav.UploadAsync(target, stream, media.ContentType, ct);

        try { File.Delete(path); } catch { /* bleibt als Waise liegen, schadet nicht */ }
        return true;
    }

    /// <summary>Endung des Uploads (".mp4"), ersatzweise aus dem Inhaltstyp.</summary>
    public static string Extension(MediaRef media) =>
        Path.GetExtension(media.Name) is { Length: > 1 } ext ? ext.ToLowerInvariant() : media.ContentType switch
        {
            "application/pdf" => ".pdf",
            "image/png" => ".png",
            "image/jpeg" => ".jpg",
            "image/webp" => ".webp",
            "video/mp4" => ".mp4",
            "video/webm" => ".webm",
            _ => "",
        };
}
