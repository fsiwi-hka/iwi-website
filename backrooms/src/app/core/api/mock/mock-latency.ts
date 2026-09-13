import { ApiError } from '../api-error';

let latency: { min: number; max: number } = { min: 120, max: 420 };

/** Fuer Tests: `setMockLatency(0, 0)` macht alle Mock-Aufrufe sofort fertig. */
export function setMockLatency(min: number, max = min): void {
  latency = { min, max };
}

/** Simuliert Netzwerkverzoegerung, damit Lade- und Abbruchzustaende sichtbar werden. */
export function simulateLatency(
  signal?: AbortSignal,
  min = latency.min,
  max = latency.max,
): Promise<void> {
  const ms = min + Math.random() * Math.max(0, max - min);
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError('aborted'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new ApiError('aborted'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
