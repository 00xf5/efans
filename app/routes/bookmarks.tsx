import { useState, useRef, memo } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/bookmarks";

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

export default function Bookmarks() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="relative w-full h-full bg-[var(--color-bg-app)] text-[var(--color-text-main)] flex justify-center selection:bg-pink-100 overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100/30 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-50/40 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-4 md:px-6 relative z-10 h-full">
                <div className="flex w-full max-w-[1700px] gap-8 h-full">

                    {/* Column 1: Navigation Sidebar */}
                    <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
                        <nav className="space-y-1">
                            <Link to="/timeline" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all font-bold">
                                <span className="text-xl">✨</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                            </Link>
                            <Link to="/messages" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all font-bold">
                                <span className="text-xl">💌</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                            </Link>
                            <Link to="/notifications" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 hover:text-pink-600 transition-all group font-bold">
                                <span className="text-xl">🔔</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                            </Link>
                            <Link to="/bookmarks" className="flex items-center justify-between px-5 py-3 bg-pink-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-pink-200">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl">💎</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Treasure</span>
                                </div>
                            </Link>
                        </nav>

                        <div className="mt-auto p-5 glass-card rounded-[2rem] border-pink-100 flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center font-black text-sm text-white">U2</div>
                        </div>
                    </aside>

                    {/* Column 2: Treasure Interface */}
                    <main className="flex-grow max-w-2xl py-8 h-full flex flex-col min-w-0">
                        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-8 px-2 pb-20 scroll-smooth">

                            {/* Sticky Treasure Header */}
                            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-3xl py-4 border-b border-pink-50 flex items-center justify-between gap-4 -mx-2 px-4 shadow-sm rounded-t-[3rem]">
                                <h1 className="text-2xl text-premium italic text-pink-900">Your <span className="text-gradient">Treasure.</span></h1>
                                <div className="flex gap-2 p-1 bg-pink-50 rounded-full border border-pink-100">
                                    {["all", "visions", "whispers"].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveTab(f)}
                                            className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === f ? 'bg-pink-500 text-white shadow-md shadow-pink-200' : 'text-pink-300 hover:text-pink-600'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Treasure Gallery */}
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {MOCK_TREASURE.map((item) => (
                                    <div
                                        key={item.id}
                                        className="glass-card rounded-[2.5rem] overflow-hidden group/treasure cursor-pointer border-pink-50 hover:card-glow-primary transition-all duration-700 shadow-xl shadow-pink-100/30"
                                    >
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={item.image}
                                                className="absolute inset-0 w-full h-full object-cover group-hover/treasure:scale-110 transition-transform duration-[3s] animated-sensual"
                                                alt=""
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-60 group-hover/treasure:opacity-80 transition-opacity"></div>

                                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                                <span className="text-[8px] font-black text-pink-200 uppercase tracking-[0.3em] mb-1">{item.type}</span>
                                                <h3 className="text-lg text-premium italic text-white truncate">{item.creator}</h3>
                                                <p className="text-[8px] font-bold text-pink-100/60 uppercase tracking-widest mt-2">{item.savedAt}</p>
                                            </div>

                                            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-pink-500 hover:border-pink-500 transition-all hover:scale-110">
                                                💎
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Archive Empty State Hint */}
                            <div className="mt-12 p-12 text-center space-y-4 border-2 border-dashed border-pink-100 rounded-[3.5rem]">
                                <div className="text-3xl grayscale mb-2 opacity-30">📦</div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-300">The vaults are vast</h3>
                                <p className="text-zinc-400 text-[11px] max-w-[200px] mx-auto italic">Only your most adored memories are kept in this sanctuary.</p>
                            </div>

                        </div>
                    </main>

                    {/* Column 3: Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-pink-50/20 px-4 border-x border-pink-50">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">Active Desires</h4>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32 relative" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {MOCK_REELS.map((reel) => (
                                <div key={reel.id} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-pink-100 group/reel cursor-pointer shadow-xl transition-all duration-500 hover:scale-[1.02]">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-pink-900/20"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-pink-900/80 to-transparent">
                                        <h5 className="text-[11px] font-black uppercase text-white italic tracking-widest">{reel.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Column 4: Presence Rail */}
                    <aside className="hidden 2xl:flex flex-col w-20 py-8 h-full items-center space-y-8 overflow-hidden border-l border-pink-50 bg-pink-50/10">
                        <div className="flex flex-col gap-4">
                            {ONLINE_PRESENCE.map((avatar, i) => (
                                <img key={i} src={avatar} loading="lazy" className="w-10 h-10 rounded-full border border-pink-100 opacity-70" alt="" />
                            ))}
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
