import {BaseService} from "./api-service-base";

class BulletinService extends BaseService {

    constructor() {
        super("/api/bulletin");
    }

    /** offset ist der Index des ersten Posts, nicht die Seitennummer - so erwartet es der BulletinBoardController. */
    async getBulletinPosts(board: string, limit: number = 5, offset: number = 0, signal?: AbortSignal): Promise<BulletinBoard> {
        const query = new URLSearchParams({ board, limit: String(limit), offset: String(offset) });
        const res = await this.getRaw(`/posts?${query}`, signal);
        const items = (await res.json()) as BulletinDto[];
        const total = Number(res.headers.get("X-Total-Count") ?? items.length);
        return {
            count: total,
            items
        } satisfies BulletinBoard;
    }
}

export default new BulletinService();

export interface BulletinBoard {
    count: number;
    items: BulletinDto[];
}

export interface BulletinDto {
    title: string;
    type: string;
    content: string;
    id: number;
    creator: string;
    coursesOfStudy: string[];
    departments: string[];
    publicationTimestamp: string; // ISO-8601 DateTimeOffset
}