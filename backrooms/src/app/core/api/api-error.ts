import { HttpErrorResponse } from '@angular/common/http';

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'aborted'
  | 'unknown';

const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'Keine Verbindung zum Server.',
  unauthorized: 'Bitte melde dich erneut an.',
  forbidden: 'Dafür fehlt dir die Berechtigung.',
  'not-found': 'Der Eintrag wurde nicht gefunden.',
  validation: 'Die Eingaben sind ungültig.',
  conflict: 'Der Eintrag wurde zwischenzeitlich geändert. Bitte neu laden.',
  server: 'Auf dem Server ist ein Fehler aufgetreten.',
  aborted: 'Die Anfrage wurde abgebrochen.',
  unknown: 'Ein unbekannter Fehler ist aufgetreten.',
};

/**
 * Einheitlicher Fehler fuer alle API-Implementierungen (HTTP und Mock).
 * Komponenten muessen so nie zwischen HttpErrorResponse und Mock-Fehlern
 * unterscheiden.
 */
export class ApiError extends Error {
  override readonly name = 'ApiError';

  constructor(
    readonly kind: ApiErrorKind,
    message = DEFAULT_MESSAGES[kind],
    readonly status = 0,
    readonly details?: unknown,
  ) {
    super(message);
  }

  static fromStatus(status: number, message?: string, details?: unknown): ApiError {
    const kind = kindFromStatus(status);
    return new ApiError(kind, message ?? DEFAULT_MESSAGES[kind], status, details);
  }
}

function kindFromStatus(status: number): ApiErrorKind {
  switch (status) {
    case 0:
      return 'network';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not-found';
    case 400:
    case 422:
      return 'validation';
    case 409:
      return 'conflict';
    default:
      return status >= 500 ? 'server' : 'unknown';
  }
}

interface ProblemDetails {
  message?: string;
  title?: string;
  detail?: string;
  errors?: unknown;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof HttpErrorResponse) {
    const body = (typeof error.error === 'object' ? error.error : null) as ProblemDetails | null;
    const message = body?.message ?? body?.detail ?? body?.title;
    return ApiError.fromStatus(error.status, message, body?.errors ?? body ?? undefined);
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('aborted');
  }
  if (error instanceof Error) {
    return new ApiError('unknown', error.message || DEFAULT_MESSAGES.unknown);
  }
  return new ApiError('unknown');
}

/** Nutzerfreundliche Meldung fuer Toasts und Fehlerzustaende. */
export function errorMessage(error: unknown): string {
  return toApiError(error).message;
}
