import { Component, computed, inject } from '@angular/core';
import { InstagramPostDto } from '@iwi/api';

import { InstagramData } from '../../../core/data/instagram-data';
import { browserResource } from '../../../core/platform/browser-resource';
import { SITE } from '../../../shared/content/site';
import { Icon } from '../../../shared/ui/icon/icon';

const COUNT = 4;
const PROFILE_NAME = 'iwi_fachschaft';

interface PostView {
  readonly post: InstagramPostDto;
  readonly src: string | null;
  readonly alt: string;
  readonly date: string;
  /** Nicht-quadratische Posts bekommen eine unscharfe Kopie als Hintergrund. */
  readonly backdrop: boolean;
}

const dateFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' });

/** Die letzten Instagram-Posts im Look der Instagram-Kacheln. */
@Component({
  selector: 'iwi-instagram-feed',
  imports: [Icon],
  templateUrl: './instagram-feed.html',
  styleUrl: './instagram-feed.scss',
})
export class InstagramFeed {
  private readonly data = inject(InstagramData);

  protected readonly profileUrl = SITE.links.instagram;
  protected readonly feed = browserResource({
    params: () => COUNT,
    stream: (count) => this.data.feed(count),
  });

  protected readonly username = computed(
    () => (this.feed.hasValue() ? this.feed.value()?.user?.username : null) ?? PROFILE_NAME,
  );
  protected readonly avatar = computed(
    () => (this.feed.hasValue() ? this.feed.value()?.user?.profile_picture_url : null) ?? null,
  );

  protected readonly posts = computed<readonly PostView[]>(() => {
    const feed = this.feed.hasValue() ? this.feed.value() : undefined;
    return (feed?.data ?? []).slice(0, COUNT).map((post) => {
      const timestamp = new Date(post.timestamp);
      const ratio = post.width && post.height ? post.width / post.height : 1;
      return {
        post,
        src: post.media_url ?? post.thumbnail_url,
        alt: post.caption ? (post.caption.split('\n')[0] ?? '').slice(0, 120) : '',
        date: Number.isNaN(timestamp.getTime()) ? '' : dateFormat.format(timestamp),
        backdrop: Math.abs(ratio - 1) > 0.02,
      };
    });
  });

  /** Beim Vorrendern und waehrend des Ladens nichts anzeigen, erst bei echtem Fehler. */
  protected readonly failed = computed(
    () => this.feed.status() === 'error' || (this.feed.hasValue() && this.posts().length === 0),
  );
}
