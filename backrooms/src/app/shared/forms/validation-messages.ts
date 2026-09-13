import { Signal } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

/** Strukturelle Sicht auf einen Signal-Forms-Knoten, damit jeder Feldtyp passt. */
export type FieldLike = () => {
  readonly errors: Signal<readonly ValidationError[]>;
};

interface LimitError {
  minLength?: number;
  maxLength?: number;
  min?: unknown;
  max?: unknown;
}

/** Deutsche Standardmeldungen fuer die eingebauten Signal-Forms-Validatoren. */
export function validationMessage(error: ValidationError): string {
  if (error.message) {
    return error.message;
  }
  const limits = error as LimitError;
  switch (error.kind) {
    case 'required':
      return 'Pflichtfeld.';
    case 'minLength':
      return `Mindestens ${limits.minLength} Zeichen.`;
    case 'maxLength':
      return `Höchstens ${limits.maxLength} Zeichen.`;
    case 'min':
      return `Mindestens ${String(limits.min)}.`;
    case 'max':
      return `Höchstens ${String(limits.max)}.`;
    case 'pattern':
      return 'Ungültiges Format.';
    case 'email':
      return 'Ungültige E-Mail-Adresse.';
    default:
      return 'Ungültige Eingabe.';
  }
}

/**
 * Text fuer ein `<mat-error>`. Wann der Fehler sichtbar wird, entscheidet das
 * `mat-form-field` selbst (Material wertet bei Signal Forms `invalid` und
 * `touched` aus) - hier geht es nur um den Text.
 *
 * Im Template als Methode aufrufen, damit die Signal-Abhaengigkeit greift:
 * `<mat-error>{{ errorText(form.title) }}</mat-error>`
 */
export function fieldErrorText(field: FieldLike): string {
  const errors = field().errors();
  return errors.length > 0 ? validationMessage(errors[0]) : '';
}
