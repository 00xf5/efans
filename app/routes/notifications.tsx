import { useState, useRef, memo } from "react";
import { Link, useNavigate } from "react-router";

const MOCK_ECHOES = [
    {
        id: "e1",
        type: "PULSE",
        user: {
            name: "Valentina Noir",
            avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200",
        },
        content: "adored your latest response",
        time: "5m ago",
        unread: true,
        link: "/creator/v_noir"
    },
    {
        id: "e2",
        type: "VISION",
        user: {
            name: "Sienna Ray",
            avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200",
        },
        content: "revealed a new Midnight Glimpse",
        time: "1h ago",
        unread: true,
        link: "/timeline"
    },
    {
        id: "e3",
        type: "WHISPER",
        user: {
            name: "Elena Mour",
            avatar: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=200",
        },
        content: "sent you a private whisper",
        time: "2h ago",
        unread: false,
        link: "/messages"
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

export default function Notifications() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [echoes, setEchoes] = useState(MOCK_ECHOES);
    const navigate = useNavigate();

    const handleEchoClick = (id: string, link: string) => {
        setEchoes(prev => prev.map(e => e.id === id ? { ...e, unread: false } : e));
        navigate(link);
    };

    return (
        <div className="relative w-full h-full bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden font-display">
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-900/40 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-4 md:px-6 relative z-10 h-full">
                <div className="flex w-full max-w-[1700px] gap-8 h-full">

                    {/* Navigation Sidebar */}
                    <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
                        <nav className="space-y-1">
                            <Link to="/timeline" className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-zinc-100 transition-all font-bold">
                                <span className="text-xl">✨</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                            </Link>
                            <Link to="/messages" className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-900/50 rounded-2xl text-zinc-500 hover:text-zinc-100 transition-all font-bold">
                                <span className="text-xl">💌</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                            </Link>
                            <Link to="/notifications" className="flex items-center justify-between px-5 py-3 bg-white text-black rounded-2xl font-bold transition-all shadow-none">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl">🔔</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                                </div>
                            </Link>
                        </nav>

                        <div className="mt-auto p-5 bg-zinc-900/40 rounded-[2rem] border border-zinc-800 flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-sm text-black shadow-lg shadow-white/5">U2</div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase text-white leading-none">Account</p>
                                <p className="text-[10px] text-zinc-500 font-bold italic">Authenticated</p>
                            </div>
                        </div>
                    </aside>

                    {/* Echoes Interface */}
                    <main className="flex-grow max-w-2xl py-8 h-full flex flex-col min-w-0">
                        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-8 px-2 pb-20">

                            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-3xl py-4 border-b border-zinc-800 flex items-center justify-between gap-4 -mx-2 px-4 shadow-none rounded-t-[3rem]">
                                <h1 className="text-2xl text-premium italic text-white leading-none">Recent <span className="text-gradient">Echoes.</span></h1>
                            </div>

                            <div className="space-y-4 pt-4">
                                {echoes.map((echo) => (
                                    <button
                                        key={echo.id}
                                        onClick={() => handleEchoClick(echo.id, echo.link)}
                                        className={`w-full text-left glass-card p-6 rounded-[2.5rem] border border-zinc-800 flex items-center gap-6 transition-all duration-500 shadow-none ${echo.unread ? 'bg-white text-black border-white' : 'bg-zinc-900/40 hover:bg-zinc-900/60'}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img src={echo.user.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zinc-800 shadow-xl" alt="" />
                                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-[10px] ${echo.unread ? 'bg-black text-white' : 'bg-primary text-white'}`}>
                                                {echo.type === 'PULSE' ? '❤️' : echo.type === 'VISION' ? '✨' : '💌'}
                                            </div>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`text-[10px] font-black uppercase tracking-widest italic ${echo.unread ? 'text-black' : 'text-white'}`}>{echo.user.name}</h3>
                                                    <p className={`text-sm mt-1 font-medium truncate ${echo.unread ? 'text-black/70' : 'text-zinc-500'}`}>{echo.content}</p>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${echo.unread ? 'text-black/40' : 'text-zinc-700'}`}>{echo.time}</span>
                                            </div>
                                            {echo.unread && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                                                    <span className="text-[8px] font-black text-black uppercase tracking-widest leading-none">New Interaction</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={`text-xl font-light ${echo.unread ? 'text-black/20' : 'text-zinc-800'}`}>→</div>
                                    </button>
                                ))}
                            </div>

                        </div>
                    </main>

                    {/* Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-zinc-900/10 px-4 border-x border-zinc-900">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Active Desires</h4>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {MOCK_REELS.map((reel) => (
                                <div key={reel.id} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-zinc-800 group/reel cursor-pointer transition-all hover:scale-[1.02] shadow-2xl shadow-black/50">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
