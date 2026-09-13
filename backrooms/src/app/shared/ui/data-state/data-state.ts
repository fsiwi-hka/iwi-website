import { Component, computed, input, output, ResourceStatus } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { errorMessage } from '../../../core/api/api-error';

/**
 * Rendert Lade- und Fehlerzustand einer `resource()`; im Erfolgsfall den
 * projizierten Inhalt. Beim Neuladen bleibt der Inhalt sichtbar und es
 * erscheint nur ein Fortschrittsbalken.
 */
@Component({
  selector: 'app-data-state',
  imports: [MatProgressSpinnerModule, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './data-state.html',
  styleUrl: './data-state.scss',
})
export class DataState {
  readonly status = input.required<ResourceStatus>();
  readonly error = input<Error | undefined>();
  readonly loadingLabel = input('Lädt…');
  readonly retry = output<void>();

  protected readonly message = computed(() => errorMessage(this.error()));
  protected readonly showContent = computed(
    () => this.status() !== 'loading' && this.status() !== 'error',
  );
}
