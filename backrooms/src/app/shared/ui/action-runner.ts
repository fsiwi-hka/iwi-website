import { inject, signal } from '@angular/core';
import { errorMessage } from '../../core/api/api-error';
import { ToastService } from './toast/toast.service';

/**
 * Fuehrt Listen-Aktionen (Loeschen, Umschalten, Verschieben) aus, merkt sich
 * den gerade beschaeftigten Eintrag und meldet Erfolg/Fehler per Toast.
 * Erzeugen mit `actionRunner()` in einem Feld-Initialisierer der Komponente.
 */
export class ActionRunner {
  private readonly toast = inject(ToastService);
  readonly busyId = signal<string | null>(null);

  isBusy(id: string): boolean {
    return this.busyId() === id;
  }

  async run(id: string, action: () => Promise<unknown>, successMessage?: string): Promise<boolean> {
    if (this.busyId()) {
      return false;
    }
    this.busyId.set(id);
    try {
      await action();
      if (successMessage) {
        this.toast.success(successMessage);
      }
      return true;
    } catch (error) {
      this.toast.error(errorMessage(error));
      return false;
    } finally {
      this.busyId.set(null);
    }
  }
}

export function actionRunner(): ActionRunner {
  return new ActionRunner();
}
