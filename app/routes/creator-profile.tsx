import { useState, useRef, useEffect } from "react";
import { Link, useParams, useLoaderData, useFetcher, useNavigate } from "react-router";
import { db } from "../db/index.server";
import { profiles, moments, subscriptions, unlocks, conversations, ledger, loyaltyStats } from "../db/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { requireUserId, getUserId } from "../utils/session.server";
import { calculateLoyaltyTier, hasRequiredTier } from "../utils/loyalty";
import type { LoyaltyTier } from "../utils/loyalty";
import { MomentCard } from "../components/timeline/MomentCard";
import { MediaModal } from "../components/timeline/MediaModal";

interface Moment {
    id: string;
    type: string;
    content: string | null;
    mediaAssets: any;
    price: string | null;
    requiredTier: string | null;
    createdAt: Date;
    creatorId: string;
}

export async function loader({ params, request }: { params: any, request: Request }) {
    const { username } = params;
    const currentUserId = await getUserId(request);

    const creator = await db.query.profiles.findFirst({
        where: eq(profiles.tag, username)
    });

    if (!creator) {
        throw new Response("Creator not found", { status: 404 });
    }

    // Parallel High-Fidelity Data Extraction
    const [currentUserProfile, fanLoyalty, creatorMoments, sub, userUnlocks] = await Promise.all([
        currentUserId ? db.query.profiles.findFirst({ where: eq(profiles.id, currentUserId) }) : Promise.resolve(null),
        currentUserId ? db.query.loyaltyStats.findFirst({ where: and(eq(loyaltyStats.fanId, currentUserId), eq(loyaltyStats.creatorId, creator.id)) }) : Promise.resolve(null),
        db.query.moments.findMany({ where: eq(moments.creatorId, creator.id), orderBy: [desc(moments.createdAt)], limit: 50 }),
        currentUserId ? db.query.subscriptions.findFirst({ where: and(eq(subscriptions.fanId, currentUserId), eq(subscriptions.creatorId, creator.id), eq(subscriptions.status, 'active')) }) : Promise.resolve(null),
        currentUserId ? db.query.unlocks.findMany({ where: eq(unlocks.userId, currentUserId) }) : Promise.resolve([])
    ]);

    const currentTier = (fanLoyalty?.tier as LoyaltyTier) || "Acquaintance";
    const isFollowing = !!sub;
    const unlockedIds = userUnlocks.map((u: { momentId: string }) => u.momentId);

    return {
        creator,
        currentUserProfile,
        creatorMoments: (creatorMoments as Moment[]).map((m: Moment) => {
            const isUnlocked = unlockedIds.includes(m.id);
            const reqTier = (m.requiredTier as LoyaltyTier) || "Acquaintance";
            const meetsTier = hasRequiredTier(currentTier, reqTier);
            const isLocked = m.type === 'vision' && !isUnlocked && (parseFloat(m.price || "0") > 0 || !meetsTier);

            return {
                ...m,
                locked: isLocked,
                meetsRequirement: meetsTier,
                stats: { likes: "0", whispers: 0, shares: 0 }, // For MomentCard
                source: {
                    name: creator.name,
                    username: creator.tag,
                    avatar: creator.avatarUrl,
                    verified: creator.isVerified
                }
            };
        }),
        isFollowing,
        currentUserId
    };
}

export async function action({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "message") {
        const creatorId = formData.get("creatorId") as string;

        // Find existing conversation
        let conv = await db.query.conversations.findFirst({
            where: or(
                and(eq(conversations.participantOneId, userId), eq(conversations.participantTwoId, creatorId)),
                and(eq(conversations.participantOneId, creatorId), eq(conversations.participantTwoId, userId))
            )
        });

        if (!conv) {
            const [newConv] = await db.insert(conversations).values({
                participantOneId: userId,
                participantTwoId: creatorId,
            }).returning();
            conv = newConv;
        }

        return { success: true, conversationId: conv.id };
    }

    if (intent === "subscribe") {
        const creatorId = formData.get("creatorId") as string;
        const tier = formData.get("tier") as string;
        const priceStr = formData.get("price") as string;
        const price = parseFloat(priceStr);

        // Fetch current user balance
        const fanProfile = await db.query.profiles.findFirst({ where: eq(profiles.id, userId) });
        const creatorProfile = await db.query.profiles.findFirst({ where: eq(profiles.id, creatorId) });

        if (!fanProfile || !creatorProfile) return { success: false, error: "Identity not found" };

        const currentFanBalance = parseFloat(fanProfile.balance?.toString() || "0");
        if (currentFanBalance < price) return { success: false, error: "Insufficient resonance" };

        // 80/20 Split Calculation
        const creatorCut = price * 0.8;
        const platformCut = price * 0.2;

        // Perform Transactions
        await db.transaction(async (tx: any) => {
            // Deduct from fan
            await tx.update(profiles)
                .set({ balance: (currentFanBalance - price).toString() })
                .where(eq(profiles.id, userId));

            // Add to creator
            const currentCreatorBalance = parseFloat(creatorProfile.balance?.toString() || "0");
            await tx.update(profiles)
                .set({ balance: (currentCreatorBalance + creatorCut).toString() })
                .where(eq(profiles.id, creatorId));

            // Create subscription record
            await tx.insert(subscriptions).values({
                fanId: userId,
                creatorId: creatorId,
                status: "active",
                price: price.toString(),
                tier: tier,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });

            // Update Loyalty Stats
            const existingLoyalty = await tx.query.loyaltyStats.findFirst({
                where: and(eq(loyaltyStats.fanId, userId), eq(loyaltyStats.creatorId, creatorId))
            });

            const newTotalSpend = parseFloat(existingLoyalty?.lifetimeResonance?.toString() || "0") + price;
            const newTier = calculateLoyaltyTier(newTotalSpend);

            if (existingLoyalty) {
                await tx.update(loyaltyStats)
                    .set({
                        lifetimeResonance: newTotalSpend.toString(),
                        tier: newTier,
                        updatedAt: new Date()
                    })
                    .where(eq(loyaltyStats.id, existingLoyalty.id));
            } else {
                await tx.insert(loyaltyStats).values({
                    fanId: userId,
                    creatorId: creatorId,
                    lifetimeResonance: newTotalSpend.toString(),
                    tier: newTier
                });
            }

            // Log ledger entry
            await tx.insert(ledger).values({
                senderId: userId,
                receiverId: creatorId,
                amount: price.toString(),
                creatorCut: creatorCut.toString(),
                platformCut: platformCut.toString(),
                type: "subscription",
                status: "success"
            });
        });

        return { success: true };
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

    return { success: false };
}


export default function CreatorProfile() {
    const { creator, currentUserProfile, creatorMoments, isFollowing } = useLoaderData() as {
        creator: any,
        currentUserProfile: any,
        creatorMoments: any[],
        isFollowing: boolean
    };
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Visions");
    const [toast, setToast] = useState<string | null>(null);
    const [showSubModal, setShowSubModal] = useState(false);
    const [expandedMedia, setExpandedMedia] = useState<{ url: string, type: 'video' | 'image' | 'any', name?: string } | null>(null);
    const [reactions, setReactions] = useState<{ id: number, x: number, y: number }[]>([]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (fetcher.data && (fetcher.data as any).success) {
            if ((fetcher.data as any).conversationId) {
                navigate(`/messages`);
            } else {
                showToast("Action Successfully Processed");
            }
        } else if (fetcher.data && (fetcher.data as any).error) {
            showToast((fetcher.data as any).error);
        }
    }, [fetcher.data, navigate]);

    const handleUnlock = (momentId: string) => {
        const formData = new FormData();
        formData.append("intent", "unlock");
        formData.append("momentId", momentId);
        fetcher.submit(formData, { method: "POST" });
    };

    const handlePulse = (momentId: string, creatorId: string) => {
        const formData = new FormData();
        formData.append("intent", "pulse");
        formData.append("momentId", momentId);
        formData.append("creatorId", creatorId);
        fetcher.submit(formData, { method: "POST" });
    };

    const addReaction = (e: React.MouseEvent) => {
        const id = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setReactions(prev => [...prev, { id, x, y }]);
        setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
    };

    return (
        <div className="relative w-full h-full bg-white text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden">
            {expandedMedia && <MediaModal media={expandedMedia} onClose={() => setExpandedMedia(null)} />}
            {/* Resonance Feedback Altar */}
            {toast && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {toast}
                </div>
            )}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100/30 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-50/40 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full flex justify-center px-4 md:px-6 relative z-10 h-full">
                <div className="flex w-full max-w-[1700px] gap-8 h-full">

                    {/* Sidebar Nav */}
                    <aside className="hidden lg:flex flex-col w-72 py-8 h-full overflow-y-auto scrollbar-hide">
                        <nav className="space-y-1">
                            <Link to="/timeline" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 transition-all font-bold group text-decoration-none">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-pink-500 transition-colors"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                                <span className="text-[11px] font-black uppercase tracking-widest">Feed</span>
                            </Link>
                            <Link to="/creators" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 transition-all font-bold group text-decoration-none">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-pink-500 transition-colors"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                <span className="text-[11px] font-black uppercase tracking-widest">Discovery</span>
                            </Link>
                            <Link to="/messages" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 transition-all font-bold group text-decoration-none">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-pink-500 transition-colors"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                            </Link>
                        </nav>
                        <div className="mt-auto p-5 glass-card rounded-[2rem] border-pink-100 flex items-center gap-4 mb-8 shadow-pink-100/30">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-black">
                                {creator.name ? creator.name.substring(0, 2).toUpperCase() : "VN"}
                            </div>
                        </div>
                    </aside>

                    {/* Main Creator Profile */}
                    <main className="flex-grow max-w-2xl h-full overflow-y-auto scrollbar-hide flex flex-col pt-8">
                        {/* Cover & Profile Identity */}
                        <div className="relative flex-shrink-0 group">
                            <div className="h-64 rounded-[3.5rem] overflow-hidden border border-pink-100 shadow-2xl relative">
                                <img src={creator.coverUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent"></div>

                                {/* Overlay Stats */}
                                <div className="absolute bottom-8 right-4 md:right-12 flex gap-4 md:gap-8">
                                    <div className="text-center">
                                        <p className="text-white font-black text-xl leading-none">{creator.resonanceScore || "100"}%</p>
                                        <p className="text-pink-100 text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">Resonance</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-black text-xl leading-none">{creatorMoments.length}</p>
                                        <p className="text-pink-100 text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">Visions</p>
                                    </div>
                                </div>
                            </div>

                            {/* Avatar Float */}
                            <div className="absolute -bottom-12 left-4 md:left-12 flex items-end gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
                                    <img src={creator.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.tag}`} className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-white relative z-10 shadow-2xl bg-white" alt="" />
                                </div>
                                <div className="pb-4">
                                    <h1 className="text-3xl text-premium italic text-pink-900 leading-none">{creator.name || "Anonymous"}</h1>
                                    <p className="text-pink-400 text-sm font-bold tracking-widest mt-2">@{creator.tag}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio & Actions */}
                        <div className="mt-20 px-4 space-y-8 flex-shrink-0">
                            <div className="flex justify-between items-start gap-12">
                                <p className="text-zinc-600 font-medium leading-relaxed italic text-lg max-w-md">
                                    "{creator.bio || "No description provided."}"
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowSubModal(true)}
                                        className="bg-pink-500 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-pink-200 hover:bg-pink-600 transition-all active:scale-95 flex items-center gap-3 whitespace-nowrap"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        {isFollowing ? "Altar Fueled" : "Fuel the Altar"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const formData = new FormData();
                                            formData.append("intent", "message");
                                            formData.append("creatorId", creator.id);
                                            fetcher.submit(formData, { method: "POST" });
                                        }}
                                        className="w-14 h-14 bg-white border border-pink-100 rounded-3xl flex items-center justify-center hover:bg-pink-50 transition-all shadow-sm text-pink-500 text-decoration-none"
                                    >
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {["Sovereign", "Elite", "High Fidelity"].map(t => (
                                    <span key={t} className="px-5 py-2 rounded-full border border-pink-100 text-[9px] font-black uppercase tracking-widest text-pink-400 bg-pink-50/20">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content Feed Tabs */}
                        <div className="mt-12 sticky top-0 z-20 bg-white/80 backdrop-blur-3xl border-b border-pink-50 py-4 px-2">
                            <div className="flex gap-4">
                                {["Visions", "Whispers"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400 hover:text-pink-500'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content Render */}
                        <div className="p-4 pb-32">
                            {activeTab === "Visions" && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {creatorMoments.map((item: any) => (
                                        <MomentCard
                                            key={item.id}
                                            moment={item}
                                            onUnlock={handleUnlock}
                                            onPulse={handlePulse}
                                            reactions={reactions}
                                            addReaction={addReaction}
                                            onMediaClick={setExpandedMedia}
                                        />
                                    ))}
                                    {creatorMoments.length === 0 && (
                                        <p className="text-center text-zinc-400 italic text-sm py-24">This sanctuary has no visions yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "Whispers" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {(creatorMoments as Moment[]).filter((m: Moment) => !m.mediaAssets?.length).map((whisper: Moment) => (
                                        <div key={whisper.id} className="glass-card p-8 rounded-[2.5rem] border-pink-50 space-y-4 hover:bg-pink-50/10 transition-colors">
                                            <p className="text-zinc-700 font-medium italic leading-relaxed text-lg">"{whisper.content}"</p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{new Date(whisper.createdAt).toLocaleDateString()}</span>
                                                <div className="flex gap-6">
                                                    <span className="text-[10px] font-black text-pink-400">❤️ 0</span>
                                                    <span className="text-[10px] font-black text-pink-400">💬 0</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(creatorMoments as Moment[]).filter((m: Moment) => !m.mediaAssets?.length).length === 0 && (
                                        <p className="text-center text-zinc-400 italic text-sm py-12">No whispers shared yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Rail (Mock for visual density) */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-pink-50/20 px-4 border-x border-pink-50">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">Resonating Now</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></div>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32">
                            <p className="text-[10px] font-bold text-zinc-300 italic text-center py-8">Collective resonance starting...</p>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Subscription Engine: Fuel the Altar Modal */}
            {showSubModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100 animate-entrance">
                        <button onClick={() => setShowSubModal(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>

                        <header className="text-center space-y-4 mb-12">
                            <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] italic leading-none">Force of Nature</h4>
                            <h3 className="text-4xl text-zinc-900 font-black italic tracking-tighter">Fuel the Altar.</h3>
                            <p className="text-zinc-400 text-sm font-bold italic">Select your resonance tier to unlock exclusive visions from {creator.name}.</p>
                        </header>

                        <div className="grid grid-cols-3 gap-8">
                            {[
                                { title: "Bronze Spark", price: "1,500", color: "from-amber-100", perks: ["Exclusive Feed Access", "Adore Badge", "Basic Whispers"] },
                                { title: "Silver Surge", price: "5,000", color: "from-zinc-100", perks: ["Priority Sanctuary DM", "Uncensored Glimpses", "Custom Greeting"], recommended: true },
                                { title: "Sovereign Soul", price: "25,000", color: "from-pink-100", perks: ["Ultra-Low Latency VOD", "1-on-1 Resonance", "Legacy Artifact Access"] }
                            ].map((tier) => (
                                <div key={tier.title} className={`relative p-8 rounded-[3rem] border transition-all hover:scale-[1.02] group ${tier.recommended ? 'border-pink-500 shadow-2xl shadow-pink-100 bg-white' : 'border-zinc-100 bg-zinc-50/50'}`}>
                                    {tier.recommended && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Adored</div>
                                    )}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} to-white mb-6 flex items-center justify-center shadow-sm border border-white text-zinc-900`}>
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m13 2-2 10h8L7 22l2-10H1L13 2Z" /></svg>
                                    </div>
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">{tier.title}</h5>
                                    <div className="mt-4 mb-8">
                                        <span className="text-4xl font-black italic text-zinc-900 leading-none tracking-tighter">₦{tier.price}</span>
                                        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-2">/ month</span>
                                    </div>
                                    <ul className="space-y-4 mb-10">
                                        {tier.perks.map(p => (
                                            <li key={p} className="flex items-center gap-3 text-[10px] font-bold italic text-zinc-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => {
                                            const myBalance = parseFloat(currentUserProfile?.balance?.toString() || "0");
                                            const tPrice = parseFloat(tier.price.replace(',', ''));

                                            if (myBalance < tPrice) {
                                                showToast("Insufficient Resonance in Wallet");
                                                return;
                                            }

                                            const formData = new FormData();
                                            formData.append("intent", "subscribe");
                                            formData.append("creatorId", creator.id);
                                            formData.append("tier", tier.title);
                                            formData.append("price", tPrice.toString());
                                            fetcher.submit(formData, { method: "POST" });

                                            setShowSubModal(false);
                                            showToast(`Initializing ${tier.title} Protocol...`);
                                        }}
                                        disabled={fetcher.state === "submitting"}
                                        className={`w-full py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${tier.recommended ? 'bg-pink-500 text-white shadow-xl shadow-pink-200 hover:bg-pink-600' : 'bg-zinc-900 text-white hover:bg-black'}`}
                                    >
                                        {fetcher.state === "submitting" ? "Authenticating..." : "subscribe"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
