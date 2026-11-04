import {ReactNode, useEffect, useState} from "react";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

/* Die Kiosk-Seiten sind fest fuer 1920x1080 gelayoutet und werden als Ganzes auf den
 * Bildschirm skaliert - wie eine Folie. So bricht und schneidet auf jedem Monitor alles
 * gleich ab, statt dass Schrift auf kleineren Screens aus den Karten laeuft.
 * Bei abweichendem Seitenverhaeltnis bleibt ein Rand in der Hintergrundfarbe. */
export default function KioskStage({children, className = ""}: { children: ReactNode; className?: string }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div className={`absolute inset-0 overflow-hidden flex items-center justify-center ${className}`}>
            <div className="relative shrink-0" style={{width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})`}}>
                {children}
            </div>
        </div>
    );
}
