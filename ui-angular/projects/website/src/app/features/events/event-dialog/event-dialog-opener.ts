import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventDto } from '@iwi/api';

import { EventDialog } from './event-dialog';

@Injectable({ providedIn: 'root' })
export class EventDialogOpener {
  private readonly dialog = inject(MatDialog);

  open(event: CalendarEventDto): void {
    this.dialog.open(EventDialog, {
      data: event,
      width: '32rem',
      maxWidth: '100vw',
      panelClass: 'iwi-dialog-panel',
      ariaLabelledBy: 'event-dialog-title',
      autoFocus: 'dialog',
    });
  }
}
