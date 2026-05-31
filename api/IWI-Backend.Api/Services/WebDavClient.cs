using System.Net.Http.Headers;
using System.Text;
using System.Xml.Linq;
using IWI_Backend.Api.Configuration;
using Microsoft.Extensions.Options;

namespace IWI_Backend.Api.Services;

public sealed record WebDavFile(string Name, string Href, string? LastModified, long? Size);

/// <summary>
/// Minimaler WebDAV-Client (PROPFIND zum Auflisten, GET zum Download).
/// Funktioniert mit Nextcloud/ownCloud und jedem RFC-4918-konformen Server.
/// </summary>
public sealed class WebDavClient
{
    private static readonly XNamespace D = "DAV:";
    private static readonly HttpMethod Propfind = new("PROPFIND");

    private const string PropfindBody =
        """<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:getlastmodified/><d:getcontentlength/><d:resourcetype/></d:prop></d:propfind>""";

    private readonly HttpClient _http;
    private readonly WebDavOptions _opts;

    public WebDavClient(HttpClient http, IOptions<WebDavOptions> opts)
    {
        _http = http;
        _opts = opts.Value;

        if (!string.IsNullOrEmpty(_opts.Username))
        {
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_opts.Username}:{_opts.Password}"));
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", token);
        }
    }

    /// <summary>Listet alle Dateien (keine Unterordner) des konfigurierten Ordners.</summary>
    public async Task<IReadOnlyList<WebDavFile>> ListAsync(CancellationToken ct)
    {
        using var req = new HttpRequestMessage(Propfind, _opts.BaseUrl);
        req.Headers.Add("Depth", "1");
        req.Content = new StringContent(PropfindBody, Encoding.UTF8, "application/xml");

        using var resp = await _http.SendAsync(req, ct);
        resp.EnsureSuccessStatusCode();

        var xml = await resp.Content.ReadAsStringAsync(ct);
        var doc = XDocument.Parse(xml);
        var baseUri = new Uri(_opts.BaseUrl);

        var files = new List<WebDavFile>();
        foreach (var r in doc.Descendants(D + "response"))
        {
            var href = r.Element(D + "href")?.Value;
            if (string.IsNullOrEmpty(href)) continue;

            // Ordner (Collection) selbst und Unterordner überspringen
            if (r.Descendants(D + "collection").Any()) continue;

            var abs = new Uri(baseUri, href);
            var name = Uri.UnescapeDataString(abs.Segments[^1]).TrimEnd('/');
            if (string.IsNullOrEmpty(name)) continue;

            var lastMod = r.Descendants(D + "getlastmodified").FirstOrDefault()?.Value;
            long? size = long.TryParse(r.Descendants(D + "getcontentlength").FirstOrDefault()?.Value, out var s)
                ? s : null;

            files.Add(new WebDavFile(name, abs.AbsoluteUri, lastMod, size));
        }

        return files;
    }

    /// <summary>Lädt eine Datei atomar (über .tmp + Move) in den Zielpfad.</summary>
    public async Task DownloadToAsync(string href, string destPath, CancellationToken ct)
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
}
