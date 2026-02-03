import { Link } from "react-router";
import { useState } from "react";

export default function Signup() {
    const [role, setRole] = useState<"creator" | "fan">("creator");

    return (
        <div className="relative w-full h-full flex bg-black overflow-hidden font-display">
            {/* 50% Aesthetic Side: Sensual & Fancy */}
            <div className="hidden lg:flex w-1/2 relative h-full overflow-hidden">
                <img
                    src="/signup_aesthetic_side_1769529226084.png"
                    alt="Aesthetic"
                    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent"></div>

                {/* Floating Branding Over Aesthetic */}
                <div className="absolute bottom-20 left-20 z-10 space-y-6">
                    <div className="inline-block px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">The Sovereign Altar</span>
                    </div>
                    <h2 className="text-7xl font-black text-white italic leading-[1.1] tracking-tighter">
                        Claim Your <br />
                        <span className="text-gradient">Resonance.</span>
                    </h2>
                    <p className="text-zinc-500 font-bold max-w-sm leading-relaxed italic text-lg translate-y-2 opacity-80">
                        Where influence becomes currency and privacy becomes sanctuary. Join the most exclusive circle of digital sovereignty.
                    </p>
                </div>

                {/* Subtle light leak */}
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-zinc-800/10 rounded-full blur-[160px]"></div>
            </div>

            {/* 50% Form Side: Sharp & Premium */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto scrollbar-hide flex items-center lg:items-start justify-center p-8 pt-12 md:p-20 lg:pt-32 bg-black relative">
                <div className="w-full max-w-lg space-y-12 relative z-10">
                    <header className="space-y-4 text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8 group">
                            <span className="text-3xl font-black tracking-tighter text-white italic">
                                e<span className="text-gradient">Fans.</span>
                            </span>
                        </Link>
                        <h1 className="text-5xl font-black text-white leading-tight italic">
                            Create your <br />
                            <span className="text-zinc-600">Digital Hub.</span>
                        </h1>
                        <p className="text-zinc-500 font-bold italic">Join the next evolution of creator independence in 30 seconds.</p>
                    </header>

                    {/* Premium Persona Selector */}
                    <div className="p-1.5 bg-zinc-900 rounded-[2.5rem] flex relative border border-zinc-800">
                        <button
                            onClick={() => setRole('creator')}
                            className={`flex-1 py-4 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest relative z-10 transition-all ${role === 'creator' ? 'text-black' : 'text-zinc-500'}`}
                        >
                            I am a Creator
                        </button>
                        <button
                            onClick={() => setRole('fan')}
                            className={`flex-1 py-4 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest relative z-10 transition-all ${role === 'fan' ? 'text-black' : 'text-zinc-500'}`}
                        >
                            I am a Fan
                        </button>
                        <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[2.2rem] shadow-none transition-all duration-500 ease-out-back ${role === 'fan' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}></div>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-6 leading-none">Identity Name</label>
                                <input
                                    placeholder="Sofia Valdéz"
                                    className="w-full bg-zinc-900 border border-zinc-800 px-8 py-6 rounded-[2rem] font-bold text-white outline-none focus:border-primary transition-all text-lg shadow-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-6 leading-none">Hub Portal (Email)</label>
                                <input
                                    type="email"
                                    placeholder="resonance@efans.hub"
                                    className="w-full bg-zinc-900 border border-zinc-800 px-8 py-6 rounded-[2rem] font-bold text-white outline-none focus:border-primary transition-all text-lg shadow-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-6 leading-none">Security Key (Password)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full bg-zinc-900 border border-zinc-800 px-8 py-6 rounded-[2rem] font-bold text-white outline-none focus:border-primary transition-all text-lg shadow-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <button className="w-full bg-white text-black py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                                Establish My Resonance
                            </button>
                            <p className="text-center text-[11px] text-zinc-500 font-bold italic translate-y-2">
                                Already sovereign? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">Sign in to your Hub</Link>
                            </p>
                        </div>
                    </form>

                    <footer className="pt-10 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Encrypted Connection</span>
                        <div className="flex gap-4">
                            {['Google', 'Twitter', 'Apple'].map(s => (
                                <button key={s} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-zinc-900 transition-all">
                                    <span className="text-[9px] font-black text-zinc-500 uppercase">{s[0]}</span>
                                </button>
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
