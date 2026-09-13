import { inject, Service } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type ToastKind = 'success' | 'error' | 'info';

const CONFIG: Record<ToastKind, MatSnackBarConfig> = {
  success: { duration: 4000, panelClass: 'snackbar--success' },
  info: { duration: 5000 },
  error: { duration: 8000, panelClass: 'snackbar--error' },
};

/**
 * Kurze Rueckmeldungen ueber die Material-Snackbar. Der Service kapselt sie,
 * damit Aufrufer nur `success` / `error` / `info` kennen muessen und die
 * Darstellung an einer Stelle liegt.
 */
@Service()
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, kind: ToastKind = 'info'): void {
    this.snackBar.open(message, 'OK', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      ...CONFIG[kind],
    });
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}
