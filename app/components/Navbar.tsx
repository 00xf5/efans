import { Link } from "react-router";

export default function Navbar() {
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
                    <span className="text-2xl font-display font-black tracking-tighter">
                        e<span className="text-gradient">Fans</span>
                    </span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link to="/timeline" className="hover:text-primary transition-colors">The Stream</Link>
                <Link to="/creators" className="hover:text-primary transition-colors">Discover</Link>
                <Link to="/about" className="hover:text-primary transition-colors">Features</Link>
                <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    to="/login"
                    className="text-sm font-medium hover:text-primary transition-colors"
                >
                    Sign In
                </Link>
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
                <Link
                    to="/signup"
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
