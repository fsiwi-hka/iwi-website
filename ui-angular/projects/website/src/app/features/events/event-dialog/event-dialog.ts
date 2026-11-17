import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { CalendarEventDto } from '@iwi/api';

import { ApiUrls } from '../../../core/data/api-urls';
import { formatEventRange } from '../../../shared/utils/calendar';
import { plainTextToHtml } from '../../../shared/utils/html';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconButton } from '../../../shared/ui/icon-button/icon-button';

/** Details eines Termins mit Download als .ics. Oeffnen ueber EventDialogOpener. */
@Component({
  selector: 'iwi-event-dialog',
  imports: [Button, Icon, IconButton, MatDialogClose],
  templateUrl: './event-dialog.html',
  styleUrl: './event-dialog.scss',
})
export class EventDialog {
  protected readonly event = inject<CalendarEventDto>(MAT_DIALOG_DATA);
  private readonly urls = inject(ApiUrls);

  protected readonly range = formatEventRange(this.event);
  protected readonly icsUrl = this.urls.calendarEventIcs(this.event.id);
  protected readonly description = this.event.description
    ? plainTextToHtml(this.event.description)
    : null;
}
