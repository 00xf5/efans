import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import { Link } from "react-router";

interface Post {
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

interface TrendingCreator {
    id: string;
    name: string;
    avatar: string;
    heat: number;
    status: string;
    velocity: number;
}

const MOCK_MOMENTS: Post[] = [
    {
        id: "m1",
        source: {
            name: "Valentina Noir",
            username: "v_noir",
            avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200",
            verified: true
        },
        type: "EXCLUSIVE_PREVIEW",
        timestamp: "2h ago",
        content: "Drafting the midnight sequences. The shadows are behaving differently tonight. Can you feel the tension?",
        media: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "1.2k", whispers: 84, shares: 45 },
        locked: true,
        price: "1,500"
    },
    {
        id: "m2",
        source: {
            name: "Adrien Thorne",
            username: "adrien",
            avatar: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=200",
            verified: true
        },
        type: "LIFESTYLE_INSIGHT",
        timestamp: "5h ago",
        content: "New training metrics are in. Peak performance isn't a goal, it's a baseline. Sweat and silk.",
        media: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "842", whispers: 22, shares: 12 },
        locked: false
    },
    {
        id: "m3",
        source: {
            name: "Sienna Ray",
            username: "siennaray",
            avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200",
            verified: true
        },
        type: "BEHIND_SCENES",
        timestamp: "8h ago",
        content: "The dawn light hitting the studio just right. Everything feels like a dream.",
        media: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "2.1k", whispers: 156, shares: 89 },
        locked: true,
        price: "1,200"
    },
    {
        id: "m4",
        source: {
            name: "Lucas Vance",
            username: "lvance",
            avatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=200",
            verified: true
        },
        type: "URBAN_EXPLORE",
        timestamp: "12h ago",
        content: "The city breathes in neon. Every corner has a story, every shadow a secret.",
        media: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "654", whispers: 45, shares: 23 },
        locked: false
    }
];

const FEATURED_CREATORS = [
    { name: "Valentina Noir", handle: "@v_noir", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", tag: "Midnight Art", color: "from-pink-400/50" },
    { name: "Adrien Thorne", handle: "@adrien", img: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=800", tag: "Raw Power", color: "from-rose-400/50" },
    { name: "Sienna Ray", handle: "@siennaray", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800", tag: "Velvet Hour", color: "from-pink-500/50" },
    { name: "Lucas Vance", handle: "@lvance", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800", tag: "Urban Intimacy", color: "from-rose-500/50" },
    { name: "Elena Mour", handle: "@elenamour", img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800", tag: "Golden Hour", color: "from-pink-300/50" },
];

const MOCK_REELS = [
    {
        id: "r1",
        name: "Valentina Noir",
        handle: "@v_noir",
        video: "https://player.vimeo.com/external/434045526.sd.mp4?s=c355bcc5866ef11d13f982aefca88d6c702ccb79&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        color: "from-pink-500/40"
    },
    {
        id: "r2",
        name: "Luna Star",
        handle: "@lunastar",
        video: "https://player.vimeo.com/external/459389137.sd.mp4?s=87ae19dc810ea2a0a1f9e2b02713f01b7a2d677d&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
        color: "from-rose-500/40"
    },
    {
        id: "r3",
        name: "Neon J",
        handle: "@neonj",
        video: "https://player.vimeo.com/external/517090025.sd.mp4?s=d74944d6c1b3437537b03657cd33116819b1652d&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=400",
        color: "from-pink-400/40"
    },
    {
        id: "r4",
        name: "Sienna Ray",
        handle: "@siennaray",
        video: "https://player.vimeo.com/external/371433846.sd.mp4?s=231da6ab3a074c053174548480749e4d56f6ce4e&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=400",
        color: "from-pink-600/40"
    },
    {
        id: "r5",
        name: "Alex Rivers",
        handle: "@arivers",
        video: "https://player.vimeo.com/external/494252666.sd.mp4?s=72097931f67f6fc20163351ecdd426d1175841d6&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
        color: "from-blue-500/40"
    },
    {
        id: "r6",
        name: "Elena Mour",
        handle: "@elenamour",
        video: "https://player.vimeo.com/external/178553258.sd.mp4?s=07e0c8de152865611c3a64736f114b726059d48b&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=400",
        color: "from-orange-500/40"
    }
];

const INITIAL_FLOW_POSTS: Post[] = [
    {
        id: "fp1",
        source: {
            name: "Premium Fan",
            username: "fan_02",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
            verified: false
        },
        type: "FLOW_POST",
        timestamp: "Just now",
        content: "Really loving the new interface here! It feels so much more personal than other platforms. Can't wait to see more from @v_noir tonight. ✨",
        stats: { likes: "12", whispers: 2, shares: 1 },
        isPublic: true,
        comments: [
            { id: "c1", user: "Neon Muse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", content: "This is exactly what the community needed! Love the transparency. 💖" }
        ]
    },
    {
        id: "fp2",
        source: {
            name: "Elena Mour",
            username: "elenamour",
            avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=200",
            verified: true
        },
        type: "FLOW_POST",
        timestamp: "15m ago",
        content: "Golden hour is approaching. Should I go live later? 🌅",
        media: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "245", whispers: 0, shares: 18 },
        isPublic: true,
        comments: []
    },
    {
        id: "fp3",
        source: {
            name: "Julian Voss",
            username: "jvoss",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
            verified: true
        },
        type: "FLOW_POST",
        timestamp: "45m ago",
        content: "Just finished the private exhibition in Milan. The light in that gallery... it doesn't just illuminate, it breathes. Moving to the next Sanctuary soon. 🏛️✨",
        stats: { likes: "156", whispers: 0, shares: 5 },
        isPublic: true,
        comments: []
    },
    {
        id: "fp4",
        source: {
            name: "Sofia Sterling",
            username: "sofia_s",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
            verified: true
        },
        type: "FLOW_POST",
        timestamp: "1h ago",
        content: "Found a fragment of pure silence in the middle of the city. Luxury isn't about the noise, it's about the space between notes. 🍸🖤",
        stats: { likes: "890", whispers: 0, shares: 145 },
        isPublic: true,
        comments: []
    },
    {
        id: "fp5",
        source: {
            name: "Luna Star",
            username: "lunastar",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
            verified: true
        },
        type: "FLOW_POST",
        timestamp: "3h ago",
        content: "WIP: Designing the companion for my next digital world. What should her name be? 🌌🎨",
        media: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
        stats: { likes: "1.5k", whispers: 0, shares: 89 },
        isPublic: true,
        comments: []
    },
    {
        id: "fp6",
        source: {
            name: "Alex Rivers",
            username: "arivers",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            verified: true
        },
        type: "FLOW_POST",
        timestamp: "5h ago",
        content: "Sunrise intensity. 5 AM calibration. The body follows the mind's resonance. ⚖️💪",
        stats: { likes: "450", whispers: 0, shares: 12 },
        isPublic: true,
        comments: []
    }
];

const INITIAL_TRENDING: TrendingCreator[] = [
    { id: "t1", name: "Valentina Noir", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", heat: 98.4, status: "Peak", velocity: 1.2 },
    { id: "t2", name: "Thorne Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", heat: 94.2, status: "Rising", velocity: 0.8 },
    { id: "t3", name: "Sienna Ray", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800", heat: 88.7, status: "Hot", velocity: -0.2 },
    { id: "t4", name: "Lucas Vance", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800", heat: 82.1, status: "Stable", velocity: -1.5 },
    { id: "t5", name: "Evelyn Ross", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800", heat: 77.5, status: "Rising", velocity: 0.4 },
    { id: "t6", name: "Alex Rivers", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", heat: 74.8, status: "Rising", velocity: 0.1 },
    { id: "t7", name: "Kaya Light", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800", heat: 71.2, status: "Steady", velocity: -0.5 },
    { id: "t8", name: "Mour Noir", avatar: "https://images.unsplash.com/photo-1494790108377-be9cf29b2933?auto=format&fit=crop&q=80&w=800", heat: 68.4, status: "Rising", velocity: 0.2 }
];

// Custom hook for intersection observer
const useVisibility = (options: IntersectionObserverInit) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

// --- Optimized Components ---

const MomentCardSkeleton = () => (
    <div className="glass-card rounded-[3rem] p-8 bg-white/50 border-pink-50 space-y-8 animate-pulse">
        <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100"></div>
            <div className="space-y-3 flex-grow">
                <div className="w-48 h-4 bg-zinc-100 rounded-full"></div>
                <div className="w-32 h-2.5 bg-zinc-50 rounded-full"></div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="w-full h-3 bg-zinc-100 rounded-full"></div>
            <div className="w-full h-3 bg-zinc-100 rounded-full"></div>
            <div className="w-3/4 h-3 bg-zinc-100 rounded-full"></div>
        </div>
        <div className="aspect-video bg-zinc-50 rounded-2xl"></div>
    </div>
);

const TrendingAltarItem = memo(({ creator, rank, onBoost }: { creator: TrendingCreator, rank: number, onBoost: (id: string) => void }) => {
    const [ref, isVisible] = useVisibility({ rootMargin: '200px' });

    return (
        <div ref={ref} className="relative min-h-[500px] w-full">
            {isVisible ? (
                <div className="relative group cursor-pointer animate-in fade-in duration-700">
                    <div className="relative aspect-[3/4.5] w-full rounded-[4.5rem] overflow-hidden border-[3px] border-pink-50/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group-hover:scale-[1.02] transition-transform duration-1000">
                        <img src={creator.avatar} loading="lazy" className="w-full h-full object-cover transition-all duration-[8s] ease-out group-hover:scale-110" alt="" />

                        {/* Paid Boost Portal (Teaser) */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onBoost(creator.id); }}
                            className="absolute top-24 right-8 z-30 w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hover:bg-pink-500 hover:border-pink-400"
                        >
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12l10-10 10 10" /></svg>
                        </button>

                        <div className="absolute top-8 left-8 z-20">
                            <div className="px-6 py-3 bg-zinc-900/95 backdrop-blur-3xl border border-white/20 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                                <span className="text-lg font-black text-white italic">#{rank}</span>
                                <span className="w-[1px] h-4 bg-white/20"></span>
                                <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">{creator.status}</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-95 group-hover:opacity-80 transition-opacity"></div>
                        <div className="absolute bottom-12 left-10 right-10 space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none drop-shadow-2xl">{creator.name}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[12px] font-black text-pink-500 uppercase tracking-[0.5em] flex items-center gap-3">
                                        <span className={`w-3 h-3 rounded-full bg-pink-500 ${creator.velocity > 0 ? 'animate-ping' : ''} shadow-[0_0_15px_rgba(236,72,153,0.8)]`}></span>
                                        {creator.velocity > 0 ? 'Apex Velocity' : 'Cooling'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Core Resonance</span>
                                        <span className="text-4xl font-black text-white italic tabular-nums leading-none tracking-tighter">{creator.heat.toFixed(1)}°</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Flow</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[3px] border border-white/10">
                                    <div className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full transition-all duration-[1.5s] shadow-[0_0_25px_rgba(236,72,153,0.6)]" style={{ width: `${creator.heat}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="aspect-[3/4.5] w-full rounded-[4.5rem] bg-zinc-50 animate-pulse border border-pink-50"></div>
            )}
        </div>
    );
});

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const RelayIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
);

const MomentCard = memo(({ moment, addReaction, reactions, isFlow = false, onAddComment, onRelay, onUnlock }: { moment: Post, addReaction: (e: React.MouseEvent) => void, reactions: { id: number, x: number, y: number }[], isFlow?: boolean, onAddComment?: (postId: string, content: string) => void, onRelay?: (post: Post) => void, onUnlock?: (postId: string) => void }) => {
    const [ref, isVisible] = useVisibility({ threshold: 0.1, rootMargin: '400px' });
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");

    const handleCommentSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && commentInput.trim() && onAddComment) {
            onAddComment(moment.id, commentInput);
            setCommentInput("");
        }
    };

    return (
        <article ref={ref} className="group relative scroll-mt-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            {!isFlow && (
                <div className="absolute -left-16 top-24 hidden xl:flex flex-col gap-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700 delay-100">
                    <button className="w-12 h-12 rounded-2xl glass border-pink-100 flex items-center justify-center text-pink-500 hover:scale-110 transition-all">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </button>
                    <button className="w-12 h-12 rounded-2xl glass border-pink-100 flex items-center justify-center text-zinc-400 hover:text-pink-500 hover:scale-110 transition-all">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                    </button>
                </div>
            )}

            <div className={`glass-card rounded-[3rem] overflow-hidden border-pink-50 bg-white/70 hover:bg-white/90 transition-all duration-700 light-sweep-container shadow-xl shadow-pink-100/20 ${isFlow ? 'scale-95 hover:scale-100' : ''}`}>
                {moment.relayer && (
                    <div className="px-8 py-3 bg-pink-50/30 border-b border-pink-50/50 flex items-center gap-2">
                        <RelayIcon />
                        <span className="text-[10px] font-black uppercase text-pink-400 tracking-widest italic">{moment.relayer.name} echoed this vision</span>
                    </div>
                )}
                <div className="p-6 flex items-center justify-between border-b border-pink-50/50">
                    <Link to={`/creator/${moment.source.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-4 group/author">
                        <img src={moment.source.avatar} loading="lazy" className="w-12 h-12 rounded-xl object-cover ring-2 ring-pink-50 relative z-10 group-hover/author:scale-105 transition-all duration-500" alt="" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-premium italic text-base text-pink-900 leading-none group-hover/author:text-pink-600 transition-colors duration-500">{moment.source.name}</h3>
                                {moment.source.verified && <span className="text-[10px] bg-pink-500 text-white p-0.5 rounded-full">✓</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-zinc-400 text-[9px] font-bold tracking-widest uppercase group-hover/author:text-zinc-600 transition-colors duration-500">@{moment.source.username}</span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-zinc-400 text-[9px] font-bold tracking-widest uppercase">{moment.timestamp}</span>
                            </div>
                        </div>
                    </Link>
                    {isFlow && (
                        <button className="text-zinc-300 hover:text-pink-400 transition-colors">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                        </button>
                    )}
                </div>

                <div className="px-8 py-6">
                    <p className="text-zinc-700 font-medium leading-relaxed text-base italic whitespace-pre-wrap">
                        {moment.content}
                    </p>
                </div>

                {moment.media && (
                    <div className="px-4 mb-4">
                        {isVisible ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden group/media cursor-pointer select-none shadow-sm" onDoubleClick={addReaction}>
                                {moment.media.endsWith('.mp4') ? (
                                    <video src={moment.media} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <img src={moment.media} loading="lazy" className={`w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[3s] ease-out ${moment.locked ? 'blur-3xl grayscale brightness-[0.8]' : ''}`} alt="" />
                                )}

                                {reactions.map(r => (
                                    <div key={r.id} className="absolute pointer-events-none z-50 text-white animate-float-up" style={{ left: r.x, top: r.y }}>
                                        <div className="text-4xl filter drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))">❤️</div>
                                    </div>
                                ))}

                                {moment.locked ? (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-pink-50/40 backdrop-blur-sm">
                                        <h4 className="text-2xl text-premium italic text-pink-900 leading-tight">Secret <br />Transmission.</h4>
                                        <button onClick={() => onUnlock && onUnlock(moment.id)} className="bg-pink-500 text-white hover:bg-pink-600 px-8 py-3.5 rounded-full font-black text-[10px] transition-all shadow-xl shadow-pink-200 active:scale-95 uppercase tracking-[0.3em]">
                                            Unlock Vision • ₦{moment.price || '500'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-pink-50/10 backdrop-blur-3xl flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                                        <span className="text-[10px] uppercase tracking-widest text-pink-300 font-black italic">Revealed Vision</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video rounded-2xl bg-zinc-50 animate-pulse border border-pink-50" />
                        )}
                    </div>
                )}

                <div className="px-8 py-4 border-t border-pink-50/50 flex items-center justify-between">
                    <div className="flex gap-8">
                        <button onClick={addReaction} className="flex items-center gap-2 group/stat cursor-pointer text-zinc-400 hover:text-pink-500 transition-colors">
                            <HeartIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 transition-colors">{moment.stats.likes}</span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 group/stat cursor-pointer transition-colors ${showComments ? 'text-pink-500' : 'text-zinc-400 hover:text-pink-500'}`}>
                            <MessageIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 transition-colors">{moment.stats.whispers || moment.comments?.length || 0}</span>
                        </button>
                        <button onClick={() => onRelay && onRelay(moment)} className="flex items-center gap-2 group/stat cursor-pointer text-zinc-400 hover:text-pink-500 transition-colors">
                            <RelayIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 transition-colors">{moment.stats.shares}</span>
                        </button>
                    </div>
                </div>

                {showComments && (
                    <div className="px-8 py-6 bg-pink-50/30 border-t border-pink-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-8 h-8 rounded-lg object-cover" alt="" />
                                <div className="flex-grow">
                                    <input
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        onKeyDown={handleCommentSubmit}
                                        placeholder="Add a whisper..."
                                        className="w-full bg-white/50 border border-pink-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {moment.comments?.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-500">
                                        <img src={comment.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-pink-900 italic">{comment.user}</p>
                                            <p className="text-sm text-zinc-600 mt-1">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
});

export default function Timeline() {
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [reactions, setReactions] = useState<{ id: number, x: number, y: number }[]>([]);
    const [flowPosts, setFlowPosts] = useState(INITIAL_FLOW_POSTS);
    const [visions, setVisions] = useState(MOCK_MOMENTS);
    const [trending, setTrending] = useState(INITIAL_TRENDING);
    const [newPostContent, setNewPostContent] = useState("");
    const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Kinetic Economy Loop (Heat Decay) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTrending(prev => {
                const refreshed = prev.map(c => {
                    const decay = 0.08; // Economic Gravity: Status fades without fuel
                    const drift = (Math.random() * 0.4) - 0.1;
                    const newHeat = Math.max(0, Math.min(100, c.heat - decay + drift));
                    return {
                        ...c,
                        heat: newHeat,
                        velocity: drift - decay,
                        status: newHeat > 95 ? "Peak" : newHeat > 85 ? "Rising" : "Hot"
                    };
                });
                return [...refreshed].sort((a, b) => b.heat - a.heat);
            });
        }, 5000);

        // Simulated skeleton clearing
        const timer = setTimeout(() => setIsLoading(false), 900);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const handleBoost = (id: string) => {
        setTrending(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, heat: Math.min(100, c.heat + 15), velocity: 2.0 };
            }
            return c;
        }).sort((a, b) => b.heat - a.heat));
    };

    const handlePostSubmit = () => {
        if (!newPostContent.trim() && !attachedMedia) return;

        const newPost: Post = {
            id: `fp-${Date.now()}`,
            source: {
                name: "Premium Fan",
                username: "fan_02",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                verified: false
            },
            type: "FLOW_POST",
            timestamp: "Just now",
            content: newPostContent,
            media: attachedMedia || undefined,
            stats: { likes: "0", whispers: 0, shares: 0 },
            isPublic: true,
            comments: []
        };

        setFlowPosts([newPost, ...flowPosts]);
        setNewPostContent("");
        setAttachedMedia(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAttachedMedia(url);
        }
    };

    const addReaction = (e: React.MouseEvent) => {
        const id = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setReactions(prev => [...prev, { id, x, y }]);
        setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
    };

    const handleAddComment = (postId: string, content: string) => {
        setFlowPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [
                        ...(post.comments || []),
                        {
                            id: `c-${Date.now()}`,
                            user: "Premium Fan",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                            content
                        }
                    ]
                };
            }
            return post;
        }));
    };

    const handleRelay = (originalPost: Post) => {
        const relayPost: Post = {
            ...originalPost,
            id: `relay-${Date.now()}`,
            timestamp: "Just now",
            relayer: {
                name: "Premium Fan",
                username: "fan_02"
            },
            stats: { likes: "0", whispers: 0, shares: 0 },
            comments: []
        };
        setFlowPosts([relayPost, ...flowPosts]);
    };

    const handleUnlock = (postId: string) => {
        setFlowPosts(prev => prev.map(p => p.id === postId ? { ...p, locked: false } : p));
        setVisions(prev => prev.map(p => p.id === postId ? { ...p, locked: false } : p));
    };

    return (
        <div className="fixed inset-0 top-16 bg-white text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden max-w-[100vw]">

            {/* Dynamic Background Light */}
            {/* Notification Altar */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                    {toast}
                </div>
            )}

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-x-hidden">
                <div className="flex w-full max-w-[100vw] md:max-w-[2200px] gap-0 md:gap-12 h-full overflow-x-hidden">

                    {/* Column 1: Navigation Sidebar */}
                    <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
                        <div className="space-y-8 flex-grow pb-12">
                            <nav className="space-y-1">
                                <button onClick={() => setActiveTab("flow")} className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab === "flow" ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "hover:bg-pink-50 text-pink-900/60 hover:text-pink-600"}`}>
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">The Flow</span>
                                    </div>
                                </button>
                                <Link to="/timeline" onClick={() => setActiveTab("all")} className={`flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab !== "flow" && activeTab !== "messages" && activeTab !== "notifications" ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "hover:bg-pink-50 text-pink-900/60 hover:text-pink-600"}`}>
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                                    </div>
                                </Link>
                                <Link to="/messages" className="flex items-center justify-between px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                                    </div>
                                    <span className="bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">1</span>
                                </Link>
                                <Link to="/notifications" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                                </Link>
                            </nav>

                            <div className="space-y-1">
                                <h4 className="px-5 text-[10px] font-black text-pink-300 uppercase tracking-widest mb-3 italic">Quick Access</h4>
                                <Link to="/profile" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">My Identity</span>
                                </Link>
                                <button
                                    onClick={() => showToast("Under Calibration: Treasure Vault coming soon")}
                                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-left">Treasure</span>
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h4 className="px-5 text-[10px] font-black text-pink-300 uppercase tracking-widest mb-3 italic">Finance</h4>
                                <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 10v4M12 8v6M17 12v2" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Experience Hub</span>
                                </Link>
                                <button
                                    onClick={() => showToast("Under Calibration: Our Essence coming soon")}
                                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="16" /><path d="M12 12h.01" /><path d="M12 12V8" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-left">Our Essence</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-5 glass-card rounded-[2rem] border-pink-100 flex items-center gap-4 group cursor-pointer hover:scale-[1.02] mt-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center font-black text-sm text-white">U2</div>
                            <div className="flex-grow min-w-0">
                                <p className="text-xs font-black truncate text-premium italic text-pink-900">Premium Fan</p>
                            </div>
                        </div>
                    </aside>

                    {/* Column 2: Independent Center Feed */}
                    <main className="flex-grow max-w-2xl py-8 h-full overflow-y-auto scrollbar-hide space-y-12 px-2 scroll-smooth pb-32 lg:pb-8">
                        {/* Mobile Reels Carousel (Replaced Trending Now) */}
                        <div className="lg:hidden space-y-4 px-4 overflow-hidden mb-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] italic">Glimpses</h4>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1 pb-4">
                                {MOCK_REELS.map((reel) => (
                                    <div key={reel.id} className="flex-none w-28 group relative cursor-pointer">
                                        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-pink-50 shadow-lg">
                                            <img src={reel.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-transparent to-transparent opacity-80"></div>
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <p className="text-[8px] font-black text-white uppercase truncate tracking-widest leading-none mb-1">{reel.name}</p>
                                                <div className="flex gap-0.5">
                                                    <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                                                    <div className="w-1 h-1 rounded-full bg-rose-500/50"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Feed Header */}
                        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-3xl py-4 border-b border-pink-50 flex items-center justify-between gap-4 -mx-2 px-4 shadow-sm">
                            <div className="flex gap-2 p-1.5 bg-pink-50 rounded-[2.2rem] border border-pink-100 overflow-x-auto scrollbar-hide w-full sm:w-auto">
                                {["all", "flow", "unlocked", "featured", "reels"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 sm:px-8 py-2.5 rounded-[1.8rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200 scale-105" : "text-pink-300 hover:text-pink-500 hover:bg-white"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => showToast("Under Calibration: Deployment Terminal coming soon")}
                                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white border border-pink-100 rounded-2xl shadow-sm text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
                            </button>
                        </div>

                        {activeTab === "flow" && (
                            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                                {/* Studio Composer UI */}
                                <div className="glass-card rounded-[3rem] p-0 bg-white/90 border-pink-100/50 shadow-2xl shadow-pink-100/20 overflow-hidden">
                                    <div className="bg-zinc-900/5 p-4 flex items-center justify-between border-b border-pink-50">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-pink-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-300 italic">Studio Composer</span>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex gap-6">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-16 h-16 rounded-3xl object-cover ring-4 ring-pink-50 shadow-lg shadow-pink-100/50" alt="" />
                                            <div className="flex-grow space-y-4">
                                                <textarea
                                                    value={newPostContent}
                                                    onChange={(e) => setNewPostContent(e.target.value)}
                                                    placeholder="Reveal your essence to the world..."
                                                    className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium text-zinc-900 placeholder:text-zinc-300 resize-none min-h-[120px] scrollbar-hide"
                                                />
                                                {attachedMedia && (
                                                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] group shadow-2xl">
                                                        {attachedMedia.startsWith('blob:') || attachedMedia.includes('.mp4') ? (
                                                            <video src={attachedMedia} className="w-full h-full object-cover" controls />
                                                        ) : (
                                                            <img src={attachedMedia} className="w-full h-full object-cover" alt="" />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <button
                                                            onClick={() => setAttachedMedia(null)}
                                                            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-zinc-900/80 text-white flex items-center justify-center backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                        >
                                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-pink-50 flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-14 h-14 rounded-[1.8rem] bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-1 active:translate-y-0 active:scale-95 group relative"
                                                >
                                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900 text-white text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Vision</span>
                                                </button>
                                                <button className="w-14 h-14 rounded-[1.8rem] bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all hover:-translate-y-1 group relative">
                                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg>
                                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900 text-white text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Essence</span>
                                                </button>
                                                <div className="h-10 w-[1px] bg-pink-50 mx-2"></div>
                                                <div className="flex p-1.5 bg-pink-50/50 rounded-2xl border border-pink-100">
                                                    <button className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white text-pink-600 shadow-sm border border-pink-100">Public</button>
                                                    <button className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:bg-white/50 transition-all">Locked</button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handlePostSubmit}
                                                disabled={!newPostContent.trim() && !attachedMedia}
                                                className="bg-zinc-900 text-white pl-12 pr-6 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-6 group hover:shadow-zinc-200/50"
                                            >
                                                <span>Distribute</span>
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Feed */}
                                <div className="space-y-12 pb-32">
                                    {isLoading ? (
                                        <>
                                            <MomentCardSkeleton />
                                            <MomentCardSkeleton />
                                        </>
                                    ) : (
                                        flowPosts.map((post) => (
                                            <MomentCard key={post.id} moment={post} addReaction={addReaction} reactions={reactions} isFlow onAddComment={handleAddComment} onRelay={handleRelay} onUnlock={handleUnlock} />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "featured" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h1 className="text-5xl text-premium italic text-center text-pink-900">Divine <span className="text-gradient">Muse.</span></h1>
                                <div ref={carouselRef} className="flex overflow-x-auto gap-8 pb-12 snap-x scrollbar-hide px-4">
                                    {FEATURED_CREATORS.map((creator, i) => (
                                        <div key={i} className="flex-none w-[320px] h-[480px] snap-center rounded-[3rem] overflow-hidden glass-card relative group/card cursor-pointer shadow-2xl shadow-pink-100">
                                            <img src={creator.img} loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover/card:grayscale-0 transition-all duration-1000 animated-sensual" alt="" />
                                            <div className="absolute inset-0 vignette opacity-60"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-pink-900/50 to-transparent">
                                                <h3 className="text-3xl font-black text-white italic">{creator.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "reels" && (
                            <div className="space-y-8 animate-in fade-in duration-1000">
                                <h1 className="text-5xl text-premium italic text-center text-pink-900">Live <span className="text-gradient">Flow.</span></h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-20">
                                    {MOCK_REELS.map((reel) => (
                                        <div key={reel.id} className="relative aspect-[9/16] rounded-[3rem] overflow-hidden glass-card group/reel-tab cursor-pointer hover:card-glow-primary transition-all duration-700">
                                            <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover/reel-tab:scale-105 transition-transform" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <h3 className="text-2xl text-premium italic text-white">{reel.name}</h3>
                                            </div>
                                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-rose-600/30 backdrop-blur-xl rounded-full border border-rose-600/40">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest italic animate-pulse">LIVE</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(activeTab === "all" || activeTab === "unlocked") && (
                            <div className="space-y-20 pb-32">
                                {visions.map((moment) => (
                                    <MomentCard key={moment.id} moment={moment} addReaction={addReaction} reactions={reactions} onRelay={handleRelay} onUnlock={handleUnlock} />
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Column 3: Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-pink-50/20 px-4 border-x border-pink-50 transition-colors">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">Active Desires</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                        </div>

                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32 relative" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {[...MOCK_REELS, ...MOCK_REELS].map((reel, idx) => (
                                <div key={`${reel.id}-${idx}`} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-pink-100 group/reel cursor-pointer shadow-xl transition-all duration-500 hover:scale-[1.02]">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-pink-900/80 to-transparent">
                                        <h5 className="text-[11px] font-black uppercase text-white italic tracking-widest">{reel.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Column 4: Trending Rail (The Grand Discovery Altar) */}
                    <aside className="hidden 2xl:flex flex-col w-[480px] py-8 h-full space-y-12 bg-white border-l border-pink-50 overflow-hidden relative">
                        {/* Heat Aurora Header */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>

                        <div className="px-10 space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black text-pink-900 uppercase tracking-[0.6em] italic leading-none">The Apex Gallery</h4>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40 animate-pulse delay-150"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="h-[2px] flex-grow bg-gradient-to-r from-pink-500 to-transparent"></span>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] whitespace-nowrap">Live Resonances</p>
                            </div>
                        </div>

                        <div className="flex-grow space-y-16 overflow-y-auto scrollbar-hide px-10 pb-48 relative z-10">
                            {isLoading ? (
                                <>
                                    <div className="w-full aspect-[3/4.5] rounded-[4.5rem] bg-zinc-100 animate-pulse border border-pink-50" />
                                    <div className="w-full aspect-[3/4.5] rounded-[4.5rem] bg-zinc-100 animate-pulse border border-pink-50 opacity-50" />
                                </>
                            ) : (
                                trending.map((creator, i) => (
                                    <TrendingAltarItem key={creator.id} creator={creator} rank={i + 1} onBoost={handleBoost} />
                                ))
                            )}
                        </div>
                    </aside>

                </div>
            </div>

            {/* Mobile Bottom Navigation (Professional HUD) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                <div className="glass-card bg-white/70 backdrop-blur-3xl border-pink-100/50 rounded-[2.5rem] p-2 flex justify-around shadow-2xl shadow-pink-100/30">
                    <Link to="/timeline" onClick={() => setActiveTab("all")} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTab !== "reels" ? "bg-zinc-900 text-white shadow-xl shadow-zinc-400" : "text-zinc-400 hover:text-pink-500 hover:bg-pink-50"}`}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    </Link>
                    <Link to="/messages" className="w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </Link>
                    <Link to="/notifications" className="w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    </Link>
                    <Link to="/dashboard" className="w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                    </Link>
                    <Link to="/profile" className="w-14 h-14 rounded-2xl flex items-center justify-center group transition-all">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-full h-full rounded-[10px] object-cover" alt="" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
