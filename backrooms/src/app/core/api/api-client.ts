import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, fromEvent, Observable, takeUntil } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { ApiError, toApiError } from './api-error';

export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Duenner, Promise-basierter Wrapper um HttpClient. Alle HTTP-Implementierungen
 * der API-Vertraege gehen hier durch, damit Basis-URL, Fehler-Mapping und
 * Abbruch an einer Stelle liegen. Promises statt Observables, weil die
 * Mock-Implementierungen dieselbe Signatur mit `async` trivial erfuellen und
 * `resource()` mit Promises arbeitet.
 */
@Service()
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_CONFIG).apiBaseUrl.replace(/\/+$/, '');

  url(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  get<T>(path: string, params?: QueryParams, signal?: AbortSignal): Promise<T> {
    return this.run(this.http.get<T>(this.url(path), { params: toHttpParams(params) }), signal);
  }

  post<T>(path: string, body?: unknown, params?: QueryParams): Promise<T> {
    return this.run(
      this.http.post<T>(this.url(path), body ?? null, { params: toHttpParams(params) }),
    );
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.run(this.http.put<T>(this.url(path), body));
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.run(this.http.patch<T>(this.url(path), body));
  }

  async delete(path: string): Promise<void> {
    await this.run(this.http.delete<unknown>(this.url(path)));
  }

  /** Multipart-Upload; die Datei liegt im Feld `file`, weitere Felder daneben. */
  upload<T>(path: string, file: File, fields: Record<string, string> = {}): Promise<T> {
    const data = new FormData();
    data.append('file', file, file.name);
    for (const [key, value] of Object.entries(fields)) {
      data.append(key, value);
    }
    return this.run(this.http.post<T>(this.url(path), data));
  }

  private async run<T>(request$: Observable<T>, signal?: AbortSignal): Promise<T> {
    if (signal?.aborted) {
      throw new ApiError('aborted');
    }
    const source$ = signal ? request$.pipe(takeUntil(fromEvent(signal, 'abort'))) : request$;
    try {
      return await firstValueFrom(source$);
    } catch (error) {
      if (signal?.aborted) {
        throw new ApiError('aborted');
      }
      throw toApiError(error);
    }
  }
}

function toHttpParams(params?: QueryParams): HttpParams | undefined {
  if (!params) {
    return undefined;
  }
  let result = new HttpParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result = result.set(key, String(value));
    }
  }
  return result;
}
