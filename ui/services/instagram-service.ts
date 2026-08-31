import { BaseService } from "./api-service-base";

export interface InstagramFeedDto {
    user?: InstagramUserDto;
    data: InstagramPostDto[];
}

export interface InstagramUserDto {
    id: string;
    username?: string;
    profile_picture_url?: string;
}

export interface InstagramPostDto {
    id: string;
    media_type: string;              // "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
    media_url?: string;              // zeigt auf euren eigenen insta-media-Endpunkt
    thumbnail_url?: string;
    caption?: string;
    permalink: string;
    timestamp: string;               // ISO-String
    like_count?: number;
    comments_count?: number;
    children?: InstagramChildDto[];
    width?: number;
    height?: number;
}

export interface InstagramChildDto {
    id: string;
    media_type: string;
    media_url?: string;
    width?: number;
    height?: number;
}

class InstagramService extends BaseService {

    constructor() {
        super("/api/insta");
    }

    /** Holt die letzten Posts (Default 5). */
    getPosts(limit = 5, signal?: AbortSignal): Promise<InstagramFeedDto> {
        return this.get<InstagramFeedDto>(`/insta-posts?limit=${limit}`, signal);
    }

    /** URL zu einem Medium (Bild/Video) – für <img>/<video src>. */
    getMediaUrl(name: string): string {
        return this.buildUrl(`/insta-media/${encodeURIComponent(name)}`);
    }
}

export default new InstagramService();