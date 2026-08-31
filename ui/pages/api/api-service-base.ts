export abstract class BaseService {
    protected readonly baseUrl: string;

    protected constructor(resource: string) {
        const API_BASE = process.env.NEXT_PUBLIC_DISPLAY_API ?? "";
        this.baseUrl = `${API_BASE}${resource}`;
        console.log("API_BASE", API_BASE);
        console.log("resource", resource);
    }

    protected async get<T>(path = "", signal?: AbortSignal): Promise<T> {
        return this.request<T>(path, { method: "GET", cache: "no-store", signal });
    }

    protected async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
        return this.request<T>(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal,
        });
    }

    private async request<T>(path: string, init: RequestInit): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, init);
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return await res.json() as Promise<T>;
    }

    protected buildUrl(path: string, params?: Record<string, string>): string {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return `${this.baseUrl}${path}${query}`;
    }
}