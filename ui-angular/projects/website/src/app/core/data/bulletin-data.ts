import { inject, Injectable } from '@angular/core';
import { BulletinBoardService, BulletinPostDto } from '@iwi/api';
import { map, Observable } from 'rxjs';

export interface BulletinPage {
  /** Gesamtzahl der Posts des Bretts (Header X-Total-Count). */
  readonly total: number;
  readonly items: readonly BulletinPostDto[];
}

@Injectable({ providedIn: 'root' })
export class BulletinData {
  private readonly api = inject(BulletinBoardService);

  /** offset ist der Index des ersten Posts, nicht die Seitennummer - so erwartet es der Controller. */
  posts(board: string, limit: number, offset = 0): Observable<BulletinPage> {
    return this.api.getBulletinPosts({ board, limit, offset }, 'response').pipe(
      map((response) => {
        const items = response.body ?? [];
        const header = Number(response.headers.get('X-Total-Count'));
        return { items, total: Number.isFinite(header) && header > 0 ? header : items.length };
      }),
    );
  }
}
