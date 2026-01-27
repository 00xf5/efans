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
        <div className="fixed inset-0 top-16 bg-white text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100/30 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-50/40 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-4 md:px-6 relative z-10 h-full">
                <div className="flex w-full max-w-[1700px] gap-8 h-full">

                    {/* Navigation Sidebar */}
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
                            <Link to="/notifications" className="flex items-center justify-between px-5 py-3 bg-pink-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-pink-200">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl">🔔</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                                </div>
                            </Link>
                        </nav>

                        <div className="mt-auto p-5 glass-card rounded-[2rem] border-pink-100 flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center font-black text-sm text-white">U2</div>
                        </div>
                    </aside>

                    {/* Echoes Interface */}
                    <main className="flex-grow max-w-2xl py-8 h-full flex flex-col min-w-0">
                        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-8 px-2 pb-20">

                            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-3xl py-4 border-b border-pink-50 flex items-center justify-between gap-4 -mx-2 px-4 shadow-sm rounded-t-[3rem]">
                                <h1 className="text-2xl text-premium italic text-pink-900">Recent <span className="text-gradient">Echoes.</span></h1>
                            </div>

                            <div className="space-y-4 pt-4">
                                {echoes.map((echo) => (
                                    <button
                                        key={echo.id}
                                        onClick={() => handleEchoClick(echo.id, echo.link)}
                                        className={`w-full text-left glass-card p-6 rounded-[2.5rem] border-pink-50 flex items-center gap-6 transition-all duration-500 ${echo.unread ? 'bg-pink-50/40 border-pink-200 ring-1 ring-pink-100' : 'hover:bg-pink-50/30'}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img src={echo.user.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-50" alt="" />
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-500 text-white shadow-lg flex items-center justify-center text-[10px]">
                                                {echo.type === 'PULSE' ? '❤️' : echo.type === 'VISION' ? '✨' : '💌'}
                                            </div>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-900 italic">{echo.user.name}</h3>
                                                    <p className="text-sm text-zinc-600 mt-1 font-medium truncate">{echo.content}</p>
                                                </div>
                                                <span className="text-[9px] font-black text-pink-300 uppercase tracking-widest flex-shrink-0">{echo.time}</span>
                                            </div>
                                            {echo.unread && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                                                    <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">New Interaction</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-pink-200 text-xl font-light">→</div>
                                    </button>
                                ))}
                            </div>

                        </div>
                    </main>

                    {/* Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-pink-50/20 px-4 border-x border-pink-50">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">Active Desires</h4>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {MOCK_REELS.map((reel) => (
                                <div key={reel.id} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-pink-100 group/reel cursor-pointer transition-all hover:scale-[1.02]">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
