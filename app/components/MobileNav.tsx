import { Link, useLocation } from "react-router";

const NAV_ITEMS = [
    {
        label: "Home",
        to: "/dashboard",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-pink-500" : "text-zinc-400"}>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        )
    },
    {
        label: "Discover",
        to: "/creators",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-pink-500" : "text-zinc-400"}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        )
    },
    {
        label: "Stream",
        to: "/timeline",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-pink-500" : "text-zinc-400"}>
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
        )
    },
    {
        label: "Messages",
        to: "/messages",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-pink-500" : "text-zinc-400"}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        label: "Account",
        to: "/profile",
        icon: (active: boolean) => (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={active ? "text-pink-500" : "text-zinc-400"}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    }
];

export default function MobileNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass h-20 border-t border-pink-100 flex items-center justify-around px-2 pb-2">
            {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex flex-col items-center gap-1 group relative py-2 px-4"
                    >
                        <div className={`transition-transform duration-300 group-active:scale-90 ${isActive ? 'scale-110' : ''}`}>
                            {item.icon(isActive)}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-pink-500" : "text-zinc-400"}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-pink-500 rounded-full blur-[2px]"></div>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
