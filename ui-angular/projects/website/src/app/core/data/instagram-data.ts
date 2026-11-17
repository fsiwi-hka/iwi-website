import { inject, Injectable } from '@angular/core';
import { InstagramFeedDto, InstagramService } from '@iwi/api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstagramData {
  private readonly api = inject(InstagramService);

  /** Die letzten Posts. Die Medien-URLs zeigen auf das Backend, das die Bilder spiegelt. */
  feed(limit: number): Observable<InstagramFeedDto> {
    return this.api.getInstagramPosts({ limit });
  }
}
