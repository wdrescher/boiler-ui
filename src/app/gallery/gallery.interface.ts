import { Paginator } from '../app.interface';

export interface TileData {
    name: string; 
}

export interface FeedResponse {
    feed: ContentReference[], 
    pagination_next: Paginator
}

export interface ContentReference {
    username: string; 
    content_id: string;
}