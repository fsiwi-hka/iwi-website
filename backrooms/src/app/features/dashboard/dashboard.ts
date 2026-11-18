import { Component, computed, inject, linkedSignal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Entity } from '../../shared/models';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { formatDateTime, formatRelative } from '../../shared/utils/date';
import { DepartmentStore } from '../departments/department.store';
import { HeroSlideStore } from '../hero-slides/hero-slide.store';
import { InfoscreenStore } from '../infoscreen/infoscreen.store';
import { MemberStore } from '../members/member.store';
import { PositionStore } from '../positions/position.store';
import { ContentPageStore } from '../pages/content-page.store';
import { ProtocolStore } from '../protocols/protocol.store';
import { SponsorStore } from '../sponsors/sponsor.store';
import { SystemStore } from '../system/system.store';

interface Stat {
  label: string;
  /** `null`, solange die Liste noch laedt. */
  value: number | null;
  meta: string;
  path: string;
  /** Meta als Hinweis hervorheben (z. B. unbesetzte Rollen). */
  warn?: boolean;
}

interface RecentChange {
  key: string;
  type: string;
  title: string;
  path: string;
  updatedAt: string;
}

interface Countable {
  isLoading: Signal<boolean>;
  count: Signal<number>;
}

function stat(label: string, store: Countable, meta: string, path: string, warn = false): Stat {
  return {
    label,
    value: store.isLoading() && store.count() === 0 ? null : store.count(),
    meta,
    path,
    warn,
  };
}

/** 75 -> "1:15 min", 40 -> "40 s". */
function formatLoop(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')} min`;
}

function change(type: string, title: string, path: string, entity: Entity): RecentChange {
  return { key: path, type, title, path, updatedAt: entity.updatedAt ?? '' };
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatButtonModule, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly heroSlides = inject(HeroSlideStore);
  private readonly members = inject(MemberStore);
  private readonly positions = inject(PositionStore);
  private readonly departments = inject(DepartmentStore);
  private readonly sponsors = inject(SponsorStore);
  private readonly protocols = inject(ProtocolStore);
  private readonly infoscreen = inject(InfoscreenStore);
  private readonly pages = inject(ContentPageStore);

  protected readonly system = inject(SystemStore);
  protected readonly dateTime = formatDateTime;
  protected readonly relative = formatRelative;

  /** Aktive Slides in Abspielreihenfolge, so wie der Infoscreen sie zeigt. */
  protected readonly playlist = computed(() =>
    this.infoscreen.items().filter((slide) => slide.active),
  );

  /** Ausgewaehlter Slide der Vorschau; springt auf 0, wenn sich die Liste aendert. */
  protected readonly currentIndex = linkedSignal({
    source: this.playlist,
    computation: () => 0,
  });

  protected readonly current = computed(() => this.playlist()[this.currentIndex()]);

  protected readonly loopLabel = computed(() =>
    formatLoop(this.playlist().reduce((sum, slide) => sum + slide.durationSeconds, 0)),
  );

  protected readonly stats = computed<Stat[]>(() => {
    const active = <T extends { active: boolean }>(items: T[]) =>
      items.filter((item) => item.active).length;
    const vacant = this.positions.items().filter((p) => p.memberIds.length === 0).length;
    return [
      stat(
        'Startseiten-Slider',
        this.heroSlides,
        `${active(this.heroSlides.items())} aktiv`,
        '/hero-slides',
      ),
      stat('Mitglieder', this.members, `${active(this.members.items())} aktiv`, '/members'),
      stat(
        'Rollen',
        this.positions,
        vacant ? `${vacant} unbesetzt` : 'alle besetzt',
        '/positions',
        vacant > 0,
      ),
      stat('Fachbereiche', this.departments, 'auf der Fachschaftsseite', '/departments'),
      stat('Sponsoren', this.sponsors, `${active(this.sponsors.items())} aktiv`, '/sponsors'),
      stat(
        'Infoscreen',
        this.infoscreen,
        `${active(this.infoscreen.items())} aktiv`,
        '/infoscreen',
      ),
      stat('Sitzungsprotokolle', this.protocols, 'PDF in der Nextcloud', '/protocols'),
      stat('Seiten', this.pages, 'Markdown', '/pages'),
    ];
  });

  protected readonly recent = computed<RecentChange[]>(() =>
    [
      ...this.heroSlides.items().map((s) => change('Slide', s.title, `/hero-slides/${s.id}`, s)),
      ...this.members.items().map((m) => change('Mitglied', m.name, `/members/${m.id}`, m)),
      ...this.positions.items().map((p) => change('Rolle', p.title, `/positions/${p.id}`, p)),
      ...this.departments
        .items()
        .map((d) => change('Fachbereich', d.name, `/departments/${d.id}`, d)),
      ...this.sponsors.items().map((s) => change('Sponsor', s.name, `/sponsors/${s.id}`, s)),
      ...this.protocols.items().map((p) => change('Protokoll', p.title, `/protocols/${p.id}`, p)),
      ...this.infoscreen.items().map((i) => change('Infoscreen', i.name, `/infoscreen/${i.id}`, i)),
      ...this.pages.items().map((p) => change('Seite', p.title, `/pages/${p.id}`, p)),
    ]
      .filter((item) => item.updatedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 6),
  );
}
