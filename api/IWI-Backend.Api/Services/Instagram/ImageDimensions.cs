using System.Buffers.Binary;

namespace IWI_Backend.Api.Services;

/// <summary>
/// Liest Breite und Hoehe aus dem Dateikopf, ohne das Bild zu dekodieren.
/// Instagram liefert JPEG und WebP; PNG und GIF sind der Vollstaendigkeit halber dabei.
/// </summary>
public static class ImageDimensions
{
    public static (int Width, int Height)? TryRead(string path)
    {
        try
        {
            using var fs = File.OpenRead(path);
            Span<byte> head = stackalloc byte[32];
            var read = fs.ReadAtLeast(head, 32, throwOnEndOfStream: false);
            if (read < 12) return null;

            if (head[0] == 0xFF && head[1] == 0xD8) return ReadJpeg(fs);
            if (head is [0x89, (byte)'P', (byte)'N', (byte)'G', ..]) return ReadPng(head);
            if (head is [(byte)'G', (byte)'I', (byte)'F', ..]) return ReadGif(head);
            if (head is [(byte)'R', (byte)'I', (byte)'F', (byte)'F', ..] &&
                head[8..12].SequenceEqual("WEBP"u8)) return ReadWebp(head, read);

            return null;
        }
        catch
        {
            return null;
        }
    }

    private static (int, int)? ReadPng(ReadOnlySpan<byte> head) =>
        (BinaryPrimitives.ReadInt32BigEndian(head[16..]),
         BinaryPrimitives.ReadInt32BigEndian(head[20..]));

    private static (int, int)? ReadGif(ReadOnlySpan<byte> head) =>
        (BinaryPrimitives.ReadUInt16LittleEndian(head[6..]),
         BinaryPrimitives.ReadUInt16LittleEndian(head[8..]));

    /// <summary>Sucht den SOF-Marker, der Hoehe und Breite traegt.</summary>
    private static (int, int)? ReadJpeg(FileStream fs)
    {
        fs.Position = 2;
        Span<byte> buf = stackalloc byte[9];

        while (true)
        {
            // Bis zum naechsten Marker vorspulen ...
            int b;
            do { b = fs.ReadByte(); } while (b >= 0 && b != 0xFF);
            if (b < 0) return null;

            // ... mehrere 0xFF hintereinander sind erlaubtes Fuellmaterial.
            do { b = fs.ReadByte(); } while (b == 0xFF);
            if (b < 0) return null;

            var marker = (byte)b;
            if (marker is 0xD8 or 0x01 || (marker >= 0xD0 && marker <= 0xD7)) continue; // ohne Payload
            if (marker == 0xD9 || marker == 0xDA) return null;                          // Bildende/-daten

            if (fs.ReadAtLeast(buf[..2], 2, throwOnEndOfStream: false) < 2) return null;
            var length = BinaryPrimitives.ReadUInt16BigEndian(buf);
            if (length < 2) return null;

            // SOF0-SOF15, ohne DHT (C4), JPG (C8) und DAC (CC).
            var isSof = marker >= 0xC0 && marker <= 0xCF && marker is not (0xC4 or 0xC8 or 0xCC);
            if (isSof)
            {
                if (fs.ReadAtLeast(buf[..5], 5, throwOnEndOfStream: false) < 5) return null;
                return (BinaryPrimitives.ReadUInt16BigEndian(buf[3..]),  // Breite
                        BinaryPrimitives.ReadUInt16BigEndian(buf[1..])); // Hoehe
            }

            fs.Position += length - 2;
        }
    }

    private static (int, int)? ReadWebp(ReadOnlySpan<byte> head, int read)
    {
        if (read < 30) return null;
        var chunk = head[12..16];

        // Erweitertes Format: Canvas-Groesse minus eins, je 24 Bit little-endian.
        if (chunk.SequenceEqual("VP8X"u8))
            return (1 + (head[24] | head[25] << 8 | head[26] << 16),
                    1 + (head[27] | head[28] << 8 | head[29] << 16));

        // Verlustbehaftet: nach dem Startcode 9D 01 2A folgen je 14 Bit.
        if (chunk.SequenceEqual("VP8 "u8) && head[23] == 0x9D && head[24] == 0x01 && head[25] == 0x2A)
            return (BinaryPrimitives.ReadUInt16LittleEndian(head[26..]) & 0x3FFF,
                    BinaryPrimitives.ReadUInt16LittleEndian(head[28..]) & 0x3FFF);

        // Verlustfrei: 14 Bit Breite-1, dann 14 Bit Hoehe-1, ab Bit 5 nach der Signatur.
        if (chunk.SequenceEqual("VP8L"u8) && head[20] == 0x2F)
        {
            var bits = (uint)(head[21] | head[22] << 8 | head[23] << 16 | head[24] << 24);
            return (1 + (int)(bits & 0x3FFF), 1 + (int)((bits >> 14) & 0x3FFF));
        }

        return null;
    }
}
