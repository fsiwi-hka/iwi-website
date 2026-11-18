#!/usr/bin/env node
// Uebernimmt die Inhalte der bisherigen React/Next.js-Website (ui/) einmalig
// ins Backend, damit Backrooms und die Angular-Website mit demselben Stand
// starten.
//
// Quellen (werden direkt gelesen, nicht abgeschrieben):
//   ui/content/member.ts       -> Mitglieder + Rollen (n:m, Personen werden zusammengefuehrt)
//   ui/content/departments.ts  -> Fachbereiche (Leitung = gleichnamige Rolle)
//   ui/content/slides.ts       -> Startseiten-Slider
//   ui/content/sponsors.ts     -> Sponsoren
//   ui/public/impressum.md     -> Seite "impressum"
//   ui/locales/de.json + feste Links aus ui/components -> Website-Einstellungen
//   GET /api/ophase (+ Stundenplaene) des Ziel-Backends -> Semestertermine
//   Bilder aus ui/public       -> Upload ueber /api/backrooms/media
//
// Aufruf (Repo-Wurzel):
//   AUTH_TOKEN=... node scripts/import-legacy-content.mjs [--api http://localhost:5200] [--dry-run] [--replace]
//
// Ohne --replace wird nichts ueberschrieben: Listen, die schon Eintraege haben,
// und Dokumente, die schon befuellt sind, werden uebersprungen. Mitglieder
// werden einzeln ueber den Namen abgeglichen (fehlende werden ergaenzt), weil
// die Rollen auf sie verweisen. Ein zweiter Lauf ist damit gefahrlos.
// --replace loescht vorher alle Eintraege der importierten Listen.
//
// Alle Bilder werden vor dem ersten Schreibzugriff hochgeladen: scheitert ein
// Upload, bricht das Skript ab, bevor Inhalte angelegt sind.

import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UI = path.join(ROOT, 'ui');

// ---- Argumente --------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

if (flag('--help') || flag('-h')) {
  console.log(
    'AUTH_TOKEN=... node scripts/import-legacy-content.mjs [--api URL] [--dry-run] [--replace]',
  );
  process.exit(0);
}

const API = option('--api', process.env.API_URL ?? 'http://localhost:5200').replace(/\/+$/, '');
const TOKEN = process.env.AUTH_TOKEN ?? '';
const DRY_RUN = flag('--dry-run');
const REPLACE = flag('--replace');

if (!TOKEN && !DRY_RUN) {
  console.error('AUTH_TOKEN fehlt (Service-Token des Backends, Auth:Token).');
  process.exit(1);
}

// Feste Angaben, die in der React-Seite direkt in Komponenten stehen
// (ui/components/common/footer.tsx, InstagramFeed.tsx).
const INSTAGRAM_URL = 'https://www.instagram.com/iwi_fachschaft/';
const MEETING_INFO = 'Mittwochs um 11:30 Uhr in E004';

// Anzeigenamen der Sponsoren; die React-Seite kennt nur die Dateinamen.
const SPONSOR_NAMES = {
  '8com': '8com',
  bock: 'Bock',
  broadpin: 'Broadpin',
  ctdi: 'CTDI',
  dmTech: 'dmTECH',
  gameforge: 'Gameforge',
  init: 'INIT',
  nitrado: 'Nitrado',
  the_laend: 'The Länd',
  vector: 'Vector',
};

// In der React-Seite: Vorstand = erste vier Positionen, Aemter = die drei danach
// (BOARD/OFFICES per slice), Fachbereichsleitungen beginnen mit "FB ".
const BOARD_COUNT = 4;

// ---- TypeScript-Inhalte laden -----------------------------------------------

function loadTypeScript() {
  for (const dir of [UI, path.join(ROOT, 'ui-angular')]) {
    try {
      return createRequire(path.join(dir, 'package.json'))('typescript');
    } catch {
      // naechster Kandidat
    }
  }
  throw new Error('typescript nicht gefunden - bitte "npm ci" in ui/ oder ui-angular/ ausfuehren.');
}

/** Transpiliert ui/content/*.ts in ein Temp-Verzeichnis und importiert sie als ES-Module. */
async function loadLegacyContent() {
  const ts = loadTypeScript();
  const out = await mkdtemp(path.join(tmpdir(), 'iwi-legacy-'));
  const files = ['member', 'departments', 'slides', 'sponsors'];
  try {
    for (const name of files) {
      const source = await readFile(path.join(UI, 'content', `${name}.ts`), 'utf8');
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      });
      // Relative Importe ("./member") brauchen in ESM eine Endung.
      const js = outputText.replace(/from\s+(["'])\.\/([\w-]+)\1/g, 'from "./$2.mjs"');
      await writeFile(path.join(out, `${name}.mjs`), js);
    }
    const load = (name) => import(pathToFileURL(path.join(out, `${name}.mjs`)).href);
    const [member, departments, slides, sponsors] = await Promise.all(files.map(load));
    const locales = JSON.parse(await readFile(path.join(UI, 'locales', 'de.json'), 'utf8'));
    const imprint = await readFile(path.join(UI, 'public', 'impressum.md'), 'utf8');
    return {
      members: member.members,
      departments: departments.departments,
      slides: slides.slides,
      sponsors: sponsors.sponsorLogos,
      locales,
      imprint,
    };
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}

// ---- HTTP -------------------------------------------------------------------

async function request(method, route, body) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  let payload;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const response = await fetch(`${API}${route}`, { method, headers, body: payload });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${method} ${route} -> ${response.status} ${text.slice(0, 300)}`);
  }
  if (response.status === 204) return undefined;
  const type = response.headers.get('content-type') ?? '';
  return type.includes('json') ? response.json() : response.arrayBuffer();
}

const content = (key) => `/api/backrooms/content/${key}`;
const document = (key) => `/api/backrooms/documents/${key}`;

// ---- Medien -----------------------------------------------------------------

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};
const uploaded = new Map();

/** Laedt eine Datei aus ui/public hoch (jede nur einmal) und liefert den MediaRef. */
async function uploadPublic(publicPath, folder) {
  if (!publicPath) return null;
  const key = `${folder}:${publicPath}`;
  if (uploaded.has(key)) return uploaded.get(key);

  const file = path.join(UI, 'public', publicPath.replace(/^\/+/, ''));
  const bytes = await readFile(file);
  const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  if (DRY_RUN) {
    const ref = { id: null, url: publicPath, name: path.basename(file), contentType: type, size: bytes.length };
    uploaded.set(key, ref);
    return ref;
  }
  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), path.basename(file));
  const ref = await request('POST', `/api/backrooms/media/${folder}`, form);
  uploaded.set(key, ref);
  return ref;
}

async function uploadBytes(bytes, name, type, folder) {
  if (DRY_RUN) return { id: null, url: name, name, contentType: type, size: bytes.byteLength };
  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), name);
  return request('POST', `/api/backrooms/media/${folder}`, form);
}

// ---- Hilfen -----------------------------------------------------------------

const log = (...parts) => console.log(...parts);
let created = 0;

async function create(key, body) {
  created++;
  if (DRY_RUN) return { ...body, id: `dry-${key}-${created}` };
  return request('POST', content(key), body);
}

/**
 * Liefert die bestehenden Eintraege einer Liste. `null` heisst: Liste ist leer
 * (bzw. wurde mit --replace geleert) und soll importiert werden.
 */
async function existing(key) {
  const items = await request('GET', content(key));
  // Mitglieder werden einzeln abgeglichen, nie als ganze Liste uebersprungen.
  if (key === 'members' && !REPLACE) return items.length ? items : null;
  if (items.length === 0) return null;
  if (!REPLACE) {
    log(`  ${key}: ${items.length} Eintraege vorhanden - uebersprungen`);
    return items;
  }
  log(`  ${key}: ${items.length} Eintraege werden ersetzt (--replace)`);
  if (!DRY_RUN) {
    for (const item of items) await request('DELETE', `${content(key)}/${item.id}`);
  }
  return null;
}

/** "/orientation/" -> "/orientation", "/about/#mitmachen" -> "/about#mitmachen" */
function normalizeLink(link) {
  if (!link.startsWith('/')) return link;
  const [pathPart, fragment] = link.split('#');
  const trimmed = pathPart.length > 1 ? pathPart.replace(/\/+$/, '') : pathPart;
  return fragment ? `${trimmed}#${fragment}` : trimmed;
}

const isEmptyDocument = (doc) =>
  Object.values(doc).every(
    (value) =>
      value === null ||
      value === '' ||
      (typeof value === 'object' && isEmptyDocument(value)),
  );

// ---- Import -----------------------------------------------------------------

async function importTeam(legacy) {
  log('Mitglieder und Rollen');

  // Personen ueber den Namen zusammenfuehren: wer mehrere Positionen hat
  // (z. B. 1. Finanzer + FB Finanzen), wird ein Mitglied mit mehreren Rollen.
  const people = new Map();
  for (const position of legacy.members) {
    for (const person of position.personen) {
      const known = people.get(person.name);
      if (!known) people.set(person.name, { name: person.name, img: person.img });
      else if (!known.img && person.img) known.img = person.img;
    }
  }

  // Mitglieder einzeln abgleichen: vorhandene (gleicher Name) werden
  // wiederverwendet, fehlende ergaenzt. So klappt die Verknuepfung auch, wenn
  // ein frueherer Lauf abgebrochen ist.
  const members = (await existing('members')) ?? [];
  const memberId = new Map(members.map((m) => [m.name, m.id]));
  let added = 0;
  for (const person of people.values()) {
    if (memberId.has(person.name)) continue;
    const image = await uploadPublic(person.img, 'members');
    const member = await create('members', { name: person.name, image, active: true });
    memberId.set(person.name, member.id);
    added++;
  }
  log(`  ${added} Mitglieder angelegt, ${people.size - added} vorhanden (${legacy.members.length} Positionen in der Quelle)`);

  let positions = await existing('positions');
  if (!positions) {
    positions = [];
    for (const [index, position] of legacy.members.entries()) {
      const group =
        index < BOARD_COUNT ? 'board' : position.position.startsWith('FB ') ? 'department' : 'role';
      const memberIds = position.personen.map((p) => memberId.get(p.name)).filter(Boolean);
      if (memberIds.length !== position.personen.length) {
        throw new Error(`Rolle "${position.position}": nicht alle Mitglieder gefunden`);
      }
      positions.push(
        await create('positions', { title: position.position, group, memberIds, order: index + 1 }),
      );
    }
    log(`  ${positions.length} Rollen angelegt`);
  }
  return positions;
}

async function importDepartments(legacy, positions) {
  log('Fachbereiche');
  if (await existing('departments')) return;
  const positionId = new Map(positions.map((p) => [p.title, p.id]));
  for (const [index, department] of legacy.departments.entries()) {
    const leadPositionId = positionId.get(department.position) ?? null;
    if (!leadPositionId) log(`  Hinweis: keine Rolle "${department.position}" - ohne Leitung angelegt`);
    await create('departments', {
      name: department.position,
      leadPositionId,
      tasks: department.tasks,
      order: index + 1,
    });
  }
  log(`  ${legacy.departments.length} Fachbereiche angelegt`);
}

async function importSlides(legacy) {
  log('Startseiten-Slider');
  if (await existing('hero-slides')) return;
  for (const [index, slide] of legacy.slides.entries()) {
    await create('hero-slides', {
      title: slide.title,
      subtitle: slide.subtitle,
      image: await uploadPublic(slide.image, 'hero'),
      imageOverlay: slide.imageOverlay,
      buttonText: slide.buttontext,
      buttonLink: normalizeLink(slide.buttonlink),
      active: true,
      order: index + 1,
    });
  }
  log(`  ${legacy.slides.length} Slides angelegt`);
}

async function importSponsors(legacy) {
  log('Sponsoren');
  if (await existing('sponsors')) return;
  for (const [index, logo] of legacy.sponsors.entries()) {
    const base = path.basename(logo.url, path.extname(logo.url));
    await create('sponsors', {
      name: SPONSOR_NAMES[base] ?? base,
      logo: await uploadPublic(logo.url, 'sponsors'),
      width: logo.size,
      website: '',
      active: true,
      order: index + 1,
    });
  }
  log(`  ${legacy.sponsors.length} Sponsoren angelegt`);
}

async function importPages(legacy) {
  log('Seiten');
  const pages = await request('GET', content('pages'));
  if (pages.some((page) => page.slug === 'impressum')) {
    log('  "impressum" vorhanden - uebersprungen');
    return;
  }
  await create('pages', { slug: 'impressum', title: 'Impressum', body: legacy.imprint.trim() });
  log('  "impressum" angelegt');
}

async function importSiteSettings(legacy) {
  log('Website-Einstellungen');
  const current = await request('GET', document('site-settings'));
  if (!isEmptyDocument(current) && !REPLACE) {
    log('  bereits befuellt - uebersprungen');
    return;
  }
  const settings = {
    contactMail: legacy.locales.contact?.mail ?? '',
    sponsoringMail: legacy.locales.sponsoring?.mail ?? '',
    associationMail: legacy.locales.verein?.mail ?? '',
    discordUrl: legacy.locales.participate?.online?.url ?? '',
    instagramUrl: INSTAGRAM_URL,
    meetingInfo: MEETING_INFO,
  };
  if (!DRY_RUN) await request('PUT', document('site-settings'), settings);
  log('  uebernommen');
}

/**
 * Semestertermine kamen auf der React-Seite aus der Nextcloud (info.json,
 * gespiegelt unter /api/ophase). Das Backend hat sie also schon - sie werden
 * einmalig in das Backrooms-Dokument kopiert, die Stundenplaene hochgeladen.
 */
async function importSemesterDates() {
  log('Semestertermine');
  const current = await request('GET', document('semester-dates'));
  if (current.semester && !REPLACE) {
    log('  bereits befuellt - uebersprungen');
    return;
  }

  let info;
  try {
    info = await request('GET', '/api/ophase');
  } catch (error) {
    log(`  /api/ophase nicht verfuegbar (${error.message}) - uebersprungen`);
    return;
  }
  if (!info?.semester) {
    log('  /api/ophase liefert noch kein Semester - uebersprungen');
    return;
  }

  const timetables = { I: null, WI: null };
  for (const course of ['I', 'WI']) {
    try {
      const bytes = await request('GET', `/api/ophase/timetable?course=${course}`);
      timetables[course] = await uploadBytes(
        bytes,
        `stundenplan-${course.toLowerCase()}.png`,
        'image/png',
        'timetables',
      );
    } catch {
      log(`  kein Stundenplan fuer ${course}`);
    }
  }

  const range = (r) => ({ beginn: r?.beginn ?? null, ende: r?.ende ?? null });
  const dates = {
    semester: info.semester,
    vorkurse: { mathe: range(info.vorkurse?.mathe), programmieren: range(info.vorkurse?.programmieren) },
    orientierungsphase: range(info.orientierungsphase),
    vorlesungszeit: range(info.vorlesungszeit),
    timetables,
    changedAt: null,
  };
  if (!DRY_RUN) await request('PUT', document('semester-dates'), dates);
  log(`  ${info.semester} uebernommen`);
}

// ---- Ablauf -----------------------------------------------------------------

/**
 * Laedt vorab alle Bilder hoch, die der Import gleich braucht, damit ein
 * Upload-Fehler vor dem ersten Inhalt abbricht. Was uebersprungen wird
 * (Liste schon befuellt, Mitglied schon vorhanden), wird nicht hochgeladen.
 */
async function uploadAllImages(legacy) {
  log('Bilder hochladen');
  const willImport = async (key) =>
    REPLACE || (await request('GET', content(key))).length === 0;

  const knownMembers = REPLACE
    ? new Set()
    : new Set((await request('GET', content('members'))).map((m) => m.name));
  for (const position of legacy.members) {
    for (const person of position.personen) {
      if (!knownMembers.has(person.name)) await uploadPublic(person.img, 'members');
    }
  }
  if (await willImport('hero-slides')) {
    for (const slide of legacy.slides) await uploadPublic(slide.image, 'hero');
  }
  if (await willImport('sponsors')) {
    for (const logo of legacy.sponsors) await uploadPublic(logo.url, 'sponsors');
  }
  log(`  ${uploaded.size} Dateien`);
}

async function main() {
  log(`Ziel: ${API}${DRY_RUN ? ' (Probelauf, es wird nichts geschrieben)' : ''}`);
  await request('GET', '/api/health');

  const legacy = await loadLegacyContent();
  await uploadAllImages(legacy);
  const positions = await importTeam(legacy);
  await importDepartments(legacy, positions);
  await importSlides(legacy);
  await importSponsors(legacy);
  await importPages(legacy);
  await importSiteSettings(legacy);
  await importSemesterDates();

  const files = [...uploaded.values()].length;
  log(`Fertig: ${created} Eintraege angelegt, ${files} Bilder hochgeladen.`);
}

main().catch((error) => {
  // "fetch failed" allein sagt nichts; der Grund (DNS, TLS, ...) steht in cause.
  const cause = error.cause?.message ?? error.cause?.code;
  console.error(`Abbruch: ${error.message}${cause ? ` (${cause})` : ''}`);
  process.exit(1);
});
