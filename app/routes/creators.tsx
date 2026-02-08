import { useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import { db } from "../db/index.server";
import { profiles } from "../db/schema";
import { eq, ne, and } from "drizzle-orm";
import { Sidebar } from "../components/Sidebar";
import { SAMPLE_CREATORS } from "../utils/sample-data";

interface DiscoveryCreator {
    id: string;
    name: string;
    tag: string;
    category: string;
    resonance: number;
    transmission_rate: string;
    payout_velocity: string;
    status: string;
    avatar: string;
    bio: string;
    badges: string[];
}

import { getUserId } from "../utils/session.server";

export async function loader({ request }: { request: Request }) {
    const userId = await getUserId(request);

    const [creatorsRaw, currentUserProfile] = await Promise.all([
        db.query.profiles.findMany({
            where: userId
                ? and(eq(profiles.persona, 'creator'), ne(profiles.id, userId))
                : eq(profiles.persona, 'creator'),
            limit: 50
        }),
        userId ? db.query.profiles.findFirst({ where: eq(profiles.id, userId) }) : Promise.resolve(null)
    ]);

    return { creatorsRaw, userId, currentUserProfile };
}

// --- Sovereign Design Language: Discovery Altar Data ---

const DISCOVERY_CATEGORIES = [
    "All Resonance",
    "Sovereign Souls",
    "Visual Visions",
    "Intimate Whispers",
    "Atmospheric Echoes",
    "Cultural Altars"
];

const MOCK_DISCOVERY_CREATORS: DiscoveryCreator[] = SAMPLE_CREATORS.map(c => ({
    id: c.id,
    name: c.name,
    tag: `@${c.tag}`,
    category: "Visual Visions",
    resonance: parseFloat(c.resonanceScore),
    transmission_rate: "4.2/day",
    payout_velocity: `₦${(parseFloat(c.balance) / 1000000).toFixed(1)}M`,
    status: "Online",
    avatar: c.avatarUrl,
    bio: c.bio,
    badges: ["Apex", "Trending"]
}));

export default function DiscoveryAltar() {
    const { creatorsRaw, userId, currentUserProfile } = useLoaderData<typeof loader>();
    const [activeTab, setActiveTab] = useState("All Resonance");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Merge DB creators with mock data for aesthetic variety during dev
    const allCreators = useMemo(() => {
        const mappedDb: DiscoveryCreator[] = (creatorsRaw as any[]).map((c: { id: string; name: string | null; tag: string | null; resonanceScore: any; balance: any; avatarUrl: string | null; bio: string | null }) => ({
            id: c.id,
            name: c.name || "Anonymous Soul",
            tag: `@${c.tag || 'essence'}`,
            category: "Sovereign Souls",
            resonance: parseFloat(c.resonanceScore?.toString() || "50"),
            transmission_rate: "New Resonance",
            payout_velocity: `₦${parseFloat(c.balance?.toString() || "0").toLocaleString()}`,
            status: "Online",
            avatar: c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.tag}`,
            bio: c.bio || "No description of their digital sanctuary yet.",
            badges: ["New Member"]
        }));

        const combined = [...mappedDb, ...MOCK_DISCOVERY_CREATORS];
        return userId ? combined.filter(c => c.id !== userId) : combined;
    }, [creatorsRaw, userId]);

    const filteredCreators = useMemo(() => {
        return allCreators.filter((c: DiscoveryCreator) => {
            const matchesTab = activeTab === "All Resonance" || c.category === activeTab;
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tag.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery, allCreators]);

    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 800);
    };

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 font-display transition-colors duration-500 overflow-hidden">
            {/* Ambient Background Resonance */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-zinc-900/40 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-zinc-800/30 rounded-full blur-[160px]"></div>
            </div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full">

                    {/* Column 1: Navigation Sidebar */}
                    <Sidebar activeTab="creators" userName={currentUserProfile?.name || "Fan"} userTag={currentUserProfile?.tag || "user"} />

                    {/* Column 2: Independent Center Feed */}
                    <main className="flex-grow w-full py-8 h-full overflow-y-auto scrollbar-hide space-y-12 px-4 scroll-smooth pb-32">
                        {/* 1. Header: The Global Altar Sequence */}
                        <header className="flex flex-col md:flex-row items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Scan In Progress • {24042 + allCreators.length} Souls Active</span>
                                </div>
                                <h1 className="text-4xl md:text-7xl font-black italic text-white leading-none tracking-tighter">
                                    Discovery <span className="text-gradient">Altar.</span>
                                </h1>
                                <p className="text-zinc-500 font-bold italic text-lg leading-relaxed max-w-xl">
                                    The global frequency for sovereign creators. Calibrate your network and find your resonance.
                                </p>
                            </div>

                            <div className="w-full md:w-96 relative group">
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-2 shadow-sm flex items-center gap-4 focus-within:border-zinc-700 transition-all">
                                    <div className="w-12 h-12 flex items-center justify-center text-zinc-600">
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-zinc-700 border-t-primary rounded-full animate-spin"></div>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                        )}
                                    </div>
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search Resonance..."
                                        className="flex-grow bg-transparent border-none outline-none py-4 text-[13px] font-bold italic text-white placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>
                        </header>

                        {/* 2. Calibration Tiers (Filter Bar) */}
                        <nav className="flex gap-4 p-1.5 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 w-full overflow-x-auto scrollbar-hide">
                            {DISCOVERY_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-8 py-3 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === cat ? 'bg-white text-black shadow-xl shadow-zinc-200' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>

                        {/* 3. The High-Density Altar Grid */}
                        <div className="flex-grow pb-32">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCreators.map((creator: DiscoveryCreator) => (
                                    <Link
                                        key={creator.id}
                                        to={`/creator/${creator.tag.replace('@', '')}`}
                                        className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[4rem] p-10 shadow-none hover:bg-zinc-900 hover:-translate-y-2 transition-all duration-700 overflow-hidden flex flex-col gap-10"
                                    >
                                        {/* Data Markers Overlay */}
                                        <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                                            <div className="px-3 py-1 bg-white text-black rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                                R: {creator.resonance}%
                                            </div>
                                            <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                P_VEL: {creator.payout_velocity}
                                            </div>
                                        </div>

                                        {/* Avatar & Core Identity */}
                                        <div className="flex items-center gap-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-[2.5rem] border-8 border-zinc-950 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                                    <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} />
                                                </div>
                                                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-zinc-950 ${creator.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black italic text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{creator.name}</h3>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{creator.tag}</p>
                                                <div className="flex gap-2 pt-2">
                                                    {creator.badges.map((b: string) => (
                                                        <span key={b} className="text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">{b}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Fragment (Bio) */}
                                        <div className="bg-zinc-950/50 p-6 rounded-[2.5rem] border border-zinc-800 h-28 flex items-center">
                                            <p className="text-[12px] font-bold italic text-zinc-400 leading-relaxed">
                                                "{creator.bio}"
                                            </p>
                                        </div>

                                        {/* Transactional Metadata Grid */}
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Transmission</p>
                                                <p className="text-[11px] font-bold text-white">{creator.transmission_rate}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Resonance Class</p>
                                                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{creator.category.split(' ')[0]}</p>
                                            </div>
                                        </div>

                                        {/* Cinematic CTA */}
                                        <div className="pt-2">
                                            <div className="w-full py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center shadow-none group-hover:bg-primary group-hover:text-white transition-all">
                                                Establish Connection
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
