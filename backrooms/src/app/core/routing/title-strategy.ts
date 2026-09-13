import { inject, Service } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const APP_NAME = 'Backrooms';

/** Haengt an jeden Routen-Titel den App-Namen an: "Mitglieder · Backrooms". */
@Service({ autoProvided: false })
export class BackroomsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · ${APP_NAME}` : `${APP_NAME} · Fachschaft IWI`);
  }
}
