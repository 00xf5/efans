import { useState, useRef, useEffect } from "react";
import { Link, useLoaderData, useFetcher, useActionData } from "react-router";
import { db } from "../db/index.server";
import { profiles, conversations, messages, users } from "../db/schema";
import { eq, or, and, desc, asc } from "drizzle-orm";
import { requireUserId } from "../utils/session.server";

interface DbConversation {
    id: string;
    participantOneId: string;
    participantTwoId: string;
    lastMessageAt: Date;
    createdAt: Date;
}

interface DbMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string | null;
    type: string | null;
    metadata: any;
    createdAt: Date;
}

interface ChatMessage {
    id: string;
    sender: "me" | "them";
    text: string;
    time: string;
    type: "text" | "locked_vision" | "gift";
    price?: string;
    preview?: string;
    description?: string;
    unlocked?: boolean;
    giftAmount?: string;
}

export async function loader({ request }: { request: Request }) {
    try {
        const userId = await requireUserId(request);

        // Fetch all conversations for the current user
        const dbConversations = await db.query.conversations.findMany({
            where: or(
                eq(conversations.participantOneId, userId),
                eq(conversations.participantTwoId, userId)
            ),
            orderBy: [desc(conversations.lastMessageAt)]
        });

        const enrichedConversations = await Promise.all(dbConversations.map(async (conv: DbConversation) => {
            const otherParticipantId = conv.participantOneId === userId ? conv.participantTwoId : conv.participantOneId;
            const otherProfile = await db.query.profiles.findFirst({
                where: eq(profiles.id, otherParticipantId)
            });

            const chatMessages = await db.query.messages.findMany({
                where: eq(messages.conversationId, conv.id),
                orderBy: [asc(messages.createdAt)]
            });

            return {
                id: conv.id,
                user: {
                    name: otherProfile?.name || "Anonymous",
                    tag: `@${otherProfile?.tag || 'essence'}`,
                    avatar: otherProfile?.name ? otherProfile.name.substring(0, 2).toUpperCase() : "U",
                    status: "Online", // Mocked for now
                    tier: otherProfile?.persona === 'creator' ? 'Sovereign' : 'Fan',
                    resonance: parseFloat(otherProfile?.resonanceScore?.toString() || "100")
                },
                chat: chatMessages.map((m: DbMessage) => ({
                    id: m.id,
                    sender: m.senderId === userId ? "me" : "them",
                    text: m.content || "",
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: m.type as "text" | "locked_vision" | "gift",
                    ...(m.metadata as any)
                }))
            };
        }));

        return {
            conversations: enrichedConversations,
            userId
        };
    } catch (error: any) {
        if (error instanceof Response) throw error;
        console.error("Messages Loader Failure:", error);
        throw new Response(`Whisper Calibration Failed: ${error?.message || error}`, { status: 500 });
    }
}

export async function action({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "send_message") {
        const conversationId = formData.get("conversationId") as string;
        const content = formData.get("content") as string;
        const type = formData.get("type") as string || "text";
        const metadata = JSON.parse(formData.get("metadata") as string || "{}");

        const [newMessage] = await db.insert(messages).values({
            conversationId,
            senderId: userId,
            content,
            type: type as any,
            metadata
        }).returning();

        // Update conversation lastMessageAt
        await db.update(conversations).set({
            lastMessageAt: new Date()
        }).where(eq(conversations.id, conversationId));

        return { success: true, message: newMessage };
    }

    return { success: false };
}

export default function PrivateSanctuary() {
    const { conversations: initialConversations, userId } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

    const [conversations, setConversations] = useState(initialConversations);
    const [activeId, setActiveId] = useState(initialConversations.length > 0 ? initialConversations[0].id : null);
    const [messageInput, setMessageInput] = useState("");
    const [isUnlocking, setIsUnlocking] = useState<string | null>(null);
    const [reactions, setReactions] = useState<{ id: string; x: number; y: number }[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Update local state when loader data changes
    useEffect(() => {
        setConversations(initialConversations);
        if (!activeId && initialConversations.length > 0) {
            setActiveId(initialConversations[0].id);
        }
    }, [initialConversations]);

    const activeConv = conversations.find(c => c.id === activeId) || null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeId, conversations]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeId) return;

        const formData = new FormData();
        formData.append("intent", "send_message");
        formData.append("conversationId", activeId);
        formData.append("content", messageInput);
        formData.append("type", "text");
        formData.append("metadata", JSON.stringify({}));

        fetcher.submit(formData, { method: "POST" });
        setMessageInput("");

        // Optimistic UI update
        const optimisticMsg = {
            id: `opt-${Date.now()}`,
            sender: "me",
            text: messageInput,
            time: "Sending...",
            type: "text" as const
        };
        setConversations(prev => prev.map(c =>
            c.id === activeId ? { ...c, chat: [...c.chat, optimisticMsg] } : c
        ));
    };

    const handleUnlock = (msgId: string) => {
        setIsUnlocking(msgId);
        // Real unlock logic would happen via ledger/action
        setTimeout(() => {
            setIsUnlocking(null);
            showToast("Vision Resonance Unlocked");
        }, 2000);
    };

    const handleGift = () => {
        if (!activeId) return;
        const giftAmount = "₦5,000";
        const formData = new FormData();
        formData.append("intent", "send_message");
        formData.append("conversationId", activeId);
        formData.append("content", `Sent a gift of ${giftAmount}`);
        formData.append("type", "gift");
        formData.append("metadata", JSON.stringify({ giftAmount }));

        fetcher.submit(formData, { method: "POST" });

        // Trigger floating heart explosion
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                setReactions(prev => [...prev, {
                    id: `heart-${Date.now()}-${i}`,
                    x: Math.random() * 300 + 400,
                    y: Math.random() * 200 + 400
                }]);
            }, i * 100);
        }
        setTimeout(() => setReactions([]), 3000);
        showToast("Glimpse Gifted Successfully");
    };

    const handleSendLocked = () => {
        if (!activeId) return;
        const formData = new FormData();
        formData.append("intent", "send_message");
        formData.append("conversationId", activeId);
        formData.append("content", "Locked Vision Shared");
        formData.append("type", "locked_vision");
        formData.append("metadata", JSON.stringify({
            price: "₦25,000",
            preview: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            description: "The Unseen Ritual (Locked)",
            unlocked: false
        }));

        fetcher.submit(formData, { method: "POST" });
        showToast("Locked Vision Transmitted");
    };

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden font-display pt-4">
            {/* Global Context Indicator */}
            <div className="fixed top-20 left-6 z-[60] animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Whisper Room</h2>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-zinc-800/20 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-zinc-900/40 rounded-full blur-[160px]"></div>
            </div>

            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4 text-center">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {toast}
                </div>
            )}

            <div className="w-full md:max-w-[1800px] h-full flex relative z-10 px-0 md:px-6 md:py-8 gap-0 md:gap-8 overflow-x-hidden">

                {/* 1. The Sanctuary List */}
                <aside className={`w-full md:w-96 flex flex-col gap-6 h-full animate-entrance ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} px-6 py-8 md:px-0 md:py-0`}>
                    <header className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Private Sanctuary</h3>
                        </div>
                        <div className="relative">
                            <input
                                placeholder="Search Connections..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-[11px] font-bold italic outline-none focus:border-primary/40 shadow-none transition-all text-white placeholder:text-zinc-700"
                            />
                        </div>
                    </header>

                    <div className="flex-grow overflow-y-auto scrollbar-hide space-y-3 pb-24">
                        {conversations.length > 0 ? conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setActiveId(conv.id);
                                    setMobileView("chat");
                                }}
                                className={`w-full p-5 rounded-[2.5rem] border transition-all flex items-center gap-4 group text-left ${activeId === conv.id ? 'bg-white border-white text-black shadow-xl' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                            >
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black italic shadow-sm transition-transform group-hover:scale-110 ${activeId === conv.id ? 'bg-black/5' : 'bg-zinc-800 border border-zinc-700'}`}>
                                        {conv.user.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${activeId === conv.id ? 'border-white' : 'border-black'} bg-emerald-500`}></div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-[11px] font-black uppercase tracking-widest truncate ${activeId === conv.id ? 'text-black' : 'text-zinc-100'}`}>{conv.user.name}</h4>
                                    </div>
                                    <p className={`text-[10px] font-bold italic truncate ${activeId === conv.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                        {conv.chat.length > 0 ? (
                                            conv.chat[conv.chat.length - 1].type === 'locked_vision' ? "Sent a Locked Vision" : conv.chat[conv.chat.length - 1].type === 'gift' ? `Gifted ${conv.chat[conv.chat.length - 1].giftAmount}` : conv.chat[conv.chat.length - 1].text
                                        ) : "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 opacity-40">
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" /></svg>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence in the Sanctuary</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* 2. The Whisper Room */}
                <main className={`flex-grow flex flex-col bg-zinc-900/20 md:rounded-[4rem] md:border md:border-zinc-800 md:shadow-none relative overflow-hidden animate-entrance [animation-delay:100ms] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'} h-full md:h-auto`}>
                    <div className="absolute inset-0 pointer-events-none z-50">
                        {reactions.map(r => (
                            <div key={r.id} className="absolute animate-float-up text-4xl filter drop-shadow-2xl" style={{ left: r.x, top: r.y }}>❤️</div>
                        ))}
                    </div>

                    {activeConv ? <>
                        <header className="px-6 md:px-10 py-6 md:py-8 border-b border-zinc-800 flex items-center justify-between bg-black/50 backdrop-blur-md z-20">
                            <div className="flex items-center gap-4 md:gap-6">
                                <button
                                    onClick={() => setMobileView("list")}
                                    className="md:hidden w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-[1.2rem] md:rounded-[1.8rem] flex items-center justify-center text-black text-xs md:text-sm font-black italic shadow-lg">
                                    {activeConv.user.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <h3 className="text-lg md:text-xl font-black italic text-white tracking-tighter leading-none">{activeConv.user.name}</h3>
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest">{activeConv.user.tier}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Online • {activeConv.user.resonance}%</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto scrollbar-hide p-6 md:p-10 space-y-6 md:space-y-8 bg-black/40"
                        >
                            {activeConv.chat.map((msg: ChatMessage) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2`}>
                                    {msg.type === 'text' ? (
                                        <div className={`max-w-[85%] md:max-w-[70%] p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] text-[12px] md:text-[13px] font-bold leading-relaxed shadow-none transition-all ${msg.sender === 'me' ? 'bg-white text-black rounded-tr-none' : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none italic'}`}>
                                            {msg.text}
                                        </div>
                                    ) : msg.type === 'gift' ? (
                                        <div className="bg-gradient-to-br from-primary to-violet-600 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-none flex flex-col items-center gap-2 md:gap-3">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center text-xl md:text-2xl">💝</div>
                                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Resonance Gift</p>
                                            <p className="text-xl md:text-2xl font-black italic">{msg.giftAmount}</p>
                                        </div>
                                    ) : (
                                        <div className="max-w-xs md:max-w-md w-full bg-zinc-900 rounded-[2rem] md:rounded-[3rem] border border-zinc-800 overflow-hidden shadow-none group/vision">
                                            <div className="relative aspect-video bg-black">
                                                <img
                                                    src={msg.preview}
                                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[3s] ${!msg.unlocked ? 'blur-3xl grayscale brightness-50' : 'group-hover/vision:scale-110'}`}
                                                    alt=""
                                                />
                                                {!msg.unlocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 bg-black/60 backdrop-blur-sm">
                                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white mb-2 md:mb-4 shadow-2xl animate-pulse">
                                                            <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnlock(msg.id)}
                                                            disabled={isUnlocking === msg.id}
                                                            className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-none hover:bg-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {isUnlocking === msg.id ? "Resonating..." : `Unlock Vision • ${msg.price}`}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 md:p-6 flex justify-between items-center bg-zinc-900">
                                                <div className="space-y-0.5">
                                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">The Altar Collection</p>
                                                    <p className="text-[10px] md:text-[11px] font-black text-white italic">{msg.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <span className={`text-[7px] md:text-[8px] font-black text-zinc-600 mt-2 uppercase tracking-widest ${msg.sender === 'me' ? 'mr-1 md:mr-2' : 'ml-1 md:ml-2'}`}>{msg.time}</span>
                                </div>
                            ))}
                        </div>

                        <footer className="p-4 md:p-8 border-t border-zinc-800 bg-black/60 backdrop-blur-md z-20">
                            <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
                                <div className="flex-grow relative group/composer">
                                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2 flex items-end shadow-none focus-within:border-zinc-700 transition-all">
                                        <textarea
                                            rows={1}
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                            placeholder="Whisper..."
                                            className="flex-grow bg-transparent border-none outline-none py-3 md:py-4 px-3 md:px-4 text-[12px] md:text-[13px] font-bold italic text-white placeholder:text-zinc-700 resize-none min-h-[48px] max-h-32"
                                        />
                                        <div className="flex items-center p-1 gap-1">
                                            <button
                                                onClick={handleSendMessage}
                                                className="w-10 h-10 bg-white text-black rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-none active:scale-95"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-[18px] md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </> : (
                        <div className="flex-grow flex items-center justify-center text-zinc-700 uppercase tracking-[0.5em] text-[10px] font-black italic">
                            Select a Frequency to Start
                        </div>
                    )}
                </main>

                {/* 3. The Resonance Profile */}
                <aside className={`hidden xl:flex flex-col w-80 h-full animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]`}>
                    {activeConv && (
                        <div className="bg-zinc-900/40 rounded-[4rem] border border-zinc-800 p-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-black text-3xl font-black italic shadow-2xl mb-6">
                                {activeConv.user.avatar}
                            </div>
                            <h4 className="text-2xl font-black italic text-white tracking-tighter">{activeConv.user.name}</h4>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 mb-8">{activeConv.user.tag}</p>

                            <div className="w-full space-y-4 pt-10 border-t border-zinc-800">
                                <button
                                    onClick={handleGift}
                                    className="w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                >
                                    Gift Glimpse
                                </button>
                                <button
                                    onClick={handleSendLocked}
                                    className="w-full py-4 border border-zinc-800 text-zinc-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all"
                                >
                                    Transmit Vision
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
