import { memo } from "react";
import { useVisibility } from "../../hooks/useVisibility";
import type { TrendingCreator } from "../../types/timeline";

export const TrendingAltarItem = memo(({ creator, rank, onBoost, onMediaClick }: { creator: TrendingCreator, rank: number, onBoost: (id: string) => void, onMediaClick: (media: { url: string, type: 'video' | 'image' | 'any', name?: string }) => void }) => {
    const [ref, isVisible] = useVisibility({ rootMargin: '200px' });

    return (
        <div ref={ref} className="relative min-h-[500px] w-full">
            {isVisible ? (
                <div className="relative group cursor-pointer animate-in fade-in duration-700" onClick={() => onMediaClick({ url: creator.avatar, type: 'image', name: creator.name })}>
                    <div className="relative aspect-[3/4.5] w-full rounded-[4.5rem] overflow-hidden border-[3px] border-pink-50/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group-hover:scale-[1.02] transition-transform duration-1000">
                        <img src={creator.avatar} loading="lazy" className="w-full h-full object-cover transition-all duration-[8s] ease-out group-hover:scale-110" alt="" />

                        {/* Paid Boost Portal (Teaser) */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onBoost(creator.id); }}
                            className="absolute top-24 right-8 z-30 w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hover:bg-pink-500 hover:border-pink-400"
                        >
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12l10-10 10 10" /></svg>
                        </button>

                        <div className="absolute top-8 left-8 z-20">
                            <div className="px-6 py-3 bg-zinc-900/95 backdrop-blur-3xl border border-white/20 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                                <span className="text-lg font-black text-white italic">#{rank}</span>
                                <span className="w-[1px] h-4 bg-white/20"></span>
                                <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">{creator.status}</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-95 group-hover:opacity-80 transition-opacity"></div>
                        <div className="absolute bottom-12 left-10 right-10 space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase text-white tracking-widest leading-none drop-shadow-2xl">{creator.name}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[12px] font-black text-pink-500 uppercase tracking-[0.5em] flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"></span>
                                        {creator.velocity > 0 ? 'Apex Velocity' : 'Cooling'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Core Resonance</span>
                                        <span className="text-4xl font-black text-white italic tabular-nums leading-none tracking-tighter">{creator.heat.toFixed(1)}°</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Flow</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[3px] border border-white/10">
                                    <div className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full transition-all duration-[1.5s] shadow-[0_0_25px_rgba(236,72,153,0.6)]" style={{ width: `${creator.heat}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="aspect-[3/4.5] w-full rounded-[4.5rem] bg-zinc-50 dark:bg-zinc-900 border border-pink-50 dark:border-zinc-800"></div>
            )}
        </div>
    );
});
