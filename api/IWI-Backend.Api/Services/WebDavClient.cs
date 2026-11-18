using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Xml.Linq;
using IWI_Backend.Api.Configuration;
using IWI_Backend.Api.Models;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

public sealed class WebDavClient
{
    private static readonly XNamespace D = "DAV:";
    private static readonly HttpMethod Propfind = new("PROPFIND");

    private const string PropfindBody =
        """<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/><d:getlastmodified/><d:getcontentlength/><d:getcontenttype/><d:resourcetype/></d:prop></d:propfind>""";

    private readonly HttpClient _http;

    public WebDavClient(HttpClient http, IOptions<WebDavOptions> opts)
    {
        _http = http;
        var o = opts.Value;

        if (!string.IsNullOrEmpty(o.Username))
        {
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{o.Username}:{o.Password}"));
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", token);
        }
    }

    /// <summary>Einstiegspunkt: liefert einen Ordner, auf dem du ListAsync() aufrufen kannst.</summary>
    public WebDavFolder GetFolder(string url)
    {
        var uri = new Uri(url, UriKind.Absolute);
        var name = uri.Segments.Length > 0
            ? Uri.UnescapeDataString(uri.Segments[^1]).TrimEnd('/')
            : uri.Host;
        return new WebDavFolder(this, name, uri, lastModified: null);
    }

    /// <summary>Listet den Inhalt eines Ordners (Depth: 1). Der Ordner selbst wird herausgefiltert.</summary>
    public async Task<WebDavListing> ListAsync(Uri folderHref, CancellationToken ct = default)
    {
        using var req = new HttpRequestMessage(Propfind, folderHref);
        req.Headers.Add("Depth", "1");
        req.Content = new StringContent(PropfindBody, Encoding.UTF8, "application/xml");

        using var resp = await _http.SendAsync(req, ct);
        resp.EnsureSuccessStatusCode(); // 207 Multi-Status

        var xml = await resp.Content.ReadAsStringAsync(ct);
        var doc = XDocument.Parse(xml);

        var folders = new List<WebDavFolder>();
        var files = new List<WebDavFile>();

        // Ordner sich selbst identifizieren (Pfad-Vergleich, Slash-normalisiert).
        var selfPath = folderHref.AbsolutePath.TrimEnd('/');

        foreach (var r in doc.Descendants(D + "response"))
        {
            var rawHref = r.Element(D + "href")?.Value;
            if (string.IsNullOrEmpty(rawHref)) continue;

            var abs = new Uri(folderHref, rawHref);
            if (abs.AbsolutePath.TrimEnd('/') == selfPath) continue; // Ordner selbst überspringen

            var isCollection = r.Descendants(D + "collection").Any();

            var name = Uri.UnescapeDataString(abs.Segments[^1]).TrimEnd('/');
            if (string.IsNullOrEmpty(name)) continue;

            var lastMod = ParseHttpDate(Prop(r, "getlastmodified"));

            if (isCollection)
            {
                folders.Add(new WebDavFolder(this, name, abs, lastMod));
            }
            else
            {
                long? size = long.TryParse(Prop(r, "getcontentlength"), out var s) ? s : null;
                var contentType = Prop(r, "getcontenttype");
                files.Add(new WebDavFile(this, name, abs, lastMod, size, contentType));
            }
        }

        return new WebDavListing(folders, files);
    }

    public async Task DownloadToAsync(Uri href, string destPath, CancellationToken ct = default)
    {
        using var resp = await _http.GetAsync(href, HttpCompletionOption.ResponseHeadersRead, ct);
        resp.EnsureSuccessStatusCode();

        var tmp = destPath + ".tmp";
        await using (var fs = File.Create(tmp))
        {
            await resp.Content.CopyToAsync(fs, ct);
        }
        File.Move(tmp, destPath, overwrite: true);
    }

    public async Task<byte[]> ReadAllBytesAsync(Uri href, CancellationToken ct = default)
    {
        using var resp = await _http.GetAsync(href, ct);
        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadAsByteArrayAsync(ct);
    }

    /// <summary>Legt eine Datei an oder ersetzt sie (PUT).</summary>
    public async Task UploadAsync(Uri href, Stream content, string contentType, CancellationToken ct = default)
    {
        using var body = new StreamContent(content);
        body.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        using var resp = await _http.PutAsync(href, body, ct);
        resp.EnsureSuccessStatusCode();
    }

    /// <summary>Loescht Datei oder Ordner. In der Nextcloud landet beides im Papierkorb.</summary>
    public async Task DeleteAsync(Uri href, CancellationToken ct = default)
    {
        using var resp = await _http.SendAsync(new HttpRequestMessage(HttpMethod.Delete, href), ct);
        if (resp.StatusCode == System.Net.HttpStatusCode.NotFound) return;
        resp.EnsureSuccessStatusCode();
    }

    /// <summary>Verschiebt bzw. benennt um; ein vorhandenes Ziel wird nicht ueberschrieben.</summary>
    public async Task MoveAsync(Uri from, Uri to, CancellationToken ct = default)
    {
        using var req = new HttpRequestMessage(new HttpMethod("MOVE"), from);
        req.Headers.Add("Destination", to.AbsoluteUri);
        req.Headers.Add("Overwrite", "F");
        using var resp = await _http.SendAsync(req, ct);
        resp.EnsureSuccessStatusCode();
    }

    /// <summary>Legt einen Ordner an (MKCOL); existiert er schon, passiert nichts.</summary>
    public async Task CreateFolderAsync(Uri href, CancellationToken ct = default)
    {
        using var resp = await _http.SendAsync(new HttpRequestMessage(new HttpMethod("MKCOL"), href), ct);
        if (resp.StatusCode == System.Net.HttpStatusCode.MethodNotAllowed) return; // existiert bereits
        resp.EnsureSuccessStatusCode();
    }

    /// <summary>URL eines Eintrags in einem Ordner (Name wird kodiert, Ordner bekommen einen Slash).</summary>
    public static Uri Child(Uri folder, string name, bool isFolder = false)
    {
        var baseUri = folder.AbsoluteUri.EndsWith('/') ? folder : new Uri(folder.AbsoluteUri + "/");
        return new Uri(baseUri, Uri.EscapeDataString(name) + (isFolder ? "/" : ""));
    }

    private static string? Prop(XElement response, string name)
        => response.Descendants(D + name).FirstOrDefault()?.Value;

    private static DateTimeOffset? ParseHttpDate(string? value)
        => DateTimeOffset.TryParse(value, CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal, out var dt) ? dt : null;
}