import {useCallback, useEffect, useRef, useState} from "react";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import BulletinService, {BulletinDto} from "@services/bulletin-service";
import {addDays, DayKey, dayKeyOf, formatDayKey, formatTime, relativeDayLabel, todayKey} from "@lib/calendar";
import {BulletinBoardConfig, bulletinBoards} from "../content/bulletin-boards";
import KioskClock, {useNow} from "../components/kiosk/KioskClock";
import KioskStage from "../components/kiosk/KioskStage";

// Die Seite laeuft im Kiosk-Modus auf einem 24"-Monitor (1920x1080), an dem Studis
// vorbeilaufen. Alles ist darauf ausgelegt, im Vorbeigehen in ein paar Sekunden
// erfasst zu werden: grosse Schrift, wenige Eintraege, das Dringendste zuerst.

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** Wie lange ein Brett stehen bleibt, bevor auf das nächste gewischt wird. */
const BOARD_DURATION_S = 20;
/** Die Bretter bestehen großteils aus Absagen und Verlegungen - es werden genug Posts geladen, um die kommenden Wochen abzudecken. */
const POSTS_PER_BOARD = 40;
const MAX_ANNOUNCEMENTS = 4;
/** Beiträge, die jünger sind, bekommen ein "Neu"-Badge. */
const NEW_DAYS = 3;
const SWIPE_DURATION_MS = 700;

interface Slot {
  day: DayKey;
  time: string;
  room: string | null;
}

/** Eine Absage oder Verlegung einer Lehrveranstaltung. */
interface ScheduleChange {
  post: BulletinDto;
  kind: "cancelled" | "moved";
  course: string;
  /** null, wenn sich der Post nicht parsen ließ - dann wird der Rohtitel gezeigt. */
  from: Slot | null;
  /** Neuer Termin, nur bei Verlegungen. */
  to: Slot | null;
}

interface LoadedBoard extends BulletinBoardConfig {
  changes: ScheduleChange[];
  announcements: BulletinDto[];
}

/* Absagen und Verlegungen kommen vom Bulletin Board in festen Formaten:
 *   "Terminabsage INFB512, MINB512 (Softwareengineering Labor) am 27.10. um 11:30 (E-304, E-U07)"
 *   "Terminverlegung INFB311, MINB311 (Betriebssysteme) von 26.10. um 11:30 (E-201) auf den 29.10. um 08:00 (E-201)."
 * Bei Verlegungen steht der neue Termin nur im Inhalt, nicht im Titel. */
const CHANGE_TEXT = /^Termin(?:absage|verlegung)\s+(.+?)\s+\((.+)\)\s+(?:am|vom|von)\s+(\d{1,2})\.(\d{1,2})\.\s+um\s+(\d{1,2}[:.]\d{2})(?:\s*Uhr)?(?:\s*\(([^)]*)\))?/i;
const MOVED_TO = /auf\s+den\s+(\d{1,2})\.(\d{1,2})\.\s+um\s+(\d{1,2}[:.]\d{2})(?:\s*Uhr)?(?:\s*\(([^)]*)\))?/i;

/* Im Post steht kein Jahr. Liegt der Termin weit vor dem Veröffentlichungsdatum,
 * ist er im Folgejahr (Absage im Dezember für den Januar). */
function toSlot(published: DayKey, d: string, m: string, time: string, room?: string): Slot {
  const pad = (n: string | number) => String(n).padStart(2, "0");
  const year = Number(published.slice(0, 4));
  let day = `${year}-${pad(m)}-${pad(d)}`;
  if (day < addDays(published, -60)) day = `${year + 1}-${pad(m)}-${pad(d)}`;
  return { day, time: time.replace(".", ":").padStart(5, "0"), room: room?.trim() || null };
}

function parseChange(post: BulletinDto): ScheduleChange {
  const kind = post.type === "CANCELLATION" ? "cancelled" : "moved";
  const text = kind === "moved" ? previewText(post.content) : post.title.trim();
  const match = CHANGE_TEXT.exec(text) ?? CHANGE_TEXT.exec(post.title.trim());
  if (!match) return { post, kind, course: post.title, from: null, to: null };

  const published = publishedDay(post) ?? todayKey();
  const [, , course, d, m, time, room] = match;
  const target = kind === "moved" ? MOVED_TO.exec(text) : null;
  return {
    post,
    kind,
    course,
    from: toSlot(published, d, m, time, room),
    to: target ? toSlot(published, target[1], target[2], target[3], target[4]) : null,
  };
}

/** Eine Veranstaltung gilt bis 90 Minuten nach Beginn als relevant - danach ist die Absage egal. */
const SLOT_LENGTH_MIN = 90;

/** "Jetzt" als Tag + Minuten seit Mitternacht in der Zeitzone der Hochschule. */
interface Moment {
  day: DayKey;
  minutes: number;
}

function momentOf(date: Date): Moment {
  const [h, m] = formatTime(date.toISOString()).split(":").map(Number);
  return { day: dayKeyOf(date), minutes: h * 60 + m };
}

function isUpcoming(slot: Slot | null, now: Moment): boolean {
  if (!slot) return false;
  if (slot.day !== now.day) return slot.day > now.day;
  const [h, m] = slot.time.split(":").map(Number);
  return h * 60 + m + SLOT_LENGTH_MIN > now.minutes;
}

/** Der Termin, unter dem eine Änderung einsortiert wird: der ursprüngliche, solange er noch kommt. */
function relevantSlot(change: ScheduleChange, now: Moment): Slot | null {
  if (isUpcoming(change.from, now)) return change.from;
  if (isUpcoming(change.to, now)) return change.to;
  return null;
}

/** Teilt die Posts eines Bretts in kommende Absagen/Verlegungen (nach Datum) und sonstige Beiträge (neueste zuerst). */
function splitPosts(posts: BulletinDto[], now: Moment) {
  const changes: ScheduleChange[] = [];
  const announcements: BulletinDto[] = [];
  for (const post of posts) {
    if (post.type === "CANCELLATION" || post.type === "POSTPONEMENT") {
      const change = parseChange(post);
      // Ungeparste Posts bleiben drin, sonst ginge eine Absage in neuem Format unter.
      if (!change.from || relevantSlot(change, now)) changes.push(change);
    } else {
      announcements.push(post);
    }
  }
  // Ungeparste Posts ans Ende, der Rest chronologisch.
  const sortKey = (c: ScheduleChange) => {
    const slot = relevantSlot(c, now);
    return slot ? `${slot.day} ${slot.time}` : "9999";
  };
  changes.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  return { changes, announcements };
}

/**
 * Das Bulletin Board liefert HTML mit mehreren Absätzen. Für die Vorschau wird der Text
 * flachgeklopft, sonst bestünde sie bei vielen Posts nur aus der Anrede ("Guten Tag,").
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

function publishedDay(post: BulletinDto): DayKey | null {
  const date = new Date(post.publicationTimestamp);
  return isNaN(date.getTime()) ? null : dayKeyOf(date);
}

function postAge(post: BulletinDto, today: DayKey): string {
  const day = publishedDay(post);
  if (!day) return "";
  if (day === today) return "Heute";
  if (day === addDays(today, -1)) return "Gestern";
  for (let n = 2; n < 7; n++) {
    if (day === addDays(today, -n)) return `Vor ${n} Tagen`;
  }
  return formatDayKey(day, { day: "numeric", month: "long" });
}

function isNew(post: BulletinDto, today: DayKey): boolean {
  const day = publishedDay(post);
  return !!day && day > addDays(today, -NEW_DAYS);
}

function SectionHeading({ children, accent }: { children: string; accent: string }) {
  return (
      <h2 className="flex items-center gap-4 text-white text-3xl font-bold uppercase tracking-[0.15em] leading-none mt-0 mb-6">
        <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        {children}
      </h2>
  );
}

function ChangeTag({ children, className }: { children: string; className: string }) {
  return (
      <span className={`shrink-0 uppercase font-bold text-lg tracking-wider rounded-md px-2.5 py-1 leading-none text-white ${className}`}>
        {children}
      </span>
  );
}

/* Was sich ändert, in einer Zeile: "Fällt aus 11:30 Uhr · E-304" oder "Verlegt → Do 29.10., 08:00 Uhr · E-201". */
function ChangeDetail({ change }: { change: ScheduleChange }) {
  const { kind, from, to } = change;
  if (!from) return null;

  let tag = <ChangeTag className="primary_red_bg">Fällt aus</ChangeTag>;
  let detail = [`${from.time} Uhr`, from.room].filter(Boolean).join(" · ");
  if (kind === "moved" && to && to.day === from.day && to.time === from.time) {
    tag = <ChangeTag className="primary_blue_bg">Raumwechsel</ChangeTag>;
    detail = `${from.time} Uhr · jetzt ${to.room ?? "?"}`;
  } else if (kind === "moved") {
    tag = <ChangeTag className="secondary_blue_bg">Verlegt</ChangeTag>;
    detail = to
        ? [`→ ${formatDayKey(to.day, { weekday: "short", day: "2-digit", month: "2-digit" }).replace(".,", ",")}, ${to.time} Uhr`, to.room].filter(Boolean).join(" · ")
        : `${from.time} Uhr`;
  }

  return (
      <p className="flex items-center gap-3 primary_grey text-2xl leading-tight mt-2 mb-0 min-w-0">
        {tag}
        <span className="truncate">{detail}</span>
      </p>
  );
}

function ChangeRow({ change, now }: { change: ScheduleChange; now: Moment }) {
  const today = now.day;
  const day = relevantSlot(change, now)?.day ?? null;
  const isToday = day === today;
  const isTomorrow = day === addDays(today, 1);

  return (
      <div className="white_bg rounded-xl flex items-stretch overflow-hidden shrink-0">
        {day && (
            <div
                className={`w-36 shrink-0 flex flex-col items-center justify-center py-3 leading-none ${
                    isToday ? "primary_red_bg text-white" : "petrol_text"
                }`}
            >
              <span className={`text-3xl font-bold uppercase ${isTomorrow ? "primary_red" : ""}`}>{relativeDayLabel(day, today)}</span>
              <span className="text-2xl mt-2">{formatDayKey(day, { day: "2-digit", month: "2-digit" })}</span>
            </div>
        )}
        <div className={`min-w-0 flex flex-col justify-center py-4 pr-6 ${day ? "pl-6 border-l-2 border-gray-400" : "pl-8"}`}>
          <p className="petrol_text font-bold text-3xl leading-tight line-clamp-2 m-0">{change.course}</p>
          <ChangeDetail change={change} />
        </div>
      </div>
  );
}

function ChangeList({ changes, now, wide }: { changes: ScheduleChange[]; now: Moment; wide: boolean }) {
  // Mehr passt bei der Schriftgröße nicht untereinander; im breiten Layout gibt es zwei Spalten.
  const max = wide ? 10 : 5;
  const shown = changes.slice(0, max);
  const hidden = changes.length - shown.length;
  return (
      <section className="min-h-0 flex flex-col">
        <SectionHeading accent="#f2380f">Ausfälle &amp; Änderungen</SectionHeading>
        <div className={`grid gap-4 min-h-0 content-start overflow-hidden ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
          {shown.map((c) => (
              <ChangeRow key={c.post.id} change={c} now={now} />
          ))}
        </div>
        {hidden > 0 && (
            <p className="text-white opacity-70 text-2xl mt-5 mb-0">
              + {hidden} weitere {hidden === 1 ? "Änderung" : "Änderungen"} in den nächsten Wochen
            </p>
        )}
      </section>
  );
}

function NewBadge() {
  return (
      <span className="primary_blue_bg text-white uppercase font-bold text-xl tracking-wider rounded-md px-3 py-1 leading-none">
        Neu
      </span>
  );
}

function AnnouncementList({ announcements, today, wide }: { announcements: BulletinDto[]; today: DayKey; wide: boolean }) {
  const [featured, ...rest] = announcements.slice(0, wide ? MAX_ANNOUNCEMENTS : MAX_ANNOUNCEMENTS - 1);
  return (
      <section className="min-h-0 flex flex-col">
        <SectionHeading accent="#7ed1f2">Aktuelles</SectionHeading>
        <div className={`flex-1 min-h-0 flex gap-5 ${wide ? "flex-row" : "flex-col"}`}>
          {/* Der Hauptbeitrag wird nicht über seinen Inhalt hinaus gestreckt. */}
          <article className={`white_bg rounded-xl p-8 flex flex-col min-h-0 overflow-hidden ${wide ? "flex-[3]" : "flex-initial"} ${rest.length === 0 ? "self-start max-h-full" : ""}`}>
            <div className="flex items-center gap-4 mb-4 shrink-0">
              {isNew(featured, today) && <NewBadge />}
              <span className="primary_grey text-2xl leading-none">{postAge(featured, today)}</span>
            </div>
            <h3 className={`petrol_text font-bold normal-case leading-tight m-0 line-clamp-3 shrink-0 ${wide ? "text-5xl" : "text-4xl"}`}>
              {featured.title}
            </h3>
            <p className={`text-gray-700 leading-snug mt-5 mb-0 ${wide ? "text-3xl line-clamp-6" : "text-2xl line-clamp-4"}`}>
              {previewText(featured.content)}
            </p>
          </article>

          {rest.length > 0 && (
              <div className={`flex flex-col gap-5 min-h-0 ${wide ? "flex-[2]" : "shrink-0"}`}>
                {rest.map((post) => (
                    <article key={post.id} className={`white_bg rounded-xl px-8 py-5 flex flex-col justify-center min-h-0 overflow-hidden ${wide ? "flex-1" : ""}`}>
                      <div className="flex items-center gap-4 mb-2">
                        {isNew(post, today) && <NewBadge />}
                        <span className="primary_grey text-xl leading-none">{postAge(post, today)}</span>
                      </div>
                      <p className="petrol_text font-bold text-3xl leading-tight m-0 line-clamp-2">{post.title}</p>
                    </article>
                ))}
              </div>
          )}
        </div>
      </section>
  );
}

function BoardPanel({ board, animation, now }: { board: LoadedBoard; animation: string; now: Moment }) {
  const hasChanges = board.changes.length > 0;
  const hasAnnouncements = board.announcements.length > 0;
  const split = hasChanges && hasAnnouncements;

  return (
      <div
          className="absolute inset-0 flex flex-col px-16 pt-12 pb-24"
          style={{ animation: `${animation} ${SWIPE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}
      >
        {/* Rechts ist Platz für die Uhr, die fest über den Panels liegt. */}
        <header className="pr-96 mb-10 shrink-0">
          <p className="text-white opacity-60 uppercase tracking-[0.3em] text-2xl leading-none mb-3">Schwarzes Brett</p>
          <h1 className="text-white font-heading font-bold normal-case text-6xl leading-none m-0">{board.title}</h1>
        </header>

        <div className={`flex-1 min-h-0 grid gap-12 ${split ? "grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : "grid-cols-1"}`}>
          {hasChanges && <ChangeList changes={board.changes} now={now} wide={!split} />}
          {hasAnnouncements && <AnnouncementList announcements={board.announcements} today={now.day} wide={!split} />}
        </div>
      </div>
  );
}

function BulletinRotation({ boards, now }: { boards: LoadedBoard[]; now: Moment }) {
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

  // Der erste Klick holt die Seite in den Vollbildmodus (siehe BulletinPage), jeder weitere blättert.
  const handleClick = () => {
    if (document.fullscreenElement && rotates) advance();
  };

  return (
      <div className="absolute inset-0" onClick={handleClick}>
        {previousIndex >= 0 && (
            <BoardPanel
                key={`out-${transition}`}
                board={boards[previousIndex % boards.length]}
                animation="board-swipe-out"
                now={now}
            />
        )}
        <BoardPanel key={`in-${transition}`} board={boards[safeIndex]} animation="board-swipe-in" now={now} />

        {rotates && (
            <>
              {/* Zeigt im Vorbeigehen, welches Brett gerade läuft und welches als Nächstes kommt. */}
              <div className="absolute bottom-8 left-16 flex gap-3">
                {boards.map((board, i) => (
                    <span
                        key={board.board}
                        className={`rounded-full text-xl font-bold px-5 py-2 leading-none border-2 transition-colors duration-300 ${
                            i === safeIndex ? "bg-white border-white petrol_text" : "border-white text-white opacity-40"
                        }`}
                    >
                  {board.shortName}
                </span>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white bg-opacity-20">
                <div
                    key={transition}
                    className="h-full primary_blue_bg"
                    style={{ animation: `progress-fill ${BOARD_DURATION_S}s linear forwards` }}
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
  const [posts, setPosts] = useState<{ config: BulletinBoardConfig; posts: BulletinDto[] }[] | null>(null);
  const now = useNow();
  const moment = momentOf(now);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const loaded = await Promise.all(
          bulletinBoards.map(async (config) => {
            try {
              const { items } = await BulletinService.getBulletinPosts(config.board, POSTS_PER_BOARD);
              return { config, posts: Array.isArray(items) ? items : [] };
            } catch {
              console.error(`Fehler beim Laden des Bretts ${config.board}`);
              return { config, posts: [] };
            }
          })
      );
      if (!cancelled) setPosts(loaded);
    };

    load();
    const id = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Neu aufgeteilt wird jede Minute, damit vorbei gegangene Absagen verschwinden.
  // Bretter ohne aktuelle Beiträge werden übersprungen, statt einen leeren Screen zu zeigen.
  const boards: LoadedBoard[] | null = posts
      ?.map(({ config, posts }) => ({ ...config, ...splitPosts(posts, moment) }))
      .filter((board) => board.changes.length > 0 || board.announcements.length > 0) ?? null;

  const handleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
      <>
        <Head>
          <title>IWI Schwarzes Brett</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="fixed inset-0 petrol_bg overflow-hidden cursor-pointer select-none" onClick={handleClick}>
          <KioskStage>
            {boards && boards.length > 0 ? (
                <BulletinRotation boards={boards} now={moment} />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-40">
                  {boards ? "Keine aktuellen Beiträge" : "Lade Inhalte …"}
                </div>
            )}
            <KioskClock now={now} className="absolute top-12 right-16" />
          </KioskStage>
        </div>
      </>
  );
}

(BulletinPage as any).noLayout = true;
