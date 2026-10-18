import { Component, computed, inject } from '@angular/core';

import { CalendarData } from '../../core/data/calendar-data';
import { browserResource } from '../../core/platform/browser-resource';
import { Button } from '../../shared/ui/button/button';
import { CopyButton } from '../../shared/ui/copy-button/copy-button';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { MonthView } from './month-view/month-view';

@Component({
  selector: 'iwi-events-page',
  imports: [Button, CopyButton, PageHeader, MonthView],
  templateUrl: './events-page.html',
  styleUrl: './events-page.scss',
})
export default class EventsPage {
  private readonly calendar = inject(CalendarData);

  /** Abo-Link auf den oeffentlichen Nextcloud-Kalender, die URL steht in der Backend-Config. */
  private readonly subscription = browserResource({
    params: () => true,
    stream: () => this.calendar.subscribeUrl(),
  });

  protected readonly subscribeUrl = computed(() =>
    this.subscription.hasValue() ? (this.subscription.value() ?? null) : null,
  );

  /** webcal:// oeffnet direkt die Kalender-App (iOS/macOS/Outlook/Thunderbird) und legt ein Abo an. */
  protected readonly webcalUrl = computed(
    () => this.subscribeUrl()?.replace(/^https?:\/\//, 'webcal://') ?? null,
  );
}
