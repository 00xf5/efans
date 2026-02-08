import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLoaderData, useFetcher } from "react-router";
import { db } from "../db/index.server";
import { echoes, profiles } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "../utils/session.server";
import { formatTimeAgo } from "../utils/date";
import { Sidebar } from "../components/Sidebar";


interface DbEcho {
    id: string;
    recipientId: string;
    senderId: string | null;
    type: string;
    content: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
}

export async function loader({ request }: { request: Request }) {
    try {
        const userId = await requireUserId(request);

        const dbEchoes = await db.query.echoes.findMany({
            where: eq(echoes.recipientId, userId),
            orderBy: [desc(echoes.createdAt)],
            limit: 50
        });

        const enrichedEchoes = await Promise.all(dbEchoes.map(async (echo: DbEcho) => {
            let senderProfile = null;
            if (echo.senderId) {
                senderProfile = await db.query.profiles.findFirst({
                    where: eq(profiles.id, echo.senderId)
                });
            }

            return {
                id: echo.id,
                type: echo.type.toUpperCase(),
                user: {
                    name: senderProfile?.name || "System",
                    avatar: senderProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderProfile?.tag || 'system'}`,
                },
                content: echo.content || "Interaction received",
                time: formatTimeAgo(new Date(echo.createdAt)),
                unread: !echo.isRead,
                link: echo.link || "#"
            };
        }));

        const currentUserProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, userId)
        });

        return { echoes: enrichedEchoes, currentUserProfile };
    } catch (error: any) {
        if (error instanceof Response) throw error;
        console.error("Notifications Loader Failure:", error);
        throw new Response(`Echo Calibration Failed: ${error?.message || error}`, { status: 500 });
    }
}

export async function action({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "mark_read") {
        const id = formData.get("id") as string;
        await db.update(echoes)
            .set({ isRead: true })
            .where(and(eq(echoes.id, id), eq(echoes.recipientId, userId)));
        return { success: true };
    }

    if (intent === "mark_all_read") {
        await db.update(echoes)
            .set({ isRead: true })
            .where(eq(echoes.recipientId, userId));
        return { success: true };
    }

    return { success: false };
}


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
    const { echoes: initialEchoes, currentUserProfile } = useLoaderData<typeof loader>();
    const [echoesList, setEchoesList] = useState(initialEchoes);
    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        setEchoesList(initialEchoes);
    }, [initialEchoes]);

    const handleEchoClick = (id: string, link: string) => {
        const formData = new FormData();
        formData.append("intent", "mark_read");
        formData.append("id", id);
        fetcher.submit(formData, { method: "POST" });

        // Optimistic UI update
        setEchoesList(prev => prev.map(e => e.id === id ? { ...e, unread: false } : e));
        navigate(link);
    };

    const markAllRead = () => {
        const formData = new FormData();
        formData.append("intent", "mark_all_read");
        fetcher.submit(formData, { method: "POST" });
        setEchoesList(prev => prev.map(e => ({ ...e, unread: false })));
    };

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden font-display transition-colors duration-500">
            {/* Global Context Indicator */}
            <div className="fixed top-20 left-6 z-[60] animate-in fade-in slide-in-from-left-4 duration-1000 md:block hidden">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Echo Chamber</h2>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-900/40 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full">
                    {/* Column 1: Navigation Sidebar */}
                    <Sidebar activeTab="notifications" userName={currentUserProfile?.name || "Fan"} userTag={currentUserProfile?.tag || "user"} />

                    {/* Echoes Interface */}
                    <main className="flex-grow max-w-2xl py-8 flex flex-col min-w-0">
                        <div className="space-y-8 px-2 pb-20">

                            <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-3xl py-6 border-b border-zinc-800 flex items-center justify-between gap-4 -mx-2 px-6 shadow-2xl rounded-t-[3rem]">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl font-black italic text-white tracking-tighter leading-none">Recent <span className="text-gradient">Echoes.</span></h1>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Realtime</span>
                                    </div>
                                </div>
                                {echoesList.some(e => e.unread) && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Mute All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 pt-4">
                                {echoesList.length > 0 ? echoesList.map((echo: { id: string; type: string; user: { name: string; avatar: string }; content: string; time: string; unread: boolean; link: string }) => (
                                    <button
                                        key={echo.id}
                                        onClick={() => handleEchoClick(echo.id, echo.link)}
                                        className={`w-full text-left glass-card p-6 rounded-[2.5rem] border transition-all duration-500 shadow-none flex items-center gap-6 ${echo.unread ? 'bg-white text-black border-white' : 'bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img src={echo.user.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zinc-800 shadow-xl" alt="" />
                                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-[10px] ${echo.unread ? 'bg-black text-white' : 'bg-white text-black border border-zinc-200'}`}>
                                                {echo.type === 'PULSE' ? '❤️' : echo.type === 'VISION' ? '✨' : echo.type === 'WHISPER' ? '💌' : '💠'}
                                            </div>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`text-[10px] font-black uppercase tracking-widest italic ${echo.unread ? 'text-black' : 'text-zinc-100'}`}>{echo.user.name}</h3>
                                                    <p className={`text-sm mt-1 font-bold truncate ${echo.unread ? 'text-black/80' : 'text-zinc-400'}`}>{echo.content}</p>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${echo.unread ? 'text-black/40' : 'text-zinc-600'}`}>{echo.time}</span>
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
                                )) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-zinc-700 gap-4">
                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">No Echoes in the Void</p>
                                    </div>
                                )}
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
