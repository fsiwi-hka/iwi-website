import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const SITE_NAME = 'Fachschaft IWI';
export const DEFAULT_DESCRIPTION = 'Die Website der Fachschaft IWI, Hochschule Karlsruhe (HKA)';

/** Optionale Daten einer Route fuer Titel und Meta-Tags (siehe app.routes.ts). */
export interface PageRouteData {
  /** Text fuer meta description / og:description. */
  readonly description?: string;
  /** Name in der Brotkrumen-Navigation. Ohne Angabe wird der Seitentitel genutzt. */
  readonly breadcrumb?: string;
}

/**
 * Setzt "<Titel> | Fachschaft IWI" sowie og:title und og:description.
 * Ersetzt die PageHead-Komponente der Next.js-Version.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
    const description = this.deepestDescription(snapshot.root) ?? DEFAULT_DESCRIPTION;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ property: 'og:title', content: pageTitle ?? SITE_NAME });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'description', content: description });
  }

  private deepestDescription(route: ActivatedRouteSnapshot): string | undefined {
    let current: ActivatedRouteSnapshot | null = route;
    let description: string | undefined;
    while (current) {
      const data = current.data as PageRouteData;
      description = data.description ?? description;
      current = current.firstChild;
    }
    return description;
  }
}
