import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { BulletinPostDto } from '@iwi/api';
import { catchError, forkJoin, map, of } from 'rxjs';

import { BulletinData } from '../../core/data/bulletin-data';
import { browserResource } from '../../core/platform/browser-resource';
import { everyInBrowser, kioskClick } from '../../core/platform/kiosk';
import { BULLETIN_BOARDS } from '../../shared/content/bulletin-boards';
import { htmlToText } from '../../shared/utils/html';
import { BoardPanel, LoadedBoard, PostView } from './board-panel/board-panel';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** Wie lange ein Brett stehen bleibt, bevor auf das naechste gewischt wird. */
const BOARD_DURATION_S = 20;
/** Es werden nur die neuesten Beitraege eines Bretts gezeigt - der Rest passt nicht auf den Screen. */
const POSTS_PER_BOARD = 8;

const dateFormat = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function toView(post: BulletinPostDto): PostView {
  const date = new Date(post.publicationTimestamp);
  return {
    id: post.id,
    title: post.title,
    date: Number.isNaN(date.getTime()) ? '' : dateFormat.format(date),
    preview: htmlToText(post.content),
  };
}

/** Schwarzes Brett fuer die Bildschirme: rotiert durch die Bretter aus bulletin-boards.ts. */
@Component({
  selector: 'iwi-bulletin-page',
  imports: [BoardPanel],
  templateUrl: './bulletin-page.html',
  styleUrl: './bulletin-page.scss',
  host: { '(click)': 'onClick()' },
})
export default class BulletinPage {
  private readonly bulletin = inject(BulletinData);

  protected readonly duration = BOARD_DURATION_S;

  private readonly loaded = browserResource({
    params: () => true,
    stream: () =>
      forkJoin(
        BULLETIN_BOARDS.map((config) =>
          this.bulletin.posts(config.board, POSTS_PER_BOARD).pipe(
            map((page): LoadedBoard => ({ ...config, posts: page.items.map(toView) })),
            // Ein kaputtes Brett soll die anderen nicht mitreissen.
            catchError(() => of<LoadedBoard>({ ...config, posts: [] })),
          ),
        ),
      ).pipe(
        // Bretter ohne aktuelle Beitraege werden uebersprungen, statt einen leeren Screen zu zeigen.
        map((boards) => boards.filter((board) => board.posts.length > 0)),
      ),
  });

  protected readonly boards = computed(() =>
    this.loaded.hasValue() ? (this.loaded.value() ?? []) : null,
  );
  protected readonly rotation = signal({ index: 0, previous: -1, transition: 0 });

  protected readonly current = computed(() => {
    const boards = this.boards();
    return boards && boards.length > 0 ? boards[this.rotation().index % boards.length] : undefined;
  });
  protected readonly previous = computed(() => {
    const boards = this.boards();
    const previous = this.rotation().previous;
    return boards && previous >= 0 ? boards[previous % boards.length] : undefined;
  });
  protected readonly rotates = computed(() => (this.boards()?.length ?? 0) > 1);

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      this.rotation();
      clearTimeout(this.timer);
      if (this.rotates()) this.timer = setTimeout(() => this.advance(), BOARD_DURATION_S * 1000);
    });
    everyInBrowser(REFRESH_INTERVAL_MS, () => this.loaded.reload());
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected advance(): void {
    const count = this.boards()?.length ?? 0;
    if (count < 2) return;
    this.rotation.update(({ index, transition }) => ({
      index: (index + 1) % count,
      previous: index % count,
      transition: transition + 1,
    }));
  }

  protected onClick(): void {
    kioskClick(() => this.advance());
  }
}
