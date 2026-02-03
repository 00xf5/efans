export interface Post {
    id: string;
    source: {
        name: string;
        username: string;
        avatar: string;
        verified: boolean;
    };
    type: string;
    timestamp: string;
    content: string;
    media?: string;
    stats: {
        likes: string;
        whispers: number;
        shares: number;
    };
    locked?: boolean;
    isPublic?: boolean;
    comments?: { id: string; user: string; avatar: string; content: string; }[];
    relayer?: { name: string; username: string; };
    price?: string;
}

export interface TrendingCreator {
    id: string;
    name: string;
    avatar: string;
    heat: number;
    status: string;
    velocity: number;
}
