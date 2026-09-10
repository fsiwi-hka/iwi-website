import { useEffect, useRef, useState } from "react";
import { PlatformerGame, GAME_WIDTH, GAME_HEIGHT } from "./game";

/**
 * Easter Egg: kleiner Endless Runner. Der Auslöser ist bewusst unauffällig –
 * ein Kiwi aus dem Sprite Sheet, das erst beim Drüberfahren sichtbar wird.
 */
export default function GameDialog() {
    const [open, setOpen] = useState(false);
    const [best, setBest] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const gameRef = useRef<PlatformerGame | null>(null);

    // Natives <dialog> öffnen/schließen
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    // Game-Instanz erzeugen, solange der Dialog offen ist. Asset-Laden ist async,
    // daher der cancelled-Flag: falls der Dialog vor Fertigladen wieder schließt,
    // darf die dann fertige Instanz nicht mehr gestartet werden.
    useEffect(() => {
        if (!open) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        let cancelled = false;

        PlatformerGame.create(canvas, {
            onGameOver: (_score, bestScore) => setBest(bestScore),
        })
            .then((game) => {
                if (cancelled) {
                    game.destroy();
                    return;
                }
                gameRef.current = game;
                game.start();
            })
            .catch((err) => console.error("Spiel konnte nicht geladen werden:", err));

        return () => {
            cancelled = true;
            gameRef.current?.destroy();
            gameRef.current = null;
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Kiwi Runner spielen"
                title="Kiwi Runner"
                className="opacity-30 hover:opacity-100 focus-visible:opacity-100 hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
                <span
                    className="block w-6 h-6 bg-no-repeat"
                    style={{
                        backgroundImage: "url(/assets/game/sprites.png)",
                        backgroundSize: "72px 48px", // Sheet auf 1/2 skaliert -> 24px pro Frame
                        backgroundPosition: "0 0", // erster Lauf-Frame
                        imageRendering: "pixelated",
                    }}
                />
            </button>

            <dialog
                ref={dialogRef}
                onClose={() => setOpen(false)}
                className="p-0 border-0 rounded-xl bg-transparent backdrop:bg-black/70"
            >
                <div className="bg-[#111827] rounded-xl p-4 w-[min(92vw,672px)]">
                    <div className="flex justify-between items-center gap-4 mb-3">
                        <span className="text-[#e5e7eb] text-sm">
                            Leertaste, Pfeil-Hoch oder Tippen zum Springen
                            {best > 0 && <> — Rekord: {best}m</>}
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Schließen"
                            className="text-[#e5e7eb] text-xl leading-none hover:text-white cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={GAME_WIDTH}
                        height={GAME_HEIGHT}
                        className="block w-full h-auto rounded-lg touch-none"
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>
            </dialog>
        </>
    );
}
