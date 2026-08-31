import {BaseService} from "./api-service-base";

export interface Zeitraum {
    beginn: string; // ISO-Date "2026-09-14"
    ende: string;
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
    changedAt: string;
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

    getTimetableUrl(course: "I" | "WI"): string {
        return this.buildUrl("/timetable", { course });
    }
}

export default new OPhaseService();