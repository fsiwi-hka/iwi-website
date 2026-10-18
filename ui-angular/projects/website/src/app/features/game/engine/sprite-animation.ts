// sprite-animation.ts
// Lädt ein Sprite Sheet und verwaltet mehrere benannte Animationen mit
// unterschiedlicher Frame-Anzahl. Die Frames liegen in einem gleichmäßigen
// Raster (z. B. 48x48px), eine Zeile pro Animation.

export interface FrameRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface AnimationDef {
  frames: FrameRect[];
  fps: number;
  loop: boolean;
}

export type AnimationSet = Record<string, AnimationDef>;

export function buildGridAnimations(
  config: Record<string, { row: number; frameCount: number; fps?: number; loop?: boolean }>,
  frameWidth: number,
  frameHeight: number,
): AnimationSet {
  const result: AnimationSet = {};
  for (const [name, { row, frameCount, fps = 10, loop = true }] of Object.entries(config)) {
    const frames: FrameRect[] = [];
    for (let i = 0; i < frameCount; i++) {
      frames.push({ x: i * frameWidth, y: row * frameHeight, w: frameWidth, h: frameHeight });
    }
    result[name] = { frames, fps, loop };
  }
  return result;
}

// ---------------------------------------------------------------------------
// Player/State-Animator: spielt eine benannte Animation ab und zeichnet den Frame
// ---------------------------------------------------------------------------
export class SpriteAnimator {
  private frameIndex = 0;
  private elapsedMs = 0;
  private finished = false;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly animations: AnimationSet,
    private currentName: string,
  ) {}

  get current(): string {
    return this.currentName;
  }

  get isFinished(): boolean {
    return this.finished;
  }

  /** Wechselt die Animation. Kein Reset, wenn dieselbe Animation erneut gesetzt wird (verhindert Ruckeln). */
  play(name: string, opts: { restart?: boolean } = {}): void {
    if (!this.animations[name]) {
      console.warn(`Unbekannte Animation: "${name}"`);
      return;
    }
    if (this.currentName === name && !opts.restart) return;
    this.currentName = name;
    this.frameIndex = 0;
    this.elapsedMs = 0;
    this.finished = false;
  }

  /** dtMs = vergangene Zeit seit dem letzten Frame in Millisekunden. */
  update(dtMs: number): void {
    const anim = this.animations[this.currentName];
    if (!anim || this.finished || anim.frames.length === 0) return;

    this.elapsedMs += dtMs;
    const frameDuration = 1000 / anim.fps;
    while (this.elapsedMs >= frameDuration) {
      this.elapsedMs -= frameDuration;
      this.frameIndex++;
      if (this.frameIndex >= anim.frames.length) {
        if (anim.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = anim.frames.length - 1;
          this.finished = true;
        }
      }
    }
  }

  /** Zeichnet den aktuellen Frame skaliert auf (w, h). flipX spiegelt horizontal (z.B. Laufen nach links). */
  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    flipX = false,
  ): void {
    const anim = this.animations[this.currentName];
    if (!anim || anim.frames.length === 0) return;
    const frame = anim.frames[this.frameIndex];
    if (!frame) return;

    if (!flipX) {
      ctx.drawImage(this.image, frame.x, frame.y, frame.w, frame.h, x, y, w, h);
    } else {
      ctx.save();
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, frame.x, frame.y, frame.w, frame.h, 0, 0, w, h);
      ctx.restore();
    }
  }
}

/** Lädt ein Bild als Promise (Sprite Sheet oder Tileset). */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
    img.src = src;
  });
}
