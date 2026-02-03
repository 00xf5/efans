import { useState, useEffect, useRef } from "react";
import { Link, useLoaderData, useFetcher, useNavigation } from "react-router";
import type { Post } from "../types/timeline";
import { MomentCard } from "../components/timeline/MomentCard";
import { TrendingAltarItem } from "../components/timeline/TrendingAltarItem";
import { MediaModal } from "../components/timeline/MediaModal";
import { MomentCardSkeleton } from "../components/timeline/MomentCardSkeleton";

import { db } from "../db/index.server";
import { moments, users, profiles, echoes, pulses, whispers, loyaltyStats, ledger, unlocks } from "../db/schema";
import { desc, eq, and } from "drizzle-orm";
import { requireUserId } from "../utils/session.server";
import { getUploadUrl } from "../utils/r2.server";
import { sanitizeContent } from "../utils/aegis.server";
import { getTierBadge, hasRequiredTier, calculateLoyaltyTier, LOYALTY_TIERS } from "../utils/loyalty";
import type { LoyaltyTier } from "../utils/loyalty";

import {
    MOCK_MOMENTS,
    FEATURED_CREATORS,
    MOCK_REELS,
    INITIAL_FLOW_POSTS,
    INITIAL_TRENDING
} from "../data/mock-timeline";

export async function loader({ request }: { request: Request }) {
    const userId = await requireUserId(request);

    // Parallel High-Fidelity Data Extraction
    const [userUnlocks, userLoyalty, realMomentsRaw, dbFeatured] = await Promise.all([
        db.query.unlocks.findMany({ where: eq(unlocks.userId, userId) }),
        db.query.loyaltyStats.findMany({ where: eq(loyaltyStats.fanId, userId) }),
        db.query.moments.findMany({
            with: {
                creator: true,
                whispers: {
                    with: {
                        fan: { with: { loyaltyStats: true } }
                    },
                    orderBy: [desc(whispers.createdAt)],
                    limit: 10
                }
            },
            orderBy: [desc(moments.createdAt)],
            limit: 50
        }),
        db.query.profiles.findMany({
            where: eq(profiles.persona, 'creator'),
            limit: 10
        })
    ]);

    const unlockedIds = userUnlocks.map((u: any) => u.momentId);

    // Map DB moments to Post interface
    const realMoments: Post[] = (realMomentsRaw as any[]).map((m: any) => {
        const isUnlocked = unlockedIds.includes(m.id);
        const creatorId = m.creatorId;
        const fanLoyaltyInCreatorHub = userLoyalty.find((l: any) => l.creatorId === creatorId);
        const currentTier = (fanLoyaltyInCreatorHub?.tier as LoyaltyTier) || "Acquaintance";
        const requiredTier = (m.requiredTier as LoyaltyTier) || "Acquaintance";

        const meetsTier = hasRequiredTier(currentTier, requiredTier);

        // Locked if it's a vision AND (not unlocked AND (not meeting tier OR price > 0))
        // Actually, if price is 0 but tier is required, meeting tier unlocks it?
        // Let's say: if price > 0, always needs unlock. If price is 0, just needs tier.
        const isLocked = m.type === 'vision' && !isUnlocked && (parseFloat(m.price || "0") > 0 || !meetsTier);

        return {
            id: m.id,
            creatorId: m.creatorId,
            source: {
                name: m.creator?.name || "Anonymous",
                username: m.creator?.tag || "user",
                avatar: m.creator?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.creator?.id}`,
                verified: m.creator?.isVerified || false
            },
            type: m.type === 'vision' ? 'VISION' : 'FLOW_POST',
            timestamp: new Date(m.createdAt).toLocaleDateString(),
            content: m.content || "",
            media: m.mediaAssets?.[0]?.url || undefined,
            stats: { likes: "0", whispers: m.whispers?.length || 0, shares: 0 },
            locked: isLocked,
            price: m.price?.toString(),
            requiredTier: m.requiredTier,
            meetsRequirement: meetsTier,
            isAegisGuided: m.isAegisGuided,
            comments: (m.whispers || []).map((w: any) => {
                const badge = getTierBadge((w.fan?.loyaltyStats || []).find((ls: any) => ls.creatorId === m.creatorId)?.tier || "Acquaintance");
                return {
                    id: w.id,
                    user: w.fan?.name || "Fan",
                    avatar: w.fan?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.fanId}`,
                    content: w.content,
                    loyalty: { label: badge.label, color: badge.color, icon: badge.icon }
                };
            })
        };
    });

    // Identify featured creators from profiles

    const featured = dbFeatured.length > 0 ? (dbFeatured as any[]).map((c: any) => ({
        name: c.name || "Genesis Creator",
        img: c.avatarUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        handle: `@${c.tag}`
    })) : FEATURED_CREATORS;

    return {
        realMoments,
        featured,
        userId
    };
}

export async function action({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "post") {
        const content = formData.get("content") as string;
        const mediaType = formData.get("mediaType") as string;
        const isLocked = formData.get("isLocked") === "true";
        const mediaFile = formData.get("mediaFile") as File;

        let mediaUrl = "";
        if (mediaFile && mediaFile.size > 0) {
            // Secure R2 Upload Flow
            const fileName = `visions/${userId}/${Date.now()}-${mediaFile.name}`;
            const uploadUrl = await getUploadUrl(fileName, mediaFile.type);

            // Upload to R2 via PUT
            await fetch(uploadUrl, {
                method: "PUT",
                body: mediaFile,
                headers: { "Content-Type": mediaFile.type }
            });

            mediaUrl = `https://visions.efans.workers.dev/${fileName}`;
        }

        const creatorProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, userId)
        });

        const aegisLevel = creatorProfile?.aggressiveSanitization ? 'aggressive' : 'standard';
        const aegisResult = await sanitizeContent(content, aegisLevel);

        if (!aegisResult.isPure && aegisLevel === 'aggressive') {
            return { success: false, error: aegisResult.reason };
        }

        const price = formData.get("price") as string;
        const reqTier = formData.get("requiredTier") as string;

        const filteredContent = aegisResult.purifiedContent || content;

        const [newMoment] = await db.insert(moments).values({
            creatorId: userId,
            content: filteredContent,
            type: isLocked ? 'vision' : 'flow',
            mediaAssets: mediaUrl ? [{ url: mediaUrl, type: (mediaType || "").includes('video') ? 'video' : 'image' }] : [],
            price: price || "0.00",
            requiredTier: reqTier || "Acquaintance",
            isAegisGuided: true
        }).returning();

        return { success: true, moment: newMoment };
    }

    if (intent === "unlock") {
        const momentId = formData.get("momentId") as string;

        // Fetch moment and prices
        const moment = await db.query.moments.findFirst({
            where: eq(moments.id, momentId),
            with: { creator: true }
        });

        if (!moment || moment.type !== 'vision') return { success: false, error: "Vision not found" };
        const price = parseFloat(moment.price?.toString() || "0");
        const creatorId = moment.creatorId;

        // Fetch fan balance
        const fanProfile = await db.query.profiles.findFirst({ where: eq(profiles.id, userId) });
        if (!fanProfile) return { success: false, error: "Identity not found" };

        // Verify Loyalty Tier Requirement
        if (moment.requiredTier && moment.requiredTier !== 'Acquaintance') {
            const fanLoyalty = await db.query.loyaltyStats.findFirst({
                where: and(eq(loyaltyStats.fanId, userId), eq(loyaltyStats.creatorId, creatorId))
            });
            const currentTier = (fanLoyalty?.tier as LoyaltyTier) || "Acquaintance";
            const reqTier = moment.requiredTier as LoyaltyTier;

            if (!hasRequiredTier(currentTier, reqTier)) {
                return { success: false, error: `Inadequate Resonance: ${reqTier} standing required.` };
            }
        }

        const currentBalance = parseFloat(fanProfile.balance?.toString() || "0");
        if (currentBalance < price) return { success: false, error: "Insufficient resonance" };

        const creatorCut = price * 0.8;
        const platformCut = price * 0.2;

        await db.transaction(async (tx: any) => {
            // Deduct from fan
            await tx.update(profiles)
                .set({ balance: (currentBalance - price).toString() })
                .where(eq(profiles.id, userId));

            // Add to creator
            const creatorBalance = parseFloat(moment.creator?.balance?.toString() || "0");
            await tx.update(profiles)
                .set({ balance: (creatorBalance + creatorCut).toString() })
                .where(eq(profiles.id, creatorId));

            // Record unlock
            await tx.insert(unlocks).values({
                userId,
                momentId
            });

            // Update Loyalty
            const existingLoyalty = await tx.query.loyaltyStats.findFirst({
                where: and(eq(loyaltyStats.fanId, userId), eq(loyaltyStats.creatorId, creatorId))
            });

            const newTotalSpend = parseFloat(existingLoyalty?.lifetimeResonance?.toString() || "0") + price;
            const newTier = calculateLoyaltyTier(newTotalSpend);

            if (existingLoyalty) {
                await tx.update(loyaltyStats)
                    .set({ lifetimeResonance: newTotalSpend.toString(), tier: newTier, updatedAt: new Date() })
                    .where(eq(loyaltyStats.id, existingLoyalty.id));
            } else {
                await tx.insert(loyaltyStats).values({ fanId: userId, creatorId: creatorId, lifetimeResonance: newTotalSpend.toString(), tier: newTier });
            }

            // Ledger
            await tx.insert(ledger).values({
                senderId: userId,
                receiverId: creatorId,
                amount: price.toString(),
                creatorCut: creatorCut.toString(),
                platformCut: platformCut.toString(),
                type: "unlock",
                status: "success"
            });
        });

        return { success: true };
    }

    if (intent === "whisper") {
        const momentId = formData.get("momentId") as string;
        const content = formData.get("content") as string;

        const moment = await db.query.moments.findFirst({ where: eq(moments.id, momentId) });
        if (!moment) return { success: false, error: "Vision lost" };

        const creatorProfile = await db.query.profiles.findFirst({ where: eq(profiles.id, moment.creatorId) });
        const aegisLevel = creatorProfile?.aggressiveSanitization ? 'aggressive' : 'standard';

        const aegisResult = await sanitizeContent(content, aegisLevel);
        if (!aegisResult.isPure && aegisLevel === 'aggressive') {
            return { success: false, error: aegisResult.reason };
        }

        const filteredContent = aegisResult.purifiedContent || content;

        await db.insert(whispers).values({
            momentId: momentId,
            fanId: userId,
            content: filteredContent,
            status: aegisResult.isPure ? 'pure' : 'redacted'
        });

        return { success: true };
    }

    if (intent === "pulse") {
        const momentId = formData.get("momentId") as string;
        const creatorId = formData.get("creatorId") as string;

        // Create Pulse record
        await db.insert(pulses).values({
            userId,
            momentId: momentId
        });

        // Create Echo for Creator
        const userProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, userId)
        });

        await db.insert(echoes).values({
            recipientId: creatorId,
            senderId: userId,
            type: 'pulse',
            content: `${userProfile?.name || 'A fan'} pulsed your essence`,
            link: `/timeline`
        });

        return { success: true };
    }

    return { success: false };
}

export default function Timeline() {
    const { realMoments, featured } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [reactions, setReactions] = useState<{ id: number, x: number, y: number }[]>([]);

    // Hybrid Data Strategy: Real data prioritized, Mocks for visual density
    const [flowPosts, setFlowPosts] = useState<Post[]>([]);
    const [visions, setVisions] = useState<Post[]>([]);

    useEffect(() => {
        // Merge real moments into the appropriate lists
        const dbFlowOnly = realMoments.filter(m => m.type === 'FLOW_POST');
        const dbVisionsOnly = realMoments.filter(m => m.type === 'VISION');

        setFlowPosts([...dbFlowOnly, ...INITIAL_FLOW_POSTS]);
        setVisions([...dbVisionsOnly, ...MOCK_MOMENTS]);
    }, [realMoments]);

    const [trending, setTrending] = useState(INITIAL_TRENDING);
    const [newPostContent, setNewPostContent] = useState("");
    const [attachedMedia, setAttachedMedia] = useState<{ file: File, url: string } | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [unlockPrice, setUnlockPrice] = useState("500");
    const [requiredTier, setRequiredTier] = useState<LoyaltyTier>("Acquaintance");
    const [toast, setToast] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [expandedMedia, setExpandedMedia] = useState<{ url: string, type: 'video' | 'image' | 'any', name?: string } | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Kinetic Economy Loop (Heat Decay) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTrending(prev => {
                const refreshed = prev.map(c => {
                    const decay = 0.08;
                    const drift = (Math.random() * 0.4) - 0.1;
                    const newHeat = Math.max(0, Math.min(100, c.heat - decay + drift));
                    return {
                        ...c,
                        heat: newHeat,
                        velocity: drift - decay,
                        status: newHeat > 95 ? "Peak" : newHeat > 85 ? "Rising" : "Hot"
                    };
                });
                return [...refreshed].sort((a, b) => b.heat - a.heat);
            });
        }, 5000);

        const timer = setTimeout(() => setIsLoading(false), 900);
        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const handleBoost = (id: string) => {
        setTrending(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, heat: Math.min(100, c.heat + 15), velocity: 2.0 };
            }
            return c;
        }).sort((a, b) => b.heat - a.heat));
    };

    const handlePostSubmit = () => {
        if (!newPostContent.trim() && !attachedMedia) return;

        const formData = new FormData();
        formData.append("intent", "post");
        formData.append("content", newPostContent);
        formData.append("isLocked", isLocked.toString());
        formData.append("price", unlockPrice);
        formData.append("requiredTier", requiredTier);
        if (attachedMedia) {
            formData.append("mediaFile", attachedMedia.file);
            formData.append("mediaType", attachedMedia.file.type);
        }

        fetcher.submit(formData, { method: "POST", encType: "multipart/form-data" });

        // Optimistic UI/Clearance
        setNewPostContent("");
        setAttachedMedia(null);
        showToast("Transmission Distributed to the Flow");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAttachedMedia({ file, url });
        }
    };

    const addReaction = (e: React.MouseEvent) => {
        const id = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setReactions(prev => [...prev, { id, x, y }]);
        setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
    };

    const handleAddComment = (postId: string, content: string) => {
        // Real comment logic will be added next...
        setFlowPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [
                        ...(post.comments || []),
                        {
                            id: `c-${Date.now()}`,
                            user: "Premium Fan",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                            content
                        }
                    ]
                };
            }
            return post;
        }));
    };

    const handleRelay = (originalPost: Post) => {
        const relayPost: Post = {
            ...originalPost,
            id: `relay-${Date.now()}`,
            relayer: {
                name: "Premium Fan",
                username: "fan_02"
            },
            timestamp: "Just now",
            stats: { likes: "0", whispers: 0, shares: 0 },
            comments: []
        };
        setFlowPosts([relayPost, ...flowPosts]);
    };

    const handleUnlock = (postId: string) => {
        // Integration with Paystack/Ledger will be handled here
        setFlowPosts(prev => prev.map(p => p.id === postId ? { ...p, locked: false } : p));
        setVisions(prev => prev.map(p => p.id === postId ? { ...p, locked: false } : p));
        showToast("Vision Unlocked. Establishing Resonance...");
    };

    const handlePulse = (momentId: string, creatorId: string) => {
        const formData = new FormData();
        formData.append("intent", "pulse");
        formData.append("momentId", momentId);
        formData.append("creatorId", creatorId);
        fetcher.submit(formData, { method: "POST" });
        showToast("Resonance Distributed");
    };

    return (
        <div className="relative w-full h-full bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden transition-colors duration-500 font-display">
            {expandedMedia && <MediaModal media={expandedMedia} onClose={() => setExpandedMedia(null)} />}

            {/* Dynamic Background Light */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-zinc-900/40 via-transparent to-transparent pointer-events-none -z-10 transition-colors duration-1000"></div>
            <div className="fixed top-24 left-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-24 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

            {/* Notification Altar */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {toast}
                </div>
            )}

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-x-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full overflow-x-hidden">

                    {/* Column 1: Navigation Sidebar */}
                    <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
                        <div className="space-y-8 flex-grow pb-12">
                            <nav className="space-y-1">
                                <button onClick={() => setActiveTab("flow")} className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab === "flow" ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}>
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">The Flow</span>
                                    </div>
                                </button>
                                <Link to="/timeline" onClick={() => setActiveTab("all")} className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-bold transition-all ${activeTab !== "flow" && activeTab !== "messages" && activeTab !== "notifications" ? "bg-white text-black shadow-xl" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"}`}>
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                                    </div>
                                </Link>
                                <Link to="/messages" className="flex items-center justify-between px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group">
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                                    </div>
                                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">1</span>
                                </Link>
                                <Link to="/notifications" className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Echoes</span>
                                </Link>
                            </nav>

                            <div className="space-y-1">
                                <h4 className="px-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Quick Access</h4>
                                <Link to="/profile" className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">My Identity</span>
                                </Link>
                                <button
                                    onClick={() => showToast("Under Calibration: Treasure Vault coming soon")}
                                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-left">Treasure</span>
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h4 className="px-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Finance</h4>
                                <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 10v4M12 8v6M17 12v2" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Experience Hub</span>
                                </Link>
                                <button
                                    onClick={() => showToast("Under Calibration: Our Essence coming soon")}
                                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all group"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="16" /><path d="M12 12h.01" /><path d="M12 12V8" /></svg>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-left">Our Essence</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-5 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 flex items-center gap-4 group cursor-pointer hover:scale-[1.02] mt-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-sm text-black shadow-lg shadow-white/5">U2</div>
                            <div className="flex-grow min-w-0">
                                <p className="text-xs font-black truncate text-white italic">Premium Fan</p>
                            </div>
                        </div>
                    </aside>

                    {/* Column 2: Independent Center Feed */}
                    <main className="flex-grow w-full max-w-full md:max-w-2xl py-8 h-full overflow-y-auto overflow-x-hidden scrollbar-hide space-y-12 px-4 scroll-smooth pb-32 lg:pb-8">
                        {/* Mobile Reels Carousel */}
                        <div className="lg:hidden space-y-4 overflow-hidden mb-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Glimpses</h4>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1 pb-4">
                                {MOCK_REELS.map((reel) => (
                                    <div key={reel.id} className="flex-none w-28 group relative cursor-pointer" onClick={() => setExpandedMedia({ url: reel.video, type: 'video', name: reel.name })}>
                                        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                                            <img src={reel.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <p className="text-[8px] font-black text-white uppercase truncate tracking-widest leading-none mb-1">{reel.name}</p>
                                                <div className="flex gap-0.5">
                                                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                                                    <div className="w-1 h-1 rounded-full bg-primary/50"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Feed Header */}
                        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-3xl py-4 border-b border-zinc-900 flex items-center justify-between gap-4 -mx-4 px-4 shadow-none">
                            <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-[2.2rem] border border-zinc-800 overflow-x-auto scrollbar-hide w-full sm:w-auto">
                                {["all", "flow", "unlocked", "featured", "reels"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 sm:px-8 py-2.5 rounded-[1.8rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab ? "bg-white text-black shadow-none scale-105" : "text-zinc-500 hover:text-white hover:bg-zinc-800"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => showToast("Under Calibration: Deployment Terminal coming soon")}
                                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl shadow-none text-primary hover:bg-primary hover:text-white transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
                            </button>
                        </div>

                        {activeTab === "flow" && (
                            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                                {/* Studio Composer UI */}
                                <div className="bg-zinc-900 rounded-[3rem] p-0 border border-zinc-800 shadow-none overflow-hidden">
                                    <div className="bg-white/5 p-4 flex items-center justify-between border-b border-zinc-800">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Studio Composer</span>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex gap-6">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-16 h-16 rounded-3xl object-cover ring-4 ring-zinc-800 shadow-xl" alt="" />
                                            <div className="flex-grow space-y-4">
                                                <textarea
                                                    value={newPostContent}
                                                    onChange={(e) => setNewPostContent(e.target.value)}
                                                    placeholder="Reveal your essence to the world..."
                                                    className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium text-white placeholder:text-zinc-700 resize-none min-h-[120px] scrollbar-hide"
                                                />
                                                {attachedMedia && (
                                                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] group shadow-2xl">
                                                        {attachedMedia.file.type.includes('video') ? (
                                                            <video src={attachedMedia.url} className="w-full h-full object-cover" controls />
                                                        ) : (
                                                            <img src={attachedMedia.url} className="w-full h-full object-cover" alt="" />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <button
                                                            onClick={() => setAttachedMedia(null)}
                                                            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/80 text-white flex items-center justify-center backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                        >
                                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-14 h-14 rounded-[1.8rem] bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:-translate-y-1 active:translate-y-0 active:scale-95 group relative"
                                                >
                                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => showToast("Calibrating Whisper Altar...")}
                                                    className="w-14 h-14 rounded-[1.8rem] bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:-translate-y-1 group relative">
                                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg>
                                                </button>
                                                <div className="h-10 w-[1px] bg-zinc-800 mx-2"></div>
                                                <div className="flex p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800">
                                                    <button
                                                        onClick={() => setIsLocked(false)}
                                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isLocked ? 'bg-white text-black shadow-sm' : 'text-zinc-600 hover:text-white'}`}>Public</button>
                                                    <button
                                                        onClick={() => setIsLocked(true)}
                                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLocked ? 'bg-white text-black shadow-sm' : 'text-zinc-600 hover:text-white'}`}>Locked</button>
                                                </div>
                                                {isLocked && (
                                                    <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
                                                        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-950 rounded-[1.5rem] border border-zinc-800">
                                                            <span className="text-zinc-600 text-[10px] font-black italic">₦</span>
                                                            <input
                                                                type="number"
                                                                value={unlockPrice}
                                                                onChange={(e) => setUnlockPrice(e.target.value)}
                                                                placeholder="500"
                                                                className="w-16 bg-transparent border-none focus:ring-0 text-[11px] font-black text-white p-0"
                                                            />
                                                        </div>
                                                        <select
                                                            value={requiredTier}
                                                            onChange={(e) => setRequiredTier(e.target.value as LoyaltyTier)}
                                                            className="px-6 py-3 bg-zinc-950 rounded-[1.5rem] border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-white transition-colors"
                                                        >
                                                            {LOYALTY_TIERS.map(t => (
                                                                <option key={t.label} value={t.label} className="bg-black">{t.icon} {t.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handlePostSubmit}
                                                disabled={(!newPostContent.trim() && !attachedMedia) || fetcher.state === "submitting"}
                                                className="bg-white text-black pl-12 pr-6 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-none active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-6 group"
                                            >
                                                <span>{fetcher.state === "submitting" ? "Transmitting..." : "Distribute"}</span>
                                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Feed */}
                                <div className="space-y-12 pb-32">
                                    {isLoading || navigation.state === "loading" ? (
                                        <>
                                            <MomentCardSkeleton />
                                            <MomentCardSkeleton />
                                        </>
                                    ) : (
                                        flowPosts.map((post: Post) => (
                                            <MomentCard key={post.id} moment={post} addReaction={addReaction} reactions={reactions} isFlow onAddComment={handleAddComment} onRelay={handleRelay} onUnlock={handleUnlock} onMediaClick={setExpandedMedia} onPulse={handlePulse} />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "featured" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h1 className="text-5xl font-black italic text-center text-white">Divine <span className="text-gradient">Muse.</span></h1>
                                <div ref={carouselRef} className="flex overflow-x-auto gap-8 pb-12 snap-x scrollbar-hide px-4">
                                    {(featured as any[]).map((creator: any, i: number) => (
                                        <div key={i} className="flex-none w-[320px] h-[480px] snap-center rounded-[3rem] overflow-hidden bg-zinc-900 border border-zinc-800 relative group/card cursor-pointer shadow-none" onClick={() => setExpandedMedia({ url: creator.img, type: 'image', name: creator.name })}>
                                            <img src={creator.img} loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-1000 animated-sensual" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <h3 className="text-3xl font-black text-white italic tracking-tighter">{creator.name}</h3>
                                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-2">{creator.handle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "reels" && (
                            <div className="space-y-8 animate-in fade-in duration-1000">
                                <h1 className="text-5xl font-black italic text-center text-white">Live <span className="text-gradient">Flow.</span></h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-20">
                                    {MOCK_REELS.map((reel) => (
                                        <div key={reel.id} className="relative aspect-[9/16] rounded-[3rem] overflow-hidden bg-zinc-900 border border-zinc-800 group/reel-tab cursor-pointer transition-all duration-700 shadow-none" onClick={() => setExpandedMedia({ url: reel.video, type: 'video', name: reel.name })}>
                                            <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <h3 className="text-2xl font-black italic text-white tracking-tighter">{reel.name}</h3>
                                            </div>
                                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-primary/20 backdrop-blur-xl rounded-full border border-primary/40">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest italic animate-pulse">LIVE</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(activeTab === "all" || activeTab === "unlocked") && (
                            <div className="space-y-20 pb-32">
                                {visions.map((moment: Post) => (
                                    <MomentCard key={moment.id} moment={moment} addReaction={addReaction} reactions={reactions} onRelay={handleRelay} onUnlock={handleUnlock} onMediaClick={setExpandedMedia} onPulse={handlePulse} />
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Column 3: Doomscroll Sidebar */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-black px-4 border-x border-zinc-900 transition-colors">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Active Desires</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </div>

                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32 relative" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {[...MOCK_REELS, ...MOCK_REELS].map((reel: any, idx: number) => (
                                <div key={`${reel.id}-${idx}`} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-zinc-800 group/reel cursor-pointer shadow-none transition-all duration-500 hover:scale-[1.02]" onClick={() => setExpandedMedia({ url: reel.video, type: 'video', name: reel.name })}>
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 to-transparent">
                                        <h5 className="text-[11px] font-black uppercase text-white italic tracking-widest">{reel.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Column 4: Trending Rail (The Grand Discovery Altar) */}
                    <aside className="hidden 2xl:flex flex-col w-[480px] py-8 h-full space-y-12 bg-black border-l border-zinc-900 overflow-hidden relative transition-colors duration-500">
                        {/* Heat Aurora Header */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                        <div className="px-10 space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black text-white uppercase tracking-[0.6em] italic leading-none">The Apex Gallery</h4>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="h-[2px] flex-grow bg-gradient-to-r from-primary/40 to-transparent"></span>
                                <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] whitespace-nowrap">Live Resonances</p>
                            </div>
                        </div>

                        <div className="flex-grow space-y-16 overflow-y-auto scrollbar-hide px-10 pb-48 relative z-10">
                            {isLoading ? (
                                <>
                                    <div className="w-full aspect-[3/4.5] rounded-[4.5rem] bg-zinc-900 animate-pulse border border-zinc-800" />
                                    <div className="w-full aspect-[3/4.5] rounded-[4.5rem] bg-zinc-900 animate-pulse border border-zinc-800 opacity-50" />
                                </>
                            ) : (
                                trending.map((creator: any, i: number) => (
                                    <TrendingAltarItem key={creator.id} creator={creator} rank={i + 1} onBoost={handleBoost} onMediaClick={setExpandedMedia} />
                                ))
                            )}
                        </div>
                    </aside>

                </div>
            </div>

        </div>
    );
}
