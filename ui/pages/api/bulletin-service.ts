import {BaseService} from "./api-service-base";

class BulletinService extends BaseService {

    constructor() {
        super("/api/bulletin");
    }

    async getBulletinPosts(board: string, limit: number = 5, page: number = 0, signal?: AbortSignal): Promise<BulletinBoard> {
        let res = await this.getRaw(`/posts/${board}?limit=${limit}&page=${page}`, signal);
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