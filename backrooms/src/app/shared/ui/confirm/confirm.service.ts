import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog } from './confirm-dialog';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Rote Bestaetigen-Schaltflaeche fuer destruktive Aktionen. */
  danger?: boolean;
}

export type ConfirmData = Required<ConfirmOptions>;

/**
 * Bestaetigungsdialog als Promise: `if (await confirm.ask({...})) { ... }`.
 * Darunter liegt ein Material-Dialog, der Fokusfalle, Escape und Backdrop
 * selbst uebernimmt.
 */
@Service()
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  async ask(options: ConfirmOptions): Promise<boolean> {
    const ref = this.dialog.open<ConfirmDialog, ConfirmData, boolean>(ConfirmDialog, {
      data: {
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Bestätigen',
        cancelLabel: options.cancelLabel ?? 'Abbrechen',
        danger: options.danger ?? false,
      },
      width: '420px',
      maxWidth: 'calc(100vw - 2rem)',
      autoFocus: 'dialog',
      restoreFocus: true,
    });
    return (await firstValueFrom(ref.afterClosed())) ?? false;
  }

  /** Bequemer Standardfall fuer Loeschen. */
  confirmDelete(what: string): Promise<boolean> {
    return this.ask({
      title: 'Wirklich löschen?',
      message: `„${what}“ wird dauerhaft gelöscht. Das lässt sich nicht rückgängig machen.`,
      confirmLabel: 'Löschen',
      danger: true,
    });
  }
}
