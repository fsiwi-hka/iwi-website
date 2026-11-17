import {BaseService} from "./api-service-base";

class InfotainmentService extends BaseService {

    constructor() {
        super("/api/info");
    }

    public async getSlides(signal?: AbortSignal): Promise<SlideDto[]> {
        return this.get<SlideDto[]>("", signal);
    }

    public getSlideUrl(name: string): string {
        const url = this.buildUrl(`${name}`);
        console.log("URL", url);
        return url;
    }
}

export interface SlideDto {
    type: SlideType;
    src: string;
    duration: number;
    alt: string;
}

export type SlideType = "image" | "video";

export default new InfotainmentService();