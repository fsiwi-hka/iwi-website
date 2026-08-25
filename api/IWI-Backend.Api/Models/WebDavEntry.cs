using IWI_Backend.Api.Services;

namespace IWI_Backend.Api.Models;

/// <summary>Basis für alles, was im WebDAV liegt (Datei oder Ordner).</summary>
public abstract class WebDavEntry
{
    private protected readonly WebDavClient Client;

    private protected WebDavEntry(WebDavClient client, string name, Uri href, DateTimeOffset? lastModified)
    {
        Client = client;
        Name = name;
        Href = href;
        LastModified = lastModified;
    }

    /// <summary>Reiner Anzeigename (letztes Pfadsegment, ohne Slash).</summary>
    public string Name { get; }

    /// <summary>Absolute URL der Ressource auf dem Server.</summary>
    public Uri Href { get; }

    public DateTimeOffset? LastModified { get; }

    public abstract bool IsFolder { get; }
}

public sealed class WebDavFile : WebDavEntry
{
    internal WebDavFile(WebDavClient client, string name, Uri href, DateTimeOffset? lastModified,
        long? size, string? contentType)
        : base(client, name, href, lastModified)
    {
        Size = size;
        ContentType = contentType;
    }

    public override bool IsFolder => false;
    public long? Size { get; }
    public string? ContentType { get; }

    /// <summary>Lädt diese Datei atomar (.tmp + Move) in den Zielpfad.</summary>
    public Task DownloadToAsync(string destPath, CancellationToken ct = default)
        => Client.DownloadToAsync(Href, destPath, ct);
}

public sealed class WebDavFolder : WebDavEntry
{
    internal WebDavFolder(WebDavClient client, string name, Uri href, DateTimeOffset? lastModified)
        : base(client, name, href, lastModified) { }

    public override bool IsFolder => true;

    /// <summary>Listet den Inhalt genau dieses Ordners (Depth: 1, ohne den Ordner selbst).</summary>
    public Task<WebDavListing> ListAsync(CancellationToken ct = default)
        => Client.ListAsync(Href, ct);
}

/// <summary>Ergebnis einer Auflistung – bequem getrennt nach Ordnern und Dateien.</summary>
public sealed class WebDavListing
{
    public WebDavListing(IReadOnlyList<WebDavFolder> folders, IReadOnlyList<WebDavFile> files)
    {
        Folders = folders;
        Files = files;
    }

    public IReadOnlyList<WebDavFolder> Folders { get; }
    public IReadOnlyList<WebDavFile> Files { get; }

    /// <summary>Alle Einträge zusammen (Ordner zuerst).</summary>
    public IEnumerable<WebDavEntry> All => Folders.Cast<WebDavEntry>().Concat(Files);
}