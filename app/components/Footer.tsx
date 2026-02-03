import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-zinc-900 py-20 px-6 bg-black">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-gradient italic block">eFans</Link>
                        <p className="text-zinc-600 font-bold italic max-w-xs leading-relaxed text-xs">
                            The premium destination for the elite digital creator. Manifest your legacy with SEO-first architecture.
                        </p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        <Link to="/creators" className="hover:text-white transition-colors">Discover</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link to="/about" className="hover:text-white transition-colors">Sanctuary</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Protocols</Link>
                    </nav>

                    <div className="flex gap-8 grayscale opacity-40 hover:opacity-100 transition-all">
                        <a href="#" className="hover:text-pink-500 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest">TW</span>
                        </a>
                        <a href="#" className="hover:text-pink-500 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest">IG</span>
                        </a>
                        <a href="#" className="hover:text-pink-500 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest">LI</span>
                        </a>
                    </div>
                </div>

                <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">© 2026 EFANS REGISTRY. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-6 items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/40"></span>
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Aegis Guard Secured</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
