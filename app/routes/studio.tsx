import { useState, useEffect } from "react";
import { Link, useLoaderData, useFetcher } from "react-router";
import { db } from "../db/index.server";
import { profiles, moments, loyaltyStats, ledger } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireUserId } from "../utils/session.server";
import { Sidebar } from "../components/Sidebar";
import { formatTimeAgo } from "../utils/date";

export async function loader({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
    });

    if (!profile || profile.persona !== 'creator') {
        throw new Response("Unauthorized: Identity restricted to fan status. Resonate higher to access the Studio.", { status: 403 });
    }

    // High-Fidelity Data Extraction
    const [myMoments, totalFans, totalEarnings] = await Promise.all([
        db.query.moments.findMany({
            where: eq(moments.creatorId, userId),
            orderBy: [desc(moments.createdAt)],
            limit: 10
        }),
        db.select({ count: sql<number>`count(*)` })
            .from(loyaltyStats)
            .where(eq(loyaltyStats.creatorId, userId)),
        db.select({ sum: sql<string>`sum(cast(${ledger.amount} as decimal))` })
            .from(ledger)
            .where(eq(ledger.receiverId, userId))
    ]);

    return {
        profile,
        myMoments: myMoments as any[], // Explicitly cast to avoid complex inference issues in view
        fanCount: totalFans[0].count,
        earnings: parseFloat(totalEarnings[0].sum || "0").toLocaleString()
    };
}

interface Moment {
    id: string;
    type: string;
    content: string | null;
    mediaAssets: any;
    price: string | null;
    createdAt: Date;
    creatorId: string;
}

export default function CreatorStudio() {
    const { profile, myMoments, fanCount, earnings } = useLoaderData<typeof loader>();
    const [activeTab, setActiveTab] = useState("Visions");

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 font-display overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-900/40 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/30 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full">

                    <Sidebar activeTab="studio" userName={profile.name || "Creator"} userTag={profile.tag || "creator"} persona="creator" />

                    <main className="flex-grow max-w-4xl w-full py-8 h-full overflow-y-auto scrollbar-hide space-y-12 px-4 pb-32">
                        {/* Studio Header */}
                        <header className="flex flex-col md:flex-row justify-between items-end gap-6 animate-entrance">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Command Center</h4>
                                <h1 className="text-5xl font-black italic tracking-tighter">Creator <span className="text-white/20">Studio.</span></h1>
                            </div>
                            <div className="flex gap-4">
                                <Link to="/timeline" className="px-8 py-4 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
                                    New Vision
                                </Link>
                            </div>
                        </header>

                        {/* Apex Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-entrance [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4 group hover:bg-zinc-900 transition-all">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Total Resonance</h5>
                                <div className="flex items-end gap-3">
                                    <p className="text-4xl font-black italic">₦{earnings}</p>
                                    <span className="text-emerald-500 text-[10px] font-black mb-1">+12%</span>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4 group hover:bg-zinc-900 transition-all">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Faithful Observers</h5>
                                <div className="flex items-end gap-3">
                                    <p className="text-4xl font-black italic">{fanCount}</p>
                                    <span className="text-primary text-[10px] font-black mb-1">Pulse</span>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4 group hover:bg-zinc-900 transition-all">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Aegis Standing</h5>
                                <div className="flex items-end gap-3">
                                    <p className="text-4xl font-black italic">{profile.resonanceScore || "100"}%</p>
                                    <div className="h-2 w-16 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${profile.resonanceScore || 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interaction Tabs */}
                        <div className="space-y-8">
                            <nav className="flex gap-8 border-b border-white/5">
                                {["Visions", "Analytics", "Protocol"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full blur-[2px]"></div>}
                                    </button>
                                ))}
                            </nav>

                            {activeTab === "Visions" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                    {(myMoments as Moment[]).map((moment: Moment) => (
                                        <div key={moment.id} className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-zinc-950 rounded-2xl overflow-hidden border border-white/5">
                                                    {moment.mediaAssets?.[0]?.url ? (
                                                        <img src={moment.mediaAssets[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-800 italic font-black text-xs">TEXT</div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold italic line-clamp-1">{moment.content || "No title"}</p>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{formatTimeAgo(moment.createdAt)} • {moment.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-xs font-black italic">₦{moment.price}</p>
                                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter mt-1">Value</p>
                                                </div>
                                                <button className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {myMoments.length === 0 && (
                                        <p className="text-center text-zinc-600 italic text-sm py-24">No cosmic fragments released to the flow yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "Analytics" && (
                                <div className="bg-zinc-950/50 p-12 rounded-[3.5rem] border border-white/5 text-center space-y-4 animate-in fade-in">
                                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 text-primary">
                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 10v4M12 8v6M17 12v2" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black italic">Resonance Heatmap</h3>
                                    <p className="text-zinc-500 text-sm italic max-w-xs mx-auto">Deep focus analytics are currently being calibrated for your identity standing.</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Rail: Activity Sentinel */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full bg-zinc-950/20 px-4 border-l border-white/5 overflow-hidden">
                        <div className="flex justify-between items-center px-2 mb-8">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Activity Sentinel</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-zinc-900/30 p-4 rounded-2xl border border-white/5 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Unlock</span>
                                        <span className="text-[8px] font-bold text-zinc-700">2m ago</span>
                                    </div>
                                    <p className="text-[10px] font-medium italic text-zinc-400 leading-relaxed">
                                        A fan from the <span className="text-white">UK Haven</span> successfully unlocked your latest vision.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
