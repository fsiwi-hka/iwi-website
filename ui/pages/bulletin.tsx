import {useCallback, useEffect, useRef, useState} from "react";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import BulletinService, {BulletinDto} from "@services/bulletin-service";
import {BulletinBoardConfig, bulletinBoards} from "../content/bulletin-boards";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** Wie lange ein Brett stehen bleibt, bevor auf das nächste gewischt wird. */
const BOARD_DURATION_S = 20;
/** Es werden nur die neuesten Beiträge eines Bretts gezeigt - der Rest passt nicht auf den Screen. */
const POSTS_PER_BOARD = 8;
const SWIPE_DURATION_MS = 700;

interface LoadedBoard extends BulletinBoardConfig {
  posts: BulletinDto[];
}

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "" : dateFormat.format(date);
}

/**
 * Das Bulletin Board liefert HTML mit mehreren Absätzen. Auf der Karte ist nur eine Zeile
 * Platz - würde man das HTML rendern, bestünde die Vorschau bei vielen Posts nur aus der
 * Anrede ("Guten Tag,"). Deshalb wird der Text flachgeklopft, damit die Zeile durchläuft.
 */
function previewText(html: string): string {
  // RETURN_DOM statt String: sonst kaeme der Text HTML-escaped zurueck ("Data &amp; Analytics").
  const stripped = DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    RETURN_DOM: true,
  }) as unknown as HTMLElement;
  return (stripped.textContent ?? "").replace(/\s+/g, " ").trim();
}

function BulletinCard({ post }: { post: BulletinDto }) {
  return (
      <article className="white_bg rounded-md px-8 py-4 shadow-sm flex-1 min-h-0 max-h-40 flex flex-col justify-center overflow-hidden">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="petrol_text font-bold text-2xl leading-tight mt-0 mb-0 line-clamp-1">{post.title}</h2>
          <p className="petrol_pale_text text-base shrink-0 mb-0">{formatDate(post.publicationTimestamp)}</p>
        </div>
        <p className="text-gray-700 text-base leading-snug line-clamp-1 mt-1.5 mb-0">
          {previewText(post.content)}
        </p>
      </article>
  );
}

function BoardPanel({ board, animation }: { board: LoadedBoard; animation: string }) {
  return (
      <div
          className="absolute inset-0 flex flex-col px-14 pt-10 pb-12"
          style={{ animation: `${animation} ${SWIPE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}
      >
        <header className="flex items-end justify-between gap-8 mb-8">
          <div>
            <p className="text-white opacity-60 uppercase tracking-[0.3em] text-xl mb-2">Schwarzes Brett</p>
            <h1 className="text-white font-heading font-bold text-5xl leading-none">{board.title}</h1>
          </div>
          <span className="shrink-0 rounded-full border-2 border-white text-white text-2xl font-bold px-6 py-2">
          {board.shortName}
        </span>
        </header>

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          {board.posts.map((post) => (
              <BulletinCard key={post.id} post={post} />
          ))}
        </div>
      </div>
  );
}

function BulletinRotation({ boards }: { boards: LoadedBoard[] }) {
  const [{ index, previousIndex, transition }, setRotation] = useState({
    index: 0,
    previousIndex: -1,
    transition: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotates = boards.length > 1;
  const safeIndex = index % boards.length;

  const advance = useCallback(() => {
    setRotation((rotation) => ({
      index: (rotation.index + 1) % boards.length,
      previousIndex: rotation.index % boards.length,
      transition: rotation.transition + 1,
    }));
  }, [boards.length]);

  useEffect(() => {
    if (!rotates) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, BOARD_DURATION_S * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [safeIndex, advance, rotates]);

  const handleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (rotates) {
      advance();
    }
  };

  return (
      <div
          className="fixed inset-0 petrol_bg overflow-hidden cursor-pointer select-none"
          onClick={handleClick}
      >
        {previousIndex >= 0 && (
            <BoardPanel
                key={`out-${transition}`}
                board={boards[previousIndex % boards.length]}
                animation="board-swipe-out"
            />
        )}
        <BoardPanel key={`in-${transition}`} board={boards[safeIndex]} animation="board-swipe-in" />

        {rotates && (
            <>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {boards.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                            i === safeIndex ? "bg-white opacity-100" : "bg-white opacity-30"
                        }`}
                    />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20">
                <div
                    key={transition}
                    className="h-full"
                    style={{
                      animation: `progress-fill ${BOARD_DURATION_S}s linear forwards`,
                      backgroundColor: "#3999bf",
                    }}
                />
              </div>
            </>
        )}

        <style>{`
        @keyframes board-swipe-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes board-swipe-out {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
      </div>
  );
}

export default function BulletinPage() {
  const [boards, setBoards] = useState<LoadedBoard[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const loaded = await Promise.all(
          bulletinBoards.map(async (config) => {
            try {
              const { items } = await BulletinService.getBulletinPosts(config.board, POSTS_PER_BOARD);
              return { ...config, posts: Array.isArray(items) ? items : [] };
            } catch {
              console.error(`Fehler beim Laden des Bretts ${config.board}`);
              return { ...config, posts: [] };
            }
          })
      );

      // Bretter ohne aktuelle Beiträge werden übersprungen, statt einen leeren Screen zu zeigen.
      if (!cancelled) setBoards(loaded.filter((board) => board.posts.length > 0));
    };

    load();
    const id = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
      <>
        <Head>
          <title>IWI Schwarzes Brett</title>
          <meta name="robots" content="noindex" />
        </Head>
        {boards && boards.length > 0 ? (
            <BulletinRotation boards={boards} />
        ) : (
            <div className="fixed inset-0 petrol_bg flex items-center justify-center text-white text-3xl opacity-40">
              {boards ? "Keine aktuellen Beiträge" : "Lade Inhalte …"}
            </div>
        )}
      </>
  );
}

(BulletinPage as any).noLayout = true;
