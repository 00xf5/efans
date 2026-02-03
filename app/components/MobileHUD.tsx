import { Link, useLocation } from "react-router";

export default function MobileHUD() {
    const location = useLocation();
    const pathname = location.pathname;

    const excludedPaths = ["/login", "/signup", "/about", "/forgot", "/pricing"];
    // Hide mobile HUD on certain full-screen flows (login/signup/about)
    // Also hide on messages and any messages sub-routes to avoid blocking input
    if (excludedPaths.includes(pathname) || pathname.startsWith('/messages')) return null;

    const isActive = (path: string) => {
        if (path === '/timeline' && (pathname === '/timeline' || pathname === '/')) return true;
        return pathname.startsWith(path);
    };

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm animate-in slide-in-from-bottom-10 duration-700 pb-[env(safe-area-inset-bottom)]">
            <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 flex justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] touch-manipulation">
                <Link
                    to="/timeline"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/timeline') ? "bg-white text-black shadow-xl scale-105" : "text-zinc-500 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                </Link>

                <Link
                    to="/messages"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/messages') ? "bg-white text-black shadow-xl scale-105" : "text-zinc-500 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </Link>

                <Link
                    to="/notifications"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/notifications') ? "bg-white text-black shadow-xl scale-105" : "text-zinc-500 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </Link>

                <Link
                    to="/dashboard"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/dashboard') ? "bg-white text-black shadow-xl scale-105" : "text-zinc-500 hover:text-white"}`}
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                </Link>


                <Link
                    to="/profile"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center group transition-all ${isActive('/profile') ? "bg-white text-black shadow-xl scale-105" : "text-zinc-500 hover:text-white"}`}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-full h-full rounded-[10px] object-cover" alt="" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
