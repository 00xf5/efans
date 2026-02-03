import { useEffect, memo } from "react";

export const MediaModal = memo(({ media, onClose }: { media: { url: string, type: 'video' | 'image' | 'any', name?: string }, onClose: () => void }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const isVideo = media.url.includes('.mp4') || media.type === 'video';

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-3xl"></div>

            <button
                className="absolute top-8 right-8 z-[210] w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                onClick={onClose}
            >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div
                className="relative z-[205] max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500"
                onClick={e => e.stopPropagation()}
            >
                {isVideo ? (
                    <video
                        src={media.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] rounded-[2.5rem] shadow-2xl border border-white/10 shadow-pink-500/20"
                    />
                ) : (
                    <img
                        src={media.url}
                        className="max-w-full max-h-[85vh] object-contain rounded-[2.5rem] shadow-2xl border border-white/10 shadow-pink-500/20"
                        alt={media.name || ""}
                    />
                )}

                {media.name && (
                    <div className="mt-10 text-center space-y-3">
                        <h3 className="text-4xl font-black italic text-white tracking-[0.2em] uppercase leading-none">{media.name}</h3>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-pink-500"></div>
                            <p className="text-[10px] font-black uppercase text-pink-400 tracking-[0.5em] italic">Resonance Portal</p>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-pink-500"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
