import { useState, useMemo } from "react";
import { Link } from "react-router";

// --- Sovereign Design Language: Discovery Altar Data ---

const DISCOVERY_CATEGORIES = [
    "All Resonance",
    "Sovereign Souls",
    "Visual Visions",
    "Intimate Whispers",
    "Atmospheric Echoes",
    "Cultural Altars"
];

const DISCOVERY_CREATORS = [
    {
        id: "v1",
        name: "Valentina Noir",
        tag: "@valen_noir",
        category: "Visual Visions",
        resonance: 98,
        transmission_rate: "4.2/day",
        payout_velocity: "₦12.5M",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        bio: "Shadow performance art and the physicality of moonlight.",
        badges: ["Apex", "Trending"]
    },
    {
        id: "v2",
        name: "Julian Voss",
        tag: "@voss_milan",
        category: "Cultural Altars",
        resonance: 94,
        transmission_rate: "1.8/day",
        payout_velocity: "₦8.2M",
        status: "Away",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
        bio: "Private Milanese art exhibitions and the architecture of intimacy.",
        badges: ["Elite", "Verified"]
    },
    {
        id: "v3",
        name: "Sofia Sterling",
        tag: "@sofia_s",
        category: "Intimate Whispers",
        resonance: 89,
        transmission_rate: "12.5/day",
        payout_velocity: "₦2.4M",
        status: "Online",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
        bio: "The space between notes. Finding luxury in the silence of the city.",
        badges: ["Rising"]
    },
    {
        id: "v4",
        name: "Adrien Thorne",
        tag: "@thorne_apex",
        category: "Sovereign Souls",
        resonance: 96,
        transmission_rate: "2.1/day",
        payout_velocity: "₦18.4M",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=400",
        bio: "Peak human physicality. Calibrating the elite experience.",
        badges: ["Grandmaster"]
    },
    {
        id: "v5",
        name: "Sienna Ray",
        tag: "@sienna_velvet",
        category: "Visual Visions",
        resonance: 91,
        transmission_rate: "0.8/day",
        payout_velocity: "₦5.6M",
        status: "Away",
        avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
        bio: "Capturing the velvet hour. Where light meets the soul.",
        badges: ["Aesthetic"]
    },
    {
        id: "v6",
        name: "Elena Mour",
        tag: "@mour_essence",
        category: "Atmospheric Echoes",
        resonance: 87,
        transmission_rate: "5.4/day",
        payout_velocity: "₦1.8M",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=400",
        bio: "Industrial ambient melodies and the resonance of forgotten spaces.",
        badges: ["Sonics"]
    }
];

export default function DiscoveryAltar() {
    const [activeTab, setActiveTab] = useState("All Resonance");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Simulate High-Fidelity Data Loading Protocol
    const filteredCreators = useMemo(() => {
        return DISCOVERY_CREATORS.filter(c => {
            const matchesTab = activeTab === "All Resonance" || c.category === activeTab;
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tag.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 800);
    };

    return (
        <div className="fixed inset-0 top-16 bg-[#FAFAFA] text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden font-display w-full">
            {/* Ambient Background Resonance */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-pink-100/40 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-100/30 rounded-full blur-[160px] animate-pulse"></div>
            </div>

            <div className="w-full md:max-w-[1800px] h-full flex flex-col relative z-10 px-4 md:px-6 py-10 gap-10 overflow-x-hidden">

                {/* 1. Header: The Global Altar Sequence */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-8 animate-entrance">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-zinc-100 rounded-full shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Scan In Progress • 24,042 Souls Active</span>
                        </div>
                        <h1 className="text-7xl font-black italic text-zinc-900 leading-none tracking-tighter">
                            Discovery <span className="text-gradient">Altar.</span>
                        </h1>
                        <p className="text-zinc-400 font-bold italic text-lg leading-relaxed max-w-xl">
                            The global frequency for sovereign creators. Calibrate your network and find your resonance.
                        </p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <div className="absolute inset-0 bg-pink-100/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative bg-white border border-zinc-100 rounded-[2.5rem] p-2 shadow-sm flex items-center gap-4 focus-within:border-pink-200 transition-all">
                            <div className="w-12 h-12 flex items-center justify-center text-zinc-300">
                                {isSearching ? (
                                    <div className="w-5 h-5 border-2 border-zinc-200 border-t-pink-500 rounded-full animate-spin"></div>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                )}
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search Resonance..."
                                className="flex-grow bg-transparent border-none outline-none py-4 text-[13px] font-bold italic text-zinc-900 placeholder:text-zinc-300"
                            />
                        </div>
                    </div>
                </header>

                {/* 2. Calibration Tiers (Filter Bar) */}
                <nav className="flex gap-4 p-1.5 bg-zinc-100/50 rounded-[2.5rem] border border-zinc-100 w-fit animate-entrance [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                    {DISCOVERY_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-8 py-3 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === cat ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'text-zinc-400 hover:text-zinc-900 hover:bg-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                {/* 3. The High-Density Altar Grid */}
                <main className="flex-grow overflow-y-auto scrollbar-hide pb-32 animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCreators.map((creator) => (
                            <Link
                                key={creator.id}
                                to={`/creator/${creator.tag.replace('@', '')}`}
                                className="group relative bg-white border border-zinc-100 rounded-[4rem] p-10 shadow-sm hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-2 transition-all duration-700 overflow-hidden flex flex-col gap-10"
                            >
                                {/* Shodan-Style Data Markers Overlay */}
                                <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                                    <div className="px-3 py-1 bg-zinc-950 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                        R: {creator.resonance}%
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-zinc-100 text-zinc-400 rounded-full text-[8px] font-black uppercase tracking-widest">
                                        P_VEL: {creator.payout_velocity}
                                    </div>
                                </div>

                                {/* Avatar & Core Identity */}
                                <div className="flex items-center gap-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-[2.5rem] border-8 border-zinc-50 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                            <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} />
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${creator.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black italic text-zinc-900 tracking-tighter leading-none group-hover:text-pink-500 transition-colors">{creator.name}</h3>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{creator.tag}</p>
                                        <div className="flex gap-2 pt-2">
                                            {creator.badges.map(b => (
                                                <span key={b} className="text-[8px] font-black uppercase tracking-widest text-pink-400 border border-pink-100 px-2 py-0.5 rounded-full">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Fragment (Bio) */}
                                <div className="bg-zinc-50/50 p-6 rounded-[2.5rem] border border-zinc-100 h-28 flex items-center">
                                    <p className="text-[12px] font-bold italic text-zinc-500 leading-relaxed">
                                        "{creator.bio}"
                                    </p>
                                </div>

                                {/* Transactional Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Transmission</p>
                                        <p className="text-[11px] font-bold text-zinc-900">{creator.transmission_rate}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Resonance Class</p>
                                        <p className="text-[11px] font-bold text-pink-500 uppercase tracking-widest leading-none">{creator.category.split(' ')[0]}</p>
                                    </div>
                                </div>

                                {/* Cinematic CTA */}
                                <div className="pt-2">
                                    <div className="w-full py-5 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center shadow-xl shadow-zinc-200 group-hover:bg-pink-500 transition-all">
                                        Establish Connection
                                    </div>
                                </div>

                                {/* Aesthetic Light Leak Overlay */}
                                <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-pink-100/20 blur-[100px] rounded-full group-hover:animate-pulse"></div>
                            </Link>
                        ))}
                    </div>
                </main>

            </div>
        </div>
    );
}
