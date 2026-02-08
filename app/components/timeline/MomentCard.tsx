import { useState, memo } from "react";
import { Link } from "react-router";
import { useVisibility } from "../../hooks/useVisibility";
import type { Post } from "../../types/timeline";
import { HeartIcon, MessageIcon, RelayIcon } from "./Icons";
import { optimizeMediaUrl, preloadVision } from "../../utils/edge.client";

export const MomentCard = memo(({ moment, addReaction, reactions, isFlow = false, onAddComment, onRelay, onUnlock, onMediaClick, onPulse }: { moment: Post, addReaction: (e: React.MouseEvent) => void, reactions: { id: number, x: number, y: number }[], isFlow?: boolean, onAddComment?: (postId: string, content: string) => void, onRelay?: (post: Post) => void, onUnlock?: (postId: string) => void, onMediaClick: (media: { url: string, type: 'video' | 'image' | 'any', name?: string }) => void, onPulse?: (postId: string, creatorId: string) => void }) => {
    const [ref, isVisible] = useVisibility({ threshold: 0.1, rootMargin: '400px' });
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");

    const handleCommentSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && commentInput.trim() && onAddComment) {
            onAddComment(moment.id, commentInput);
            setCommentInput("");
        }
    };

    const mediaUrl = moment.media ? (
        moment.locked
            ? optimizeMediaUrl(moment.media, { blur: 50, quality: 30, width: 400 })
            : optimizeMediaUrl(moment.media, { width: 800, quality: 85 })
    ) : null;

    return (
        <article ref={ref} className="group relative scroll-mt-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            {!isFlow && (
                <div className="absolute -left-16 top-24 hidden xl:flex flex-col gap-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700 delay-100">
                    <button className="w-12 h-12 rounded-2xl glass border-pink-100 dark:border-zinc-800 flex items-center justify-center text-pink-500 dark:text-zinc-400 hover:scale-110 transition-all">
                        <HeartIcon />
                    </button>
                    <button className="w-12 h-12 rounded-2xl glass border-pink-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 hover:text-pink-500 dark:hover:text-white hover:scale-110 transition-all">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                    </button>
                </div>
            )}

            <div className={`glass-card rounded-[3rem] overflow-hidden border-zinc-800 bg-zinc-900 transition-all duration-700 shadow-none ${isFlow ? 'scale-95 hover:scale-100' : ''}`}>
                {moment.relayer && (
                    <div className="px-8 py-3 bg-white/5 border-b border-zinc-800 flex items-center gap-2">
                        <RelayIcon />
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">{moment.relayer.name} echoed this vision</span>
                    </div>
                )}
                <div className="p-6 flex items-center justify-between border-b border-zinc-800">
                    <Link to={`/creator/${moment.source.username}`} className="flex items-center gap-4 group/author">
                        <img src={moment.source.avatar} loading="lazy" className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-800 relative z-10 group-hover/author:scale-105 transition-all duration-500" alt="" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-premium italic text-base text-white leading-none group-hover/author:text-primary transition-colors duration-500">{moment.source.name}</h3>
                                {moment.source.verified && <span className="text-[10px] bg-primary text-white p-0.5 rounded-full">✓</span>}
                                {moment.isAegisGuided && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20" title="Aegis Sovereign Guided">
                                        <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Aegis</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-zinc-400 dark:text-zinc-500 text-[9px] font-bold tracking-widest uppercase group-hover/author:text-zinc-600 dark:group-hover/author:text-zinc-400 transition-colors duration-500">@{moment.source.username}</span>
                                <span className="text-zinc-300 dark:text-zinc-800">•</span>
                                <span className="text-zinc-400 dark:text-zinc-500 text-[9px] font-bold tracking-widest uppercase">{moment.timestamp}</span>
                            </div>
                        </div>
                    </Link>
                    {isFlow && (
                        <button className="text-zinc-300 dark:text-zinc-700 hover:text-pink-400 dark:hover:text-white transition-colors">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                        </button>
                    )}
                </div>

                <div className="px-8 py-6">
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed text-base italic whitespace-pre-wrap">
                        {moment.content}
                    </p>
                </div>

                {moment.media && (
                    <div className="px-4 mb-4">
                        {isVisible ? (
                            <div
                                className="relative aspect-video rounded-2xl overflow-hidden group/media cursor-pointer select-none shadow-sm"
                                onDoubleClick={(e) => {
                                    addReaction(e);
                                    onPulse?.(moment.id, moment.creatorId);
                                }}
                                onClick={(e) => {
                                    if (!moment.locked) {
                                        onMediaClick({
                                            url: optimizeMediaUrl(moment.media!, { width: 1200, quality: 90 }),
                                            type: moment.media!.endsWith('.mp4') ? 'video' : 'image',
                                            name: moment.source.name
                                        });
                                    }
                                }}
                            >
                                {moment.media.endsWith('.mp4') ? (
                                    <video src={mediaUrl || moment.media} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <img src={mediaUrl || moment.media} loading="lazy" className={`w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[3s] ease-out ${moment.locked ? 'grayscale brightness-[0.8]' : ''}`} alt="" />
                                )}

                                {reactions.map(r => (
                                    <div key={r.id} className="absolute pointer-events-none z-50 text-white animate-float-up" style={{ left: r.x, top: r.y }}>
                                        <div className="text-4xl filter drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))">❤️</div>
                                    </div>
                                ))}

                                {moment.locked ? (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-black/80 backdrop-blur-sm">
                                        <h4 className="text-2xl text-premium italic text-white leading-tight">Secret <br />Transmission.</h4>

                                        {moment.requiredTier && moment.requiredTier !== 'Acquaintance' && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white italic">{moment.requiredTier} Only</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (moment.meetsRequirement === false) {
                                                    // Optional: show a specific toast or just let the error return
                                                }
                                                onUnlock && onUnlock(moment.id);
                                            }}
                                            onMouseEnter={() => moment.media && preloadVision(optimizeMediaUrl(moment.media, { width: 1200, quality: 90 }))}
                                            className={`${moment.meetsRequirement === false ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'} px-8 py-3.5 rounded-full font-black text-[10px] transition-all shadow-none active:scale-95 uppercase tracking-[0.3em]`}
                                        >
                                            {moment.meetsRequirement === false ? `Inadequate Standing` : `Unlock Vision • ₦${moment.price || '500'}`}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black italic">Revealed Vision</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-pink-50 dark:border-zinc-800" />
                        )}
                    </div>
                )}

                <div className="px-8 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex gap-8">
                        <button
                            onClick={(e) => {
                                addReaction(e);
                                onPulse?.(moment.id, moment.creatorId);
                            }}
                            className="flex items-center gap-2 group/stat cursor-pointer text-zinc-400 dark:text-zinc-600 hover:text-pink-500 dark:hover:text-white transition-colors"
                        >
                            <HeartIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{moment.stats.likes}</span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 group/stat cursor-pointer transition-colors ${showComments ? 'text-primary' : 'text-zinc-400 dark:text-zinc-600 hover:text-primary dark:hover:text-white'}`}>
                            <MessageIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{moment.stats.whispers || moment.comments?.length || 0}</span>
                        </button>
                        <button onClick={() => onRelay && onRelay(moment)} className="flex items-center gap-2 group/stat cursor-pointer text-zinc-400 dark:text-zinc-600 hover:text-pink-500 dark:hover:text-white transition-colors">
                            <RelayIcon />
                            <span className="text-sm font-display font-black group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{moment.stats.shares}</span>
                        </button>
                    </div>
                </div>

                {showComments && (
                    <div className="px-8 py-6 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-8 h-8 rounded-lg object-cover" alt="" />
                                <div className="flex-grow">
                                    <input
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        onKeyDown={handleCommentSubmit}
                                        placeholder="Add a whisper..."
                                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-zinc-600 transition-all text-zinc-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {moment.comments?.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-500">
                                        <img src={comment.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-400 italic">{comment.user}</p>
                                                {comment.loyalty && (
                                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 ${comment.loyalty.color}`} title={comment.loyalty.label}>
                                                        <span className="text-[10px]">{comment.loyalty.icon}</span>
                                                        <span className="text-[7px] font-black uppercase tracking-widest">{comment.loyalty.label}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
});
