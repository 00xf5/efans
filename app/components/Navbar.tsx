import { Link, useLocation } from "react-router";

export default function Navbar() {
    const location = useLocation();
    const pathname = location.pathname;

    const authedPaths = ["/timeline", "/dashboard", "/messages", "/notifications", "/profile", "/bookmarks", "/creators"];
    const isAuthedPage = authedPaths.some(path => pathname.startsWith(path));

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-4 md:px-6 justify-between overflow-hidden">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                        <svg
                            viewBox="0 0 100 100"
                            className="w-8 h-8 relative z-10 fill-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                        >
                            <path d="M50 10 C 25 10, 10 25, 10 50 C 10 75, 25 90, 50 90 C 70 90, 85 75, 88 55 H 65 C 62 65, 55 70, 50 70 C 40 70, 32 62, 32 50 C 32 38, 40 30, 50 30 C 58 30, 65 35, 68 42 H 90 C 85 22, 70 10, 50 10 Z" />
                            <path d="M70 45 H 95 V 55 H 70 Z" className="group-hover:translate-x-1 transition-transform" />
                        </svg>
                    </div>
                    <span className="text-2xl font-display font-black tracking-tighter hidden sm:inline text-[var(--color-text-main)]">
                        e<span className="text-gradient">Fans</span>
                    </span>
                </Link>
            </div>

            {isAuthedPage ? (
                <div className="flex-1 max-w-md mx-4 md:mx-12 lg:mx-24 group relative">
                    <div className="absolute inset-0 bg-pink-100/20 dark:bg-pink-900/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                    <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-full px-4 py-1.5 focus-within:border-pink-300 dark:focus-within:border-pink-500/50 transition-all">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input
                            type="text"
                            placeholder="Search the Stream..."
                            className="bg-transparent border-none outline-none px-3 py-1 w-full text-[11px] font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400"
                        />
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/timeline" className="hover:text-primary transition-colors text-[var(--color-text-main)]">The Stream</Link>
                    <Link to="/creators" className="hover:text-primary transition-colors text-[var(--color-text-main)]">Discover</Link>
                    <Link to="/about" className="hover:text-primary transition-colors text-[var(--color-text-main)]">Features</Link>
                    <Link to="/pricing" className="hover:text-primary transition-colors text-[var(--color-text-main)]">Pricing</Link>
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                        const isDark = document.documentElement.classList.toggle('dark');
                        localStorage.setItem('theme', isDark ? 'dark' : 'light');
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--color-bg-soft)] transition-colors text-[var(--color-text-main)]"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="hidden dark:block"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" /></svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="block dark:hidden"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                </button>

                {isAuthedPage ? (
                    <Link
                        to="/logout"
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-zinc-400 hover:text-rose-500 transition-all active:scale-95"
                        title="Logout Ritual"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm font-medium hover:text-primary transition-colors text-[var(--color-text-main)] hidden sm:inline px-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
