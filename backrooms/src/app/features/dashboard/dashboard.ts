import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { Entity } from '../../shared/models';
import { IconName } from '../../shared/ui/icon/icons';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { StatusBadge } from '../../shared/ui/status-badge/status-badge';
import { formatDateTime, formatRelative } from '../../shared/utils/date';
import { DepartmentStore } from '../departments/department.store';
import { HeroSlideStore } from '../hero-slides/hero-slide.store';
import { InfoscreenStore } from '../infoscreen/infoscreen.store';
import { MemberStore } from '../members/member.store';
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
  icon: IconName;
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

function stat(label: string, store: Countable, meta: string, path: string, icon: IconName): Stat {
  return {
    label,
    value: store.isLoading() && store.count() === 0 ? null : store.count(),
    meta,
    path,
    icon,
  };
}

function change(type: string, title: string, path: string, entity: Entity): RecentChange {
  return { key: path, type, title, path, updatedAt: entity.updatedAt ?? '' };
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeader,
    StatusBadge,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(AuthStore);
  private readonly heroSlides = inject(HeroSlideStore);
  private readonly members = inject(MemberStore);
  private readonly departments = inject(DepartmentStore);
  private readonly sponsors = inject(SponsorStore);
  private readonly protocols = inject(ProtocolStore);
  private readonly infoscreen = inject(InfoscreenStore);
  private readonly pages = inject(ContentPageStore);

  protected readonly system = inject(SystemStore);
  protected readonly dateTime = formatDateTime;
  protected readonly relative = formatRelative;

  protected readonly greeting = computed(() => {
    const name = this.auth.user()?.displayName;
    return `${name ? `Hallo ${name}! ` : ''}Hier pflegst du die Inhalte der Website und des Infoscreens.`;
  });

  protected readonly stats = computed<Stat[]>(() => [
    stat(
      'Startseiten-Slider',
      this.heroSlides,
      `${this.heroSlides.items().filter((slide) => slide.active).length} aktiv`,
      '/hero-slides',
      'image',
    ),
    stat(
      'Mitglieder',
      this.members,
      `${this.members.items().filter((member) => member.persons.length === 0).length} unbesetzt`,
      '/members',
      'users',
    ),
    stat('Fachbereiche', this.departments, 'mit Aufgabenbeschreibung', '/departments', 'layers'),
    stat(
      'Sponsoren',
      this.sponsors,
      `${this.sponsors.items().filter((sponsor) => sponsor.active).length} aktiv`,
      '/sponsors',
      'briefcase',
    ),
    stat(
      'Infoscreen',
      this.infoscreen,
      `${this.infoscreen.items().filter((slide) => slide.active).length} aktiv`,
      '/infoscreen',
      'monitor',
    ),
    stat('Sitzungsprotokolle', this.protocols, 'PDF-Dateien', '/protocols', 'archive'),
    stat('Seiten', this.pages, 'Markdown-Inhalte', '/pages', 'file-text'),
  ]);

  protected readonly recent = computed<RecentChange[]>(() =>
    [
      ...this.heroSlides.items().map((s) => change('Slide', s.title, `/hero-slides/${s.id}`, s)),
      ...this.members.items().map((m) => change('Mitglied', m.position, `/members/${m.id}`, m)),
      ...this.departments
        .items()
        .map((d) => change('Fachbereich', d.position, `/departments/${d.id}`, d)),
      ...this.sponsors.items().map((s) => change('Sponsor', s.name, `/sponsors/${s.id}`, s)),
      ...this.protocols.items().map((p) => change('Protokoll', p.title, `/protocols/${p.id}`, p)),
      ...this.infoscreen.items().map((i) => change('Infoscreen', i.name, `/infoscreen/${i.id}`, i)),
      ...this.pages.items().map((p) => change('Seite', p.title, `/pages/${p.id}`, p)),
    ]
      .filter((item) => item.updatedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8),
  );
}
