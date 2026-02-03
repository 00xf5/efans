import { useState } from "react";
import { Link } from "react-router";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="relative w-full h-full flex bg-black overflow-hidden font-display">
            {/* 50% Aesthetic Side: Sapphire & Silk */}
            <div className="hidden lg:flex w-1/2 relative h-full overflow-hidden">
                <img
                    src="/forgot_aesthetic.png"
                    alt="Aesthetic"
                    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent"></div>

                {/* Floating Branding Over Aesthetic */}
                <div className="absolute bottom-20 left-20 z-10 space-y-6">
                    <div className="inline-block px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Recovery Protocol</span>
                    </div>
                    <h2 className="text-7xl font-black text-white italic leading-[1.1] tracking-tighter">
                        Restore your <br />
                        <span className="text-gradient">Access.</span>
                    </h2>
                    <p className="text-zinc-500 font-bold max-w-sm leading-relaxed italic text-lg translate-y-2 opacity-80">
                        The sanctuary's gates are never permanently closed to those who hold the initial signature.
                    </p>
                </div>

                {/* Subtle light leak */}
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[160px]"></div>
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

                        {!isSubmitted ? (
                            <>
                                <h1 className="text-5xl font-black text-white leading-tight italic">
                                    Identity <br />
                                    <span className="text-zinc-600 font-black">Recovery.</span>
                                </h1>
                                <p className="text-zinc-500 font-bold italic">Enter your hub portal to trigger a recovery sequence.</p>
                            </>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 mx-auto lg:mx-0">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                                <h1 className="text-5xl font-black text-white leading-tight italic">
                                    Sequence <br />
                                    <span className="text-emerald-500 font-black">Initiated.</span>
                                </h1>
                                <p className="text-zinc-500 font-bold italic mt-4">We've dispatched a recovery link to your hub. Check your portal to resume resonance.</p>
                            </div>
                        )}
                    </header>

                    {!isSubmitted && (
                        <form className="space-y-8 animate-in fade-in duration-500" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-6 leading-none">Hub Portal (Email)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="resonance@efans.hub"
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-800 px-8 py-6 rounded-[2rem] font-bold text-white outline-none focus:border-primary transition-all text-lg shadow-none placeholder:text-zinc-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <button
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                            Triggering Sequence...
                                        </>
                                    ) : (
                                        "Trigger Recovery Sequence"
                                    )}
                                </button>
                                <p className="text-center text-[11px] text-zinc-500 font-bold italic translate-y-2">
                                    Remembered? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">Return to sanctuary</Link>
                                </p>
                            </div>
                        </form>
                    )}

                    {isSubmitted && (
                        <div className="pt-8 animate-in fade-in duration-700 delay-300">
                            <Link to="/login" className="w-full block text-center bg-zinc-900 border border-zinc-800 text-white py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all">
                                Return to Entry Protocol
                            </Link>
                        </div>
                    )}

                    <footer className="pt-10 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Vault Security Active</span>
                        <div className="hidden sm:flex gap-4">
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">256-bit AES</span>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
