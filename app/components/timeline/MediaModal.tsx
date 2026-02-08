import { useEffect, memo, useRef, useState } from "react";

interface MediaItem {
    url: string;
    type: 'video' | 'image' | 'any';
    name?: string;
    handle?: string;
}

export const MediaModal = memo(({ media, items, startIndex = 0, onClose }: {
    media?: MediaItem,
    items?: MediaItem[],
    startIndex?: number,
    onClose: () => void
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(startIndex);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle initial scroll position for collection mode
    useEffect(() => {
        if (items && scrollRef.current) {
            const container = scrollRef.current;
            const target = container.children[startIndex] as HTMLElement;
            if (target) {
                container.scrollLeft = target.offsetLeft;
            }
        }
    }, [items, startIndex]);

    const handleScroll = () => {
        if (items && scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
            if (index !== activeIndex) setActiveIndex(index);
        }
    };

    const renderMedia = (item: MediaItem, index?: number) => {
        const isVideo = item.url.includes('.mp4') || item.type === 'video';
        const isActive = index === undefined || index === activeIndex;

        return (
            <div key={item.url + index} className="relative flex-none w-full h-full flex flex-col items-center justify-center snap-center px-4">
                {isVideo ? (
                    <video
                        src={item.url}
                        controls
                        autoPlay={isActive}
                        loop
                        muted={!isActive}
                        className="max-w-full max-h-[80vh] aspect-[9/16] object-cover rounded-[2.5rem] shadow-2xl border border-white/10 shadow-pink-500/20"
                    />
                ) : (
                    <img
                        src={item.url}
                        className="max-w-full max-h-[85vh] object-contain rounded-[2.5rem] shadow-2xl border border-white/10 shadow-pink-500/20"
                        alt={item.name || ""}
                    />
                )}

                {(item.name || item.handle) && (
                    <div className="mt-8 text-center space-y-2">
                        <h3 className="text-3xl font-black italic text-white tracking-widest uppercase truncate max-w-sm">{item.name}</h3>
                        {item.handle && <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{item.handle}</p>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-zinc-950/98 backdrop-blur-3xl" onClick={onClose}></div>

            <button
                className="absolute top-8 right-8 z-[210] w-14 h-14 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                onClick={onClose}
            >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {items ? (
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative z-[205] w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                >
                    {items.map((item, i) => renderMedia(item, i))}
                </div>
            ) : (
                <div className="relative z-[205] w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                    {media && renderMedia(media)}
                </div>
            )}

            {items && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[210] flex gap-2">
                    {items.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`}></div>
                    ))}
                </div>
            )}
        </div>
    );
});
