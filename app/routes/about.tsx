import type { Route } from "./+types/about";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "About | eFans" },
        { name: "description", content: "The architecture of eFans - Redefining digital intimacy and creator economy." },
    ];
}

export default function About() {
    return (
        <div className="relative w-full h-full bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden font-display">
            {/* Premium Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-zinc-800/20 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/40 rounded-full blur-[160px]"></div>
            </div>

            <div className="w-full max-w-4xl px-8 flex flex-col items-center justify-center text-center relative z-10 space-y-12 h-screen overflow-y-auto scrollbar-hide py-20">

                {/* Hero Section */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-7xl font-display font-black tracking-tighter text-white leading-tight">
                        The <span className="text-gradient">Essence</span> <br />
                        of Connection.
                    </h1>
                    <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto italic leading-relaxed">
                        "We didn't build a platform. We architected a sanctuary for digital intimacy and creative sovereignty."
                    </p>
                </section>

                {/* Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="glass-card p-10 rounded-[3.5rem] border-zinc-800 bg-zinc-900/40 text-left space-y-4 hover:scale-[1.02] transition-transform duration-500">
                        <div className="text-3xl font-primary">💎</div>
                        <h3 className="text-2xl font-black text-white italic lowercase tracking-tight">Pure Sovereignty</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            Creators own their data, their audience, and their destiny. No algorithms, no shadows—just pure resonance.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-[3.5rem] border-zinc-800 bg-zinc-900/40 text-left space-y-4 hover:scale-[1.02] transition-transform duration-500">
                        <div className="text-3xl">✨</div>
                        <h3 className="text-2xl font-black text-white italic lowercase tracking-tight">High Fidelity</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            Experience digital moments in their most pristine form. 4K visions, lossless whispers, and tactile interactions.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-[3.5rem] border-zinc-800 bg-zinc-900/40 text-left space-y-4 hover:scale-[1.02] transition-transform duration-500">
                        <div className="text-3xl">🌊</div>
                        <h3 className="text-2xl font-black text-white italic lowercase tracking-tight">The Flow</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            A public stream of consciousness where followers and muses interact in real-time, building a community of desire.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-[3.5rem] border-zinc-800 bg-zinc-900/40 text-left space-y-4 hover:scale-[1.02] transition-transform duration-500">
                        <div className="text-3xl">🛡️</div>
                        <h3 className="text-2xl font-black text-white italic lowercase tracking-tight">Fortress Privacy</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            Encryption at every layer. Your whispers stay private, your visions stay protected. Identity is sacred.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-8 pb-20">
                    <Link to="/signup" className="bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-none hover:bg-primary hover:text-white transition-all active:scale-95">
                        Become the Muse
                    </Link>
                </div>

            </div>
        </div>
    );
}
