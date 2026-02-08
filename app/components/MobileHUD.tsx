import { Link, useLocation } from "react-router";

export default function MobileHUD({ persona = 'fan', avatarUrl }: { persona?: 'creator' | 'fan', avatarUrl?: string }) {
    const location = useLocation();
    const pathname = location.pathname;
    const isCreator = persona === 'creator';

    const excludedPaths = ["/login", "/signup", "/about", "/forgot", "/pricing", "/messages"];
    // Hide mobile HUD on certain full-screen flows (login/signup/about/messages)
    if (excludedPaths.some(path => pathname.startsWith(path))) return null;

    const isActive = (path: string) => {
        if (path === '/timeline' && (pathname === '/timeline' || pathname === '/')) return true;
        return pathname.startsWith(path);
    };

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md animate-in slide-in-from-bottom-10 duration-700 pb-[env(safe-area-inset-bottom)]">
            <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] touch-manipulation">
                <Link
                    to="/timeline"
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive('/timeline') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                    {isActive('/timeline') && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Flow</span>}
                </Link>

                {isCreator ? (
                    <Link
                        to="/studio"
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive('/studio') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.5 1.5" /><path d="M7.67 7.67L12 12" /></svg>
                        {isActive('/studio') && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Studio</span>}
                    </Link>
                ) : (
                    <Link
                        to="/bookmarks"
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive('/bookmarks') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                        {isActive('/bookmarks') && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Vault</span>}
                    </Link>
                )}

                <Link
                    to="/messages"
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive('/messages') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                >
                    <div className="relative">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-zinc-950 animate-pulse"></span>
                    </div>
                    {isActive('/messages') && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Whisper</span>}
                </Link>

                <Link
                    to="/notifications"
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive('/notifications') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    {isActive('/notifications') && <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Echo</span>}
                </Link>

                <Link
                    to="/dashboard"
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center group transition-all ${isActive('/dashboard') || isActive('/profile') ? "bg-white text-black shadow-xl scale-110" : "text-zinc-600 hover:text-white"}`}
                >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 p-0.5 shadow-lg group-hover:scale-110 transition-transform ${isActive('/dashboard') || isActive('/profile') ? 'from-primary to-violet-600' : ''}`}>
                        <img src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} className="w-full h-full rounded-[10px] object-cover" alt="" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
