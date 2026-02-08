import { Link } from "react-router";

interface SidebarProps {
    activeTab?: string;
    userName?: string;
    userTag?: string;
}

export function Sidebar({ activeTab, userName = "Premium Fan", userTag = "fan_02" }: SidebarProps) {
    return (
        <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
            <div className="space-y-8 flex-grow pb-12">
                <nav className="space-y-1">
                    <Link
                        to="/timeline"
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab === 'flow' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <div className="flex items-center gap-4">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-widest">The Flow</span>
                        </div>
                    </Link>
                    <Link
                        to="/timeline"
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab === 'visions' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <div className="flex items-center gap-4">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                        </div>
                    </Link>
                    <Link
                        to="/messages"
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab === 'messages' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <div className="flex items-center gap-4">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                        </div>
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">1</span>
                    </Link>
                    <Link
                        to="/notifications"
                        className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === 'notifications' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                    </Link>
                </nav>

                <div className="space-y-1">
                    <h4 className="px-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Quick Access</h4>
                    <Link
                        to="/profile"
                        className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === 'profile' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">My Identity</span>
                    </Link>
                    <Link
                        to="/bookmarks"
                        className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === 'treasure' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Treasure</span>
                    </Link>
                </div>

                <div className="space-y-1">
                    <h4 className="px-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Finance</h4>
                    <Link
                        to="/dashboard"
                        className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 10v4M12 8v6M17 12v2" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Experience Hub</span>
                    </Link>
                </div>

                <div className="space-y-1">
                    <h4 className="px-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Protocol</h4>
                    <Link to="/logout" className="flex items-center gap-4 px-5 py-3 hover:bg-red-500/10 rounded-2xl text-zinc-400 hover:text-red-500 transition-all group">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Terminate</span>
                    </Link>
                </div>
            </div>

            <div className="p-5 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 flex items-center gap-4 group cursor-pointer hover:scale-[1.02] mt-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-sm text-black shadow-lg shadow-white/5">
                    {userName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-xs font-black truncate text-white italic">{userName}</p>
                    <p className="text-[9px] font-bold truncate text-zinc-500 uppercase tracking-widest">@{userTag}</p>
                </div>
            </div>
        </aside>
    );
}
