// game.ts
// Framework-unabhängige Game-Engine für den Endless Runner (Chrome-Dino-Prinzip):
// flacher Boden, der Spieler läuft automatisch, Steine kommen von rechts, springen
// oder Game Over. Nutzt spriteAnimation.ts (Spieler) und tileset.ts (Boden + Stein).

import { SpriteAnimator, buildGridAnimations, loadImage, type AnimationSet } from "./spriteAnimation";
import { TileSet } from "./tileset";

export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;

const TILE_SIZE = 48;
const GROUND_Y = 280; // Oberkante des Bodens
const PLAYER_W = 48;
const PLAYER_H = 48;
const PLAYER_SCREEN_X = 90;

// Bewegungs-Konstanten sind für 60 FPS getunt und werden über FRAME_MS auf die
// tatsächliche Framedauer normiert, damit 144Hz-Monitore nicht schneller laufen.
const FRAME_MS = 1000 / 60;
const MAX_STEP = 3; // Sprung nach Tab-Wechsel deckeln, sonst tunnelt man durch Hindernisse
// Sprung: ~130px hoch, ~42 Frames Luft. Damit bleibt beim Starttempo ein
// Reaktionsfenster von gut 360ms auf ein Hindernis – mit strafferem Sprung
// waren es nur ~280ms und das erste Hindernis war unfair knapp.
const GRAVITY = 0.6;
const JUMP_FORCE = -12.5;

const START_SPEED = 5;
const MAX_SPEED = 13;
const SPEED_GAIN = 0.0015; // pro Frame @60 -> Höchsttempo nach gut einer Minute
const DOUBLE_STONE_SPEED = 8; // ab hier gibt es auch Doppelsteine

// ---------------------------------------------------------------------------
// Assets. Das Tileset ist ein 192x192-Bild mit 48x48-Kacheln (= 4 Spalten).
// ---------------------------------------------------------------------------
const PLAYER_SHEET_SRC = "/assets/game/sprites.png";
const TILESET_SRC = "/assets/game/tileset.png";
const TILESET_COLUMNS = 4;
const GROUND_TILE_INDEX = 0;
const STONE_TILE_INDEX = 1;

// Farbe unterhalb der Grasnarbe – entspricht der Erde in tileset.png. Die Kachel
// vertikal zu wiederholen würde Grasstreifen mitten im Boden erzeugen.
const DIRT_COLOR = "#996a47";
const SKY_COLOR = "#1b1f2a";

const PLAYER_ANIMATIONS: Parameters<typeof buildGridAnimations>[0] = {
    run: { row: 0, frameCount: 2, fps: 12 },
    // Eigenes Sprungbild gibt es im Sheet nicht -> erster Run-Frame als Standbild.
    jump: { row: 0, frameCount: 1, fps: 1, loop: false },
    dead: { row: 1, frameCount: 3, fps: 5, loop: true },
};

// Trefferflächen, abgemessen an den sichtbaren Pixeln im Sheet: der Stein sitzt in
// seiner Kachel bei x 2..45 / y 18..47, der Vogel füllt seine Kachel fast ganz aus.
// Beim Spieler zusätzlich etwas Kulanz, damit knappe Sprünge nicht unfair wirken.
const STONE_INSET_X = 2;
const STONE_HEIGHT = 30;
const PLAYER_INSET_X = 8;
const PLAYER_INSET_TOP = 6;

// Endscreen: die Sterbe-Animation gross zeigen. Die dead-Frames füllen ihre
// Kachel nicht aus – sichtbare Pixel erst ab y=19 –, deshalb wird für die
// Zentrierung die Kunsthöhe gerechnet und nicht die Kachelhöhe.
const DEAD_SCALE = 3;
const DEAD_ART_TOP = 19;

interface Obstacle {
    x: number; // Bildschirm-X der linken Kachelkante
}

interface Player {
    y: number;
    vy: number;
    onGround: boolean;
}

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

/** Horizontale Strecke, die ein voller Sprung beim aktuellen Tempo überbrückt. */
function jumpDistance(speed: number): number {
    const airFrames = (2 * -JUMP_FORCE) / GRAVITY;
    return speed * airFrames;
}

export interface PlatformerGameOptions {
    onGameOver?: (score: number, best: number) => void;
}

export class PlatformerGame {
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private sprite!: SpriteAnimator; // wird in load() gesetzt
    private tileSet!: TileSet; // wird in load() gesetzt
    private obstacles: Obstacle[] = [];
    private nextGap = 0;
    private speed = START_SPEED;
    private groundOffset = 0;
    private gameOver = false;
    private score = 0;
    private bestScore = 0;
    private distance = 0;
    private animationId: number | null = null;
    private running = false;
    private lastTimestamp = 0;
    private ready = false;

    // Sprung wird direkt beim Tastendruck ausgelöst statt in update() abgefragt:
    // ein kurzer Tipp zwischen zwei Frames ginge sonst verloren.
    private handleKeyDown = (e: KeyboardEvent) => {
        if (["ArrowUp", " ", "w", "r", "R"].includes(e.key)) e.preventDefault();
        if ((e.key === "r" || e.key === "R") && this.gameOver) {
            this.reset();
            return;
        }
        if (e.key === "ArrowUp" || e.key === " " || e.key === "w") this.tryJump();
    };

    /** Tippen/Klicken auf das Spielfeld – sonst wäre es auf Touch-Geräten unspielbar. */
    private handlePointerDown = (e: Event) => {
        e.preventDefault();
        if (this.gameOver) this.reset();
        else this.tryJump();
    };

    private tryJump(): void {
        if (this.gameOver || !this.player.onGround) return;
        this.player.vy = JUMP_FORCE;
        this.player.onGround = false;
    }

    private constructor(
        private canvas: HTMLCanvasElement,
        private options: PlatformerGameOptions = {}
    ) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D-Context konnte nicht erstellt werden");
        this.ctx = ctx;
        this.player = { y: GROUND_Y - PLAYER_H, vy: 0, onGround: true };
    }

    /**
     * Lädt Assets asynchron und liefert eine startklare Instanz zurück.
     * Nutzung: const game = await PlatformerGame.create(canvas);
     */
    static async create(canvas: HTMLCanvasElement, options: PlatformerGameOptions = {}): Promise<PlatformerGame> {
        const game = new PlatformerGame(canvas, options);
        await game.load();
        game.reset();
        return game;
    }

    private async load(): Promise<void> {
        const [playerImg, tilesetImg] = await Promise.all([
            loadImage(PLAYER_SHEET_SRC),
            loadImage(TILESET_SRC),
        ]);

        const animations: AnimationSet = buildGridAnimations(PLAYER_ANIMATIONS, PLAYER_W, PLAYER_H);
        this.sprite = new SpriteAnimator(playerImg, animations, "run");
        this.tileSet = new TileSet(tilesetImg, { tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, columns: TILESET_COLUMNS });
        // Pixel-Art nicht weichzeichnen
        this.ctx.imageSmoothingEnabled = false;
        this.ready = true;
    }

    reset(): void {
        this.player = { y: GROUND_Y - PLAYER_H, vy: 0, onGround: true };
        this.obstacles = [];
        this.speed = START_SPEED;
        this.groundOffset = 0;
        this.distance = 0;
        this.score = 0;
        this.gameOver = false;
        // Erstes Hindernis mit Anlauf, damit man nicht sofort springen muss.
        this.spawnObstacle(GAME_WIDTH + randomBetween(120, 260));
        this.rollNextGap();
        this.sprite?.play("run", { restart: true });
    }

    start(): void {
        if (!this.ready) {
            console.warn("PlatformerGame.start() aufgerufen, bevor Assets geladen wurden. Nutze PlatformerGame.create().");
            return;
        }
        if (this.running) return;
        this.running = true;
        window.addEventListener("keydown", this.handleKeyDown);
        this.canvas.addEventListener("pointerdown", this.handlePointerDown);
        this.lastTimestamp = performance.now();
        this.animationId = requestAnimationFrame(this.loop);
    }

    stop(): void {
        this.running = false;
        if (this.animationId !== null) cancelAnimationFrame(this.animationId);
        this.animationId = null;
        window.removeEventListener("keydown", this.handleKeyDown);
        this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    }

    destroy(): void {
        this.stop();
    }

    private spawnObstacle(x: number): void {
        this.obstacles.push({ x });
    }

    /**
     * Setzt bei Bedarf ein neues Hindernis. Die Lücke wird beim Spawn einmal
     * ausgewürfelt und gemerkt – würfelte man sie in jedem Frame neu, gewänne
     * immer der kleinste Wurf und alle Abstände lägen am Minimum.
     */
    private rollNextGap(): void {
        const reach = jumpDistance(this.speed);
        this.nextGap = randomBetween(reach * 1.15 + PLAYER_W, reach * 2.6);
    }

    private maybeSpawn(): void {
        const last = this.obstacles[this.obstacles.length - 1];
        if (last && last.x > GAME_WIDTH - this.nextGap) return;

        const x = Math.max(GAME_WIDTH, (last?.x ?? 0) + this.nextGap);
        this.spawnObstacle(x);
        // Gelegentlich ein Doppelhindernis, aber erst ab höherem Tempo: beim
        // Starttempo bliebe dafür nur ~220ms Reaktionszeit statt ~360ms.
        if (this.speed >= DOUBLE_STONE_SPEED && Math.random() < 0.25) {
            this.spawnObstacle(x + TILE_SIZE - STONE_INSET_X * 2);
        }
        this.rollNextGap();
    }

    private hitsObstacle(): boolean {
        const px = PLAYER_SCREEN_X + PLAYER_INSET_X;
        const pRight = PLAYER_SCREEN_X + PLAYER_W - PLAYER_INSET_X;
        const pTop = this.player.y + PLAYER_INSET_TOP;
        const pBottom = this.player.y + PLAYER_H;

        for (const o of this.obstacles) {
            const oLeft = o.x + STONE_INSET_X;
            const oRight = o.x + TILE_SIZE - STONE_INSET_X;
            if (pRight <= oLeft || px >= oRight) continue;
            if (pBottom > GROUND_Y - STONE_HEIGHT && pTop < GROUND_Y) return true;
        }
        return false;
    }

    private update(dtMs: number): void {
        // Nach unten auf 0 klemmen: der erste rAF-Timestamp kann vor dem
        // performance.now() aus start() liegen, ein negativer Schritt würde
        // Schwerkraft und Tempo umkehren und den Spieler ins Nirwana schießen.
        const step = Math.max(0, Math.min(dtMs / FRAME_MS, MAX_STEP));
        const p = this.player;

        // Nach dem Game Over fällt der Vogel noch zu Boden, die Welt steht still.
        if (this.gameOver) {
            if (!p.onGround) {
                p.vy += GRAVITY * step;
                p.y += p.vy * step;
                if (p.y + PLAYER_H >= GROUND_Y) {
                    p.y = GROUND_Y - PLAYER_H;
                    p.vy = 0;
                    p.onGround = true;
                }
            }
            this.sprite.update(dtMs);
            return;
        }

        this.speed = Math.min(MAX_SPEED, this.speed + SPEED_GAIN * step);
        const moved = this.speed * step;
        this.distance += moved;
        this.score = Math.floor(this.distance / 10);
        this.groundOffset = (this.groundOffset + moved) % TILE_SIZE;

        p.vy += GRAVITY * step;
        p.y += p.vy * step;

        const wasOnGround = p.onGround;
        p.onGround = false;
        if (p.y + PLAYER_H >= GROUND_Y && p.vy >= 0) {
            p.y = GROUND_Y - PLAYER_H;
            p.vy = 0;
            p.onGround = true;
        }

        for (const o of this.obstacles) o.x -= moved;
        this.obstacles = this.obstacles.filter((o) => o.x > -TILE_SIZE);
        this.maybeSpawn();

        if (this.hitsObstacle()) {
            this.gameOver = true;
            this.sprite.play("dead", { restart: true });
            this.bestScore = Math.max(this.bestScore, this.score);
            this.options.onGameOver?.(this.score, this.bestScore);
            return;
        }

        // Animation passend zum Zustand wechseln
        if (!p.onGround) {
            this.sprite.play("jump");
        } else if (!wasOnGround) {
            this.sprite.play("run", { restart: true });
        }
        this.sprite.update(dtMs);
    }

    private drawGround(): void {
        const ctx = this.ctx;
        // Erdreich unter der Grasnarbe als Fläche, darüber eine Reihe Boden-Kacheln.
        ctx.fillStyle = DIRT_COLOR;
        ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
        for (let x = -this.groundOffset; x < GAME_WIDTH; x += TILE_SIZE) {
            this.tileSet.drawTile(ctx, GROUND_TILE_INDEX, Math.round(x), GROUND_Y, TILE_SIZE, TILE_SIZE);
        }
    }

    private draw(): void {
        const ctx = this.ctx;

        ctx.fillStyle = SKY_COLOR;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.drawGround();

        for (const o of this.obstacles) {
            this.tileSet.drawTile(ctx, STONE_TILE_INDEX, Math.round(o.x), GROUND_Y - TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        this.sprite.draw(ctx, PLAYER_SCREEN_X, Math.round(this.player.y), PLAYER_W, PLAYER_H);

        ctx.fillStyle = "#e5e7eb";
        ctx.font = "16px sans-serif";
        ctx.fillText(`Distanz: ${this.score}m`, 16, 26);
        ctx.fillText(`Best: ${this.bestScore}m`, 16, 46);

        if (this.gameOver) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            this.drawGameOverScreen();
        }
    }

    /** Sterbe-Animation gross plus Beschriftung, als Block vertikal zentriert. */
    private drawGameOverScreen(): void {
        const ctx = this.ctx;
        const box = PLAYER_W * DEAD_SCALE;
        const artHeight = (PLAYER_H - DEAD_ART_TOP) * DEAD_SCALE;
        const gapToTitle = 12;
        const titleSize = 28;
        const gapToHint = 14;
        const hintSize = 16;

        const blockHeight = artHeight + gapToTitle + titleSize + gapToHint + hintSize;
        const artBottom = (GAME_HEIGHT - blockHeight) / 2 + artHeight;

        // Die Animation läuft auch nach dem Game Over weiter (update() aktualisiert
        // den Animator), hier wird also derselbe Frame nur grösser gezeichnet.
        this.sprite.draw(ctx, (GAME_WIDTH - box) / 2, artBottom - box, box, box);

        ctx.textAlign = "center";
        ctx.fillStyle = "#f97316";
        ctx.font = `bold ${titleSize}px sans-serif`;
        ctx.fillText("Game Over", GAME_WIDTH / 2, artBottom + gapToTitle + titleSize);
        ctx.fillStyle = "#e5e7eb";
        ctx.font = `${hintSize}px sans-serif`;
        ctx.fillText("R oder tippen zum Neustart", GAME_WIDTH / 2,
            artBottom + gapToTitle + titleSize + gapToHint + hintSize);
        ctx.textAlign = "left";
    }

    private loop = (timestamp: number): void => {
        if (!this.running) return;
        const dtMs = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.update(dtMs);
        this.draw();
        this.animationId = requestAnimationFrame(this.loop);
    };
}
