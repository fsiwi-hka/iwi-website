// tileSet.ts
// Rendert ein Tile-basiertes Tileset (z.B. 48x48px Kacheln) und eine Tilemap.

export interface TileSetOptions {
    tileWidth: number;
    tileHeight: number;
    columns: number; // Anzahl Spalten im Tileset-Bild
}

export class TileSet {
    constructor(
        private image: HTMLImageElement,
        private options: TileSetOptions
    ) {}

    /** Zeichnet eine einzelne Kachel per Index (0-basiert, zeilenweise von links oben gezählt). */
    drawTile(
        ctx: CanvasRenderingContext2D,
        tileIndex: number,
        destX: number,
        destY: number,
        destW: number = this.options.tileWidth,
        destH: number = this.options.tileHeight
    ): void {
        if (tileIndex < 0) return; // Konvention: -1 = leere Kachel
        const { tileWidth, tileHeight, columns } = this.options;
        const col = tileIndex % columns;
        const row = Math.floor(tileIndex / columns);
        ctx.drawImage(
            this.image,
            col * tileWidth,
            row * tileHeight,
            tileWidth,
            tileHeight,
            destX,
            destY,
            destW,
            destH
        );
    }
}

/** Einfache 2D-Tilemap: Zeilen von Kachel-Indizes, -1 = leer. */
export type TileMap = number[][];

/**
 * Zeichnet nur die Kacheln im sichtbaren Bereich (Culling anhand des horizontalen
 * Kamera-Offsets in Pixeln) — wichtig, sobald die Map beliebig lang/prozedural wird.
 */
export function drawTileMap(
    ctx: CanvasRenderingContext2D,
    tileSet: TileSet,
    map: TileMap,
    tileSize: number,
    cameraOffsetX: number,
    viewportWidth: number,
    viewportHeight: number
): void {
    const firstCol = Math.max(0, Math.floor(cameraOffsetX / tileSize));
    const lastCol = Math.ceil((cameraOffsetX + viewportWidth) / tileSize);

    for (let row = 0; row < map.length; row++) {
        const y = row * tileSize;
        if (y > viewportHeight) break;
        const tileRow = map[row];
        if (!tileRow) continue;
        for (let col = firstCol; col <= lastCol; col++) {
            const tileIndex = tileRow[col];
            if (tileIndex === undefined || tileIndex < 0) continue;
            const x = col * tileSize - cameraOffsetX;
            tileSet.drawTile(ctx, tileIndex, x, y, tileSize, tileSize);
        }
    }
}