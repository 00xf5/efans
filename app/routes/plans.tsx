import { useState } from "react";
import { Link } from "react-router";

export default function Pricing() {
    const [fans, setFans] = useState(500);
    const [subPrice, setSubPrice] = useState(15000);
    const [boostDays, setBoostDays] = useState(7);

    const monthlyRevenue = fans * subPrice;
    const platformTake = monthlyRevenue * 0.20;
    const creatorTake = monthlyRevenue * 0.80;
    const referralPotential = platformTake * 0.10; // 10% of platform cut for referrers

    return (
        <div className="relative w-full min-h-screen bg-black text-white selection:bg-primary/20 font-display">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                <img src="/pricing_aesthetic.png" className="w-full h-full object-cover grayscale brightness-50" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            {/* Navigation Header */}
            <header className="relative z-10 w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="text-3xl font-black tracking-tighter text-white italic">
                    e<span className="text-gradient">Fans.</span>
                </Link>
                <Link to="/signup" className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-none">
                    Start Launch
                </Link>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-32">
                {/* Hero section */}
                <section className="text-center space-y-8 animate-entrance">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black tracking-widest uppercase">
                        Zero Entry Barriers
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] italic">
                        The Equity <br />
                        <span className="text-gradient">Protocol.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 font-bold italic leading-relaxed">
                        We only succeed when you resonate. No monthly fees, no hidden costs. Just pure creation.
                    </p>
                </section>

                {/* Primary Model Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* The 80/20 Core */}
                    <div className="md:col-span-2 bg-zinc-900/40 rounded-[4rem] p-12 border border-zinc-800 space-y-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] group-hover:bg-primary/10 transition-colors"></div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">80/20 <span className="text-zinc-600">Split.</span></h2>
                            <p className="text-zinc-500 font-bold italic leading-relaxed max-w-md">You retain the vast majority of your resonance. We take a flat 20% to manage the sanctuary, edge delivery, and Aegis security.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-zinc-800 pt-12">
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Creator Share</p>
                                <p className="text-5xl font-black text-white italic tracking-tighter">80%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Platform Fee</p>
                                <p className="text-5xl font-black text-zinc-800 italic tracking-tighter">20%</p>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-3xl p-6 border border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Join Cost: ₦0.00</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">Permanently Sovereign</span>
                        </div>
                    </div>

                    {/* Referral Engine */}
                    <div className="bg-white rounded-[4rem] p-12 text-black space-y-12 relative overflow-hidden flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-black/10">🤝</div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">Referral <br />Engine.</h2>
                            <p className="text-zinc-600 font-bold italic text-sm leading-relaxed">Earn a <span className="text-primary font-black">10% commission</span> from the platform's cut for every creator you bring into the sanctuary. Lifetime resonance.</p>
                        </div>
                        <div className="pt-8 border-t border-zinc-200">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">Active Potential</p>
                            <p className="text-xl font-black italic">Passive Growth Vector</p>
                        </div>
                    </div>
                </section>

                {/* Boost Upsell Section */}
                <section className="bg-zinc-900/40 rounded-[4rem] border border-zinc-800 p-12 md:p-20 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                                Apex Discovery
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter leading-tight">
                                Daily <br />
                                <span className="text-gradient">Boosts.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg font-bold italic leading-relaxed">
                                Need more resonance? For only <span className="text-white">$3 USD</span> a day, trigger our professional boost engine to place your profile at the apex of all discovery altars.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    "Priority Home Page Landing",
                                    "Top of Global Discovery",
                                    "Algorithm Weight Multiplier",
                                    "Verified Spotlight Badge"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold italic text-zinc-400">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary"><polyline points="20 6 9 17 4 12" /></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-black p-12 rounded-[4rem] border border-zinc-800 space-y-12 shadow-2xl">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic text-center">Configure Boost Cycle</p>
                                <div className="flex items-center justify-between text-4xl font-black text-white italic tabular-nums">
                                    <button onClick={() => setBoostDays(Math.max(1, boostDays - 1))} className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-colors flex items-center justify-center text-2xl">-</button>
                                    <span>{boostDays} Days</span>
                                    <button onClick={() => setBoostDays(boostDays + 1)} className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-colors flex items-center justify-center text-2xl">+</button>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-zinc-800 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic mb-2 font-display">Investment</p>
                                    <p className="text-4xl font-black text-primary italic leading-none">${(boostDays * 3).toFixed(2)}</p>
                                </div>
                                <button className="px-8 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-none">
                                    Trigger Boost
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive ROI Calculator */}
                <section className="space-y-16 py-20 border-t border-zinc-900">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Extraction <span className="text-gradient">Calculator.</span></h2>
                        <p className="text-zinc-600 font-bold italic uppercase tracking-widest text-[9px]">Estimate your monthly fuel in Naira</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-end px-2">
                                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Active Hub Connections</span>
                                    <span className="text-3xl font-black text-white italic tabular-nums leading-none">{fans.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range" min="100" max="10000" step="100" value={fans}
                                    onChange={(e) => setFans(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end px-2">
                                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Monthly Fuel Rate</span>
                                    <span className="text-3xl font-black text-white italic tabular-nums leading-none">₦{subPrice.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range" min="5000" max="100000" step="1000" value={subPrice}
                                    onChange={(e) => setSubPrice(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 p-12 rounded-[4rem] border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic leading-none mb-3">Total Gross</p>
                                <p className="text-3xl font-black text-white/50 italic tabular-nums leading-none">₦{monthlyRevenue.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic leading-none mb-3">Monthly Extraction (80%)</p>
                                <p className="text-5xl md:text-6xl font-black text-white italic tabular-nums leading-none tracking-tighter">₦{creatorTake.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Values */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-40">
                    {[
                        { title: "No Subscription", text: "You never pay us a monthly fee to exist. We only grow when you do." },
                        { title: "Highest Split", text: "Competitive 80/20 split that outperforms legacy hub commissions." },
                        { title: "Instant Access", text: "Verified creators unlock instant extraction sequences. No 30-day waits." }
                    ].map((val, i) => (
                        <div key={i} className="bg-zinc-950 p-12 rounded-[3rem] border border-zinc-900 space-y-6 group hover:border-zinc-700 transition-colors">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{val.title}</h3>
                            <p className="text-zinc-600 font-bold italic leading-relaxed text-sm">{val.text}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
