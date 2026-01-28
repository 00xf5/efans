import { Link, useLocation } from "react-router";

const NAV_ITEMS = [
    {
        label: "Home",
        to: "/timeline",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {active ? (
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                ) : (
                    <>
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </>
                )}
            </svg>
        )
    },
    {
        label: "Messages",
        to: "/messages",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        label: "Echoes",
        to: "/notifications",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        )
    },
    {
        label: "Hub",
        to: "/dashboard",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
        )
    }
];

export default function MobileNav() {
    const location = useLocation();

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-card bg-white/70 backdrop-blur-3xl border-pink-100/50 rounded-[2.5rem] p-2 flex justify-around shadow-2xl shadow-pink-100/30">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${isActive ? "bg-zinc-900 text-white shadow-xl shadow-zinc-400 scale-105" : "text-zinc-400 hover:text-pink-500 hover:bg-pink-50"}`}
                        >
                            {item.icon(isActive)}
                            {!isActive && (
                                <span className="absolute -top-10 px-3 py-1 bg-zinc-900 text-white text-[8px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
                <Link to="/profile" className="w-14 h-14 rounded-2xl flex items-center justify-center group transition-all">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 p-0.5 shadow-lg group-hover:scale-110 transition-transform ${location.pathname === '/profile' ? 'ring-2 ring-pink-500 ring-offset-2' : ''}`}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-full h-full rounded-[10px] object-cover" alt="Profile" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
