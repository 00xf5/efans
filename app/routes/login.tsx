import { Link } from "react-router";

export default function Login() {
    return (
        <div className="relative w-full h-full flex bg-zinc-950 overflow-hidden font-display">
            {/* 50% Aesthetic Side: Sapphire & Silk */}
            <div className="hidden lg:flex w-1/2 relative h-full overflow-hidden">
                <img
                    src="/login_aesthetic_side_1769529612431.png"
                    alt="Aesthetic"
                    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/40 to-transparent"></div>

                {/* Floating Branding Over Aesthetic */}
                <div className="absolute bottom-20 left-20 z-10 space-y-6">
                    <div className="inline-block px-5 py-2 glass-dark rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">The Entry Protocol</span>
                    </div>
                    <h2 className="text-7xl font-black text-white italic leading-[1.1] tracking-tighter">
                        Resume the <br />
                        <span className="text-gradient">Legacy.</span>
                    </h2>
                    <p className="text-zinc-400 font-bold max-w-sm leading-relaxed italic text-lg translate-y-2 opacity-80">
                        Authentication is just the first layer of resonance. Step back into your sovereign sanctuary.
                    </p>
                </div>

                {/* Subtle light leak - sapphire tone */}
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[160px] animate-pulse"></div>
            </div>

            {/* 50% Form Side: Sharp & Premium */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto scrollbar-hide flex items-center lg:items-start justify-center p-8 pt-12 md:p-20 lg:pt-32 bg-white relative">
                {/* Mobile Background Overlay - Removed for better visibility */}

                <div className="w-full max-w-lg space-y-12 relative z-10">
                    <header className="space-y-4 text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8 group">
                            <span className="text-3xl font-black tracking-tighter text-zinc-900 italic">
                                e<span className="text-gradient">Fans.</span>
                            </span>
                        </Link>
                        <h1 className="text-5xl font-black text-zinc-900 leading-tight italic">
                            Welcome <br />
                            <span className="text-zinc-400 font-black">Back.</span>
                        </h1>
                        <p className="text-zinc-500 font-bold italic">Your digital hub is awaiting your return signature.</p>
                    </header>

                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-6 leading-none">Hub Portal (Email)</label>
                                <input
                                    type="email"
                                    placeholder="resonance@efans.hub"
                                    className="w-full bg-zinc-50 border border-zinc-100 px-8 py-6 rounded-[2rem] font-bold text-zinc-950 outline-none focus:border-blue-200 transition-all text-lg shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pr-6">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-6 leading-none">Security Key</label>
                                    <Link to="/forgot" className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-blue-500 transition-colors">Recover?</Link>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full bg-zinc-50 border border-zinc-100 px-8 py-6 rounded-[2rem] font-bold text-zinc-950 outline-none focus:border-blue-200 transition-all text-lg shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <button className="w-full bg-zinc-950 text-white py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                                Authenticate Resonance
                            </button>
                            <p className="text-center text-[11px] text-zinc-400 font-bold italic translate-y-2">
                                New to the circle? <Link to="/signup" className="text-blue-500 hover:text-blue-600 transition-colors">Establish your identity</Link>
                            </p>
                        </div>
                    </form>

                    <footer className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Identity Shield Active</span>
                        <div className="flex gap-4">
                            {['Google', 'Twitter', 'Apple'].map(s => (
                                <button key={s} className="w-10 h-10 rounded-xl border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all group">
                                    <span className="text-[9px] font-black text-zinc-300 group-hover:text-zinc-900 transition-colors uppercase">{s[0]}</span>
                                </button>
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
