import { BaseService } from "./api-service-base";

class ProtocolService extends BaseService {
    constructor() {
        super("/api/protocols");
    }

    /** Liste aller Protokolle: { kategorie: [dateiname, ...] } */
    listProtocols(signal?: AbortSignal): Promise<ProtocolIndex> {
        return this.get<ProtocolIndex>("", signal);
    }

    /** URL zum Öffnen/Herunterladen einer PDF – für <a href> oder <iframe src> */
    getProtocolUrl(fileName: string): string {
        return this.buildUrl(`/${encodeURIComponent(fileName)}`);
    }
}

export type ProtocolIndex = Record<string, string[]>;

export default new ProtocolService();