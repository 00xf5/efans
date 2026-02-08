import { useState, useRef, memo } from "react";
import { Sidebar } from "../components/Sidebar";
import { MediaModal } from "../components/timeline/MediaModal";
import { Link, useLoaderData } from "react-router";
import { db } from "../db/index.server";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "../utils/session.server";

export async function loader({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const currentUserProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
    });
    return { currentUserProfile };
}

const MOCK_TREASURE = [
    {
        id: "t1",
        creator: "Valentina Noir",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        type: "Vision",
        savedAt: "Saved 2 days ago"
    },
    {
        id: "t2",
        creator: "Adrien Thorne",
        image: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=800",
        type: "Glimpse",
        savedAt: "Saved 5 days ago"
    },
    {
        id: "t3",
        creator: "Sienna Ray",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800",
        type: "Private Flow",
        savedAt: "Saved 1 week ago"
    },
    {
        id: "t4",
        creator: "Lucas Vance",
        image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800",
        type: "Vision",
        savedAt: "Saved 2 weeks ago"
    },
    {
        id: "t5",
        creator: "Elena Mour",
        image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
        type: "Exclusive",
        savedAt: "Saved 3 weeks ago"
    }
];

const MOCK_REELS = [
    {
        id: "r1",
        name: "Valentina Noir",
        video: "https://player.vimeo.com/external/434045526.sd.mp4?s=c355bcc5866ef11d13f982aefca88d6c702ccb79&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        color: "from-pink-500/40"
    },
    {
        id: "r2",
        name: "Luna Star",
        video: "https://player.vimeo.com/external/459389137.sd.mp4?s=87ae19dc810ea2a0a1f9e2b02713f01b7a2d677d&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
        color: "from-rose-500/40"
    }
];

const ONLINE_PRESENCE = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
];

export default function Treasure() {
    const { currentUserProfile } = useLoaderData<typeof loader>();
    const [activeTab, setActiveTab] = useState("all");
    const [expandedMedia, setExpandedMedia] = useState<{ url: string, type: 'video' | 'image' | 'any', name?: string } | null>(null);

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden transition-colors duration-500 font-display">
            {expandedMedia && <MediaModal media={expandedMedia} onClose={() => setExpandedMedia(null)} />}

            {/* Dynamic Background Light */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-zinc-900/40 via-transparent to-transparent pointer-events-none -z-10 transition-colors duration-1000"></div>
            <div className="fixed top-24 left-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-24 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full">

                    {/* Column 1: Navigation Sidebar */}
                    <Sidebar activeTab="treasure" userName={currentUserProfile?.name || "Fan"} userTag={currentUserProfile?.tag || "user"} />


                    {/* Column 2: Independent Center Feed */}
                    <main className="flex-grow w-full max-w-full md:max-w-2xl py-8 h-full overflow-y-auto overflow-x-hidden scrollbar-hide space-y-12 px-4 scroll-smooth pb-32 lg:pb-8">

                        {/* Treasure Header */}
                        <div className="space-y-6">
                            <h1 className="text-5xl font-black italic text-white leading-tight">Your <span className="text-gradient">Treasure.</span></h1>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic">The vault of established resonances</p>
                        </div>

                        <div className="flex gap-4 border-b border-zinc-900 pb-4 overflow-x-auto scrollbar-hide">
                            {["all", "visions", "whispers"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? "bg-white text-black shadow-xl" : "text-zinc-600 hover:text-zinc-300"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Treasure Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {MOCK_TREASURE.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-[3rem] overflow-hidden group/item border-zinc-800 bg-zinc-900 transition-all duration-700 shadow-none"
                                >
                                    <div className="relative aspect-[3/4] cursor-pointer" onClick={() => setExpandedMedia({ url: item.image, type: 'image', name: item.creator })}>
                                        <img
                                            src={item.image}
                                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-[2s]"
                                            alt=""
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover/item:translate-y-0 transition-transform duration-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                <span className="text-[8px] font-black text-primary uppercase tracking-widest">{item.type}</span>
                                            </div>
                                            <h3 className="text-2xl text-premium italic text-white truncate">{item.creator}</h3>
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000">{item.savedAt}</p>
                                        </div>

                                        <button className="absolute top-6 right-6 w-12 h-12 glass border-zinc-800 rounded-3xl flex items-center justify-center text-white scale-90 group-hover/item:scale-110 transition-all duration-500 hover:bg-white hover:text-black">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Achievement State */}
                        <div className="p-16 text-center space-y-8 border-2 border-dashed border-zinc-900 rounded-[4rem] group hover:border-zinc-800 transition-colors">
                            <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-700">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-700 group-hover:text-primary transition-colors"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Vault Integrity Secured</h3>
                                <p className="text-zinc-600 text-[11px] max-w-[240px] mx-auto italic leading-relaxed">Your most adored memories are cached at the edge of the sanctuary.</p>
                            </div>
                        </div>

                    </main>

                    {/* Column 3: Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full bg-black border-x border-zinc-900 transition-colors overflow-hidden px-4 space-y-8">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Active Desires</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32 relative" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {MOCK_REELS.map((reel) => (
                                <div key={reel.id} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-zinc-800 group/reel cursor-pointer shadow-none transition-all duration-500 hover:scale-[1.02]">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 to-transparent">
                                        <h5 className="text-[11px] font-black uppercase text-white italic tracking-widest">{reel.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
