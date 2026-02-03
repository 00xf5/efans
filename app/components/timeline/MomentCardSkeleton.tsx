export const MomentCardSkeleton = () => (
    <div className="glass-card rounded-[3rem] p-8 bg-white/50 dark:bg-zinc-900/50 border-pink-50 dark:border-zinc-800 space-y-8 transition-colors duration-500">
        <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800"></div>
            <div className="space-y-3 flex-grow">
                <div className="w-48 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                <div className="w-32 h-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-full"></div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
            <div className="w-3/4 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
        </div>
        <div className="aspect-video bg-zinc-50 dark:bg-zinc-900 rounded-2xl"></div>
    </div>
);
