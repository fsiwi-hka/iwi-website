import {BaseService} from "./api-service-base";

export interface Zeitraum {
    beginn: string | null; // ISO-Date "2026-09-14", null wenn das Backend nichts hat
    ende: string | null;
}

export interface Vorkurse {
    mathe: Zeitraum;
    programmieren: Zeitraum;
}

export interface OPhaseInfo {
    semester: string;
    vorkurse: Vorkurse;
    orientierungsphase: Zeitraum;
    vorlesungszeit: Zeitraum;
    changedAt: string | null;
    semesterName: string;
    semesterYear: string;
}

class OPhaseService extends BaseService {
    constructor() {
        super("/api/ophase");
    }

    async getOPhaseInfo(signal?: AbortSignal): Promise<OPhaseInfo> {
        return this.get<OPhaseInfo>("", signal);
    }

    /* version (z.B. changedAt) landet als ?v= in der URL. Browser, die das Bild
     * noch mit dem alten "immutable"-Header gecacht haben, bekommen so eine neue
     * URL und laden neu. */
    getTimetableUrl(course: "I" | "WI", version?: string | null): string {
        return this.buildUrl("/timetable", version ? { course, v: version } : { course });
    }
}

export default new OPhaseService();