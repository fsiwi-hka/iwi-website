import { computed, inject, Injectable } from '@angular/core';
import {
  DepartmentDto,
  DepartmentsService,
  DocumentsService,
  HeroSlideDto,
  HeroSlidesService,
  MemberDto,
  MembersService,
  PositionDto,
  PositionsService,
  SiteSettingsDto,
  SponsorDto,
  SponsorsService,
} from '@iwi/api';
import { forkJoin, map } from 'rxjs';

import { SITE } from '../../shared/content/site';
import { browserResource } from '../platform/browser-resource';

// Inhalte, die in den Backrooms gepflegt werden (/api/backrooms/content/*).
// Wie Termine und News werden sie erst im Browser geladen; beim Vorrendern
// sind die Listen leer. Die Typen hier sind die Sicht der Website, die
// Abbildung von den generierten DTOs passiert an genau einer Stelle.

export interface HeroSlide {
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  /** Bild in Graustufen mit blauem Schleier, damit der Text daneben ruhig wirkt. */
  readonly imageOverlay: boolean;
  readonly buttonText: string;
  readonly buttonLink: string;
  readonly buttonFragment?: string;
}

export interface SponsorLogo {
  readonly url: string;
  /** Breite in Pixeln; die Hoehe ergibt sich aus dem Seitenverhaeltnis. */
  readonly width: number;
  readonly name: string;
}

export interface Person {
  readonly name: string;
  readonly image?: string;
}

/** Eine Rolle mit den Personen, die sie ausfuellen (leer = wird gesucht). */
export interface Member {
  readonly position: string;
  readonly people: readonly Person[];
}

export interface Department {
  readonly name: string;
  readonly tasks: readonly string[];
  /** Ansprechpersonen = Mitglieder der Leitungsrolle. */
  readonly people: readonly Person[];
}

export interface Team {
  /** Vorstand */
  readonly board: readonly Member[];
  /** Weitere Rollen (Mail, Kaffee, Foerderverein, ...) */
  readonly offices: readonly Member[];
  readonly departments: readonly Department[];
}

const EMPTY_TEAM: Team = { board: [], offices: [], departments: [] };

/** "/about#mitmachen" -> Link "/about", Fragment "mitmachen" (fuer routerLink). */
function toHeroSlide(dto: HeroSlideDto): HeroSlide {
  const [link = '/', fragment] = dto.buttonLink.split('#');
  return {
    title: dto.title,
    subtitle: dto.subtitle,
    image: dto.image?.url ?? '',
    imageOverlay: dto.imageOverlay,
    buttonText: dto.buttonText,
    buttonLink: link,
    buttonFragment: fragment || undefined,
  };
}

function toSponsorLogo(dto: SponsorDto): SponsorLogo | null {
  return dto.logo ? { url: dto.logo.url, width: dto.width, name: dto.name } : null;
}

/** Ehemalige Mitglieder erscheinen nicht; eine Rolle ohne aktive Person gilt als gesucht. */
function toTeam(
  members: MemberDto[],
  positions: PositionDto[],
  departments: DepartmentDto[],
): Team {
  const people = new Map(
    members
      .filter((member) => member.active)
      .map((member): [string, Person] => [
        member.id,
        { name: member.name, image: member.image?.url },
      ]),
  );
  const peopleOf = (position: PositionDto | undefined): Person[] =>
    position?.memberIds.flatMap((id) => people.get(id) ?? []) ?? [];

  const sorted = [...positions].sort((a, b) => a.order - b.order);
  const byGroup = (group: string): Member[] =>
    sorted
      .filter((position) => position.group === group)
      .map((position) => ({ position: position.title, people: peopleOf(position) }));
  const byId = new Map(positions.map((position) => [position.id, position]));

  return {
    board: byGroup('board'),
    offices: byGroup('role'),
    departments: [...departments]
      .sort((a, b) => a.order - b.order)
      .map((department) => ({
        name: department.name,
        tasks: department.tasks,
        people: peopleOf(
          department.leadPositionId ? byId.get(department.leadPositionId) : undefined,
        ),
      })),
  };
}

/** Slides des Startseiten-Sliders (nur die sichtbaren). */
@Injectable({ providedIn: 'root' })
export class HeroSlides {
  private readonly api = inject(HeroSlidesService);

  private readonly resource = browserResource({
    params: () => true,
    stream: () =>
      this.api.heroSlidesList({ active: true }).pipe(map((slides) => slides.map(toHeroSlide))),
  });

  readonly value = computed<readonly HeroSlide[]>(() =>
    this.resource.hasValue() ? (this.resource.value() ?? []) : [],
  );
}

/** Logos fuer das Sponsoren-Karussell (nur aktive mit Logo). */
@Injectable({ providedIn: 'root' })
export class Sponsors {
  private readonly api = inject(SponsorsService);

  private readonly resource = browserResource({
    params: () => true,
    stream: () =>
      this.api
        .sponsorsList({ active: true })
        .pipe(map((sponsors) => sponsors.flatMap((dto) => toSponsorLogo(dto) ?? []))),
  });

  readonly value = computed<readonly SponsorLogo[]>(() =>
    this.resource.hasValue() ? (this.resource.value() ?? []) : [],
  );
}

/** Vorstand, Rollen und Fachbereiche mit ihren Personen. */
@Injectable({ providedIn: 'root' })
export class TeamContent {
  private readonly members = inject(MembersService);
  private readonly positions = inject(PositionsService);
  private readonly departments = inject(DepartmentsService);

  private readonly resource = browserResource({
    params: () => true,
    stream: () =>
      forkJoin([
        this.members.membersList(),
        this.positions.positionsList(),
        this.departments.departmentsList(),
      ]).pipe(map(([members, positions, departments]) => toTeam(members, positions, departments))),
  });

  readonly value = computed<Team>(() =>
    this.resource.hasValue() ? (this.resource.value() ?? EMPTY_TEAM) : EMPTY_TEAM,
  );
}

/** Form von SITE, aber mit string statt der Literal-Typen aus "as const". */
type Widen<T> = { readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Site = Widen<typeof SITE>;

/** Leere Felder aus den Backrooms ueberschreiben die festen Angaben nicht. */
function withSettings(site: Site, settings: SiteSettingsDto | undefined): Site {
  if (!settings) return site;
  const pick = (value: string, fallback: string) => value.trim() || fallback;
  return {
    ...site,
    mail: {
      contact: pick(settings.contactMail, site.mail.contact),
      sponsoring: pick(settings.sponsoringMail, site.mail.sponsoring),
      association: pick(settings.associationMail, site.mail.association),
    },
    meeting: { ...site.meeting, label: pick(settings.meetingInfo, site.meeting.label) },
    links: {
      ...site.links,
      discord: pick(settings.discordUrl, site.links.discord),
      instagram: pick(settings.instagramUrl, site.links.instagram),
    },
  };
}

/**
 * Angaben der Fachschaft. Mails, Discord, Instagram und Sitzungstermin kommen
 * aus den Backrooms-Einstellungen; bis sie geladen sind (und beim Vorrendern)
 * gelten die festen Werte aus shared/content/site.ts.
 */
@Injectable({ providedIn: 'root' })
export class SiteSettings {
  private readonly api = inject(DocumentsService);

  private readonly resource = browserResource({
    params: () => true,
    stream: () => this.api.documentsGetSiteSettings(),
  });

  readonly site = computed<Site>(() =>
    withSettings(SITE, this.resource.hasValue() ? this.resource.value() : undefined),
  );
}
