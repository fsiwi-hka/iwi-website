// tileset.ts
// Rendert einzelne Kacheln aus einem Tileset (z.B. 48x48px Kacheln).

export interface TileSetOptions {
  tileWidth: number;
  tileHeight: number;
  columns: number; // Anzahl Spalten im Tileset-Bild
}

export class TileSet {
  constructor(
    private readonly image: HTMLImageElement,
    private readonly options: TileSetOptions,
  ) {}

  /** Zeichnet eine einzelne Kachel per Index (0-basiert, zeilenweise von links oben gezählt). */
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileIndex: number,
    destX: number,
    destY: number,
    destW: number = this.options.tileWidth,
    destH: number = this.options.tileHeight,
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
      destH,
    );
  }
}
