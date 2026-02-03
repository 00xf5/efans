import type { Post, TrendingCreator } from "../types/timeline";

export const MOCK_MOMENTS: Post[] = [
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

export const FEATURED_CREATORS = [
    { name: "Valentina Noir", handle: "@v_noir", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", tag: "Midnight Art", color: "from-pink-400/50" },
    { name: "Adrien Thorne", handle: "@adrien", img: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=800", tag: "Raw Power", color: "from-rose-400/50" },
    { name: "Sienna Ray", handle: "@siennaray", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800", tag: "Velvet Hour", color: "from-pink-500/50" },
    { name: "Lucas Vance", handle: "@lvance", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800", tag: "Urban Intimacy", color: "from-rose-500/50" },
    { name: "Elena Mour", handle: "@elenamour", img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800", tag: "Golden Hour", color: "from-pink-300/50" },
];

export const MOCK_REELS = [
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

export const INITIAL_FLOW_POSTS: Post[] = [
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

export const INITIAL_TRENDING: TrendingCreator[] = [
    { id: "t1", name: "Valentina Noir", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", heat: 98.4, status: "Peak", velocity: 1.2 },
    { id: "t2", name: "Thorne Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", heat: 94.2, status: "Rising", velocity: 0.8 },
    { id: "t3", name: "Sienna Ray", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800", heat: 88.7, status: "Hot", velocity: -0.2 },
    { id: "t4", name: "Lucas Vance", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800", heat: 82.1, status: "Stable", velocity: -1.5 },
    { id: "t5", name: "Evelyn Ross", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800", heat: 77.5, status: "Rising", velocity: 0.4 },
    { id: "t6", name: "Alex Rivers", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", heat: 74.8, status: "Rising", velocity: 0.1 },
    { id: "t7", name: "Kaya Light", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800", heat: 71.2, status: "Steady", velocity: -0.5 },
    { id: "t8", name: "Mour Noir", avatar: "https://images.unsplash.com/photo-1494790108377-be9cf29b2933?auto=format&fit=crop&q=80&w=800", heat: 68.4, status: "Rising", velocity: 0.2 }
];
