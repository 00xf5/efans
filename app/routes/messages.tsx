import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";

// --- Sovereign Design Language: Type Definitions ---

interface ChatMessage {
    id: number;
    sender: string;
    text?: string;
    time: string;
    type: "text" | "locked_vision" | "gift";
    price?: string;
    preview?: string;
    description?: string;
    unlocked?: boolean;
    giftAmount?: string;
}

interface Conversation {
    id: string;
    user: {
        name: string;
        tag: string;
        avatar: string;
        status: string;
        tier: string;
        resonance: number;
    };
    chat: ChatMessage[];
}

// --- Sovereign Design Language: High-Fidelity Mock Data ---

const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: "c1",
        user: {
            name: "Valentina Noir",
            tag: "@valen_noir",
            avatar: "VN",
            status: "Online",
            tier: "Sovereign Soul",
            resonance: 98
        },
        chat: [
            { id: 1, sender: "them", text: "The resonance from the last Vision was... unexpected. Did you feel it too?", time: "10:24 AM", type: "text" },
            { id: 2, sender: "me", text: "It felt like a new frequency entirely. I've been re-watching it all morning.", time: "10:25 AM", type: "text" },
            { id: 3, sender: "them", text: "I have something even more intimate for you. A fragment of the next sequence.", time: "10:26 AM", type: "text" },
            {
                id: 4,
                sender: "them",
                type: "locked_vision",
                price: "₦15,000",
                preview: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
                description: "The Midnight Descent (Exclusive)",
                time: "10:27 AM",
                unlocked: false
            },
        ]
    },
    {
        id: "c2",
        user: {
            name: "Sienna Ray",
            tag: "@sienna_rayly",
            avatar: "SR",
            status: "Away",
            tier: "Silver Surge",
            resonance: 84
        },
        chat: [
            { id: 1, sender: "them", text: "Don't forget the live resonance tonight.", time: "Yesterday", type: "text" },
            { id: 2, sender: "me", text: "I'll be there, front row calibration.", time: "Yesterday", type: "text" },
        ]
    }
];

export default function PrivateSanctuary() {
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);
    const [messageInput, setMessageInput] = useState("");
    const [persona, setPersona] = useState<"fan" | "creator">("fan");
    const [isUnlocking, setIsUnlocking] = useState<number | null>(null);
    const [reactions, setReactions] = useState<{ id: number; x: number; y: number }[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

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
        if (!messageInput.trim()) return;
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "text"
        };

        setConversations(prev => prev.map(c =>
            c.id === activeId ? { ...c, chat: [...c.chat, newMessage] } : c
        ));
        setMessageInput("");
    };

    const handleUnlock = (msgId: number) => {
        setIsUnlocking(msgId);
        setTimeout(() => {
            setConversations(prev => prev.map(c => ({
                ...c,
                chat: c.chat.map(m => m.id === msgId ? { ...m, unlocked: true } : m)
            })));
            setIsUnlocking(null);
            showToast("Vision Resonance Unlocked");
        }, 2000);
    };

    const handleGift = () => {
        const giftMsg: ChatMessage = {
            id: Date.now(),
            sender: "me",
            type: "gift",
            giftAmount: "₦5,000",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setConversations(prev => prev.map(c =>
            c.id === activeId ? { ...c, chat: [...c.chat, giftMsg] } : c
        ));

        // Trigger floating heart explosion
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                setReactions(prev => [...prev, {
                    id: Date.now() + i,
                    x: Math.random() * 300 + 400,
                    y: Math.random() * 200 + 400
                }]);
            }, i * 100);
        }
        setTimeout(() => setReactions([]), 3000);
        showToast("Glimpse Gifted Successfully");
    };

    const handleSupport = () => {
        showToast("Resonance Support Protocol Active...");
        setTimeout(() => {
            handleGift();
        }, 1000);
    };

    const handleSendLocked = () => {
        if (persona !== 'creator') return;
        const lockedMsg: ChatMessage = {
            id: Date.now(),
            sender: "me",
            type: "locked_vision",
            price: "₦25,000",
            preview: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            description: "The Unseen Ritual (Locked)",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unlocked: false
        };
        setConversations(prev => prev.map(c =>
            c.id === activeId ? { ...c, chat: [...c.chat, lockedMsg] } : c
        ));
        showToast("Locked Vision Transmitted");
    };

    return (
        <div className="relative w-full h-screen bg-black text-white flex justify-center selection:bg-primary/20 overflow-hidden font-display pt-4">
            {/* Global Context Indicator - Professional & Visible */}
            <div className="fixed top-20 left-6 z-[60] animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Whisper Room</h2>
                </div>
            </div>
            {/* Ambient Background Resonance spirit */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-zinc-800/20 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-zinc-900/40 rounded-full blur-[160px]"></div>
            </div>

            {/* Live Feedback Toast */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {toast}
                </div>
            )}

            <div className="w-full md:max-w-[1800px] h-full flex relative z-10 px-0 md:px-6 md:py-8 gap-0 md:gap-8 overflow-x-hidden">

                {/* 1. The Sanctuary List (Conversations) */}
                <aside className={`w-full md:w-96 flex flex-col gap-6 h-full animate-entrance ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} px-6 py-8 md:px-0 md:py-0`}>
                    <header className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Private Sanctuary</h3>
                            <button
                                onClick={() => {
                                    setPersona(p => p === 'fan' ? 'creator' : 'fan');
                                    showToast(`Calibration: ${persona === 'fan' ? 'Creator' : 'Fan'} Perspective`);
                                }}
                                className="text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
                            >
                                Switch Perspective
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                placeholder="Search Connections..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-[11px] font-bold italic outline-none focus:border-primary/40 shadow-none transition-all text-white placeholder:text-zinc-600"
                            />
                            <svg className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </header>

                    <div className="flex-grow overflow-y-auto scrollbar-hide space-y-3 pb-24">
                        {conversations.map((conv) => (
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
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${activeId === conv.id ? 'border-white' : 'border-black'} ${conv.user.status === 'Online' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-[11px] font-black uppercase tracking-widest truncate ${activeId === conv.id ? 'text-black' : 'text-zinc-100'}`}>{conv.user.name}</h4>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${activeId === conv.id ? 'text-zinc-500' : 'text-zinc-600'}`}>Active</span>
                                    </div>
                                    <p className={`text-[10px] font-bold italic truncate ${activeId === conv.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                        {conv.chat[conv.chat.length - 1].type === 'locked_vision' ? "Sent a Locked Vision" : conv.chat[conv.chat.length - 1].type === 'gift' ? `Gifted ${conv.chat[conv.chat.length - 1].giftAmount}` : conv.chat[conv.chat.length - 1].text}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* 2. The Whisper Room (Active Chat) */}
                <main className={`flex-grow flex flex-col bg-zinc-900/20 md:rounded-[4rem] md:border md:border-zinc-800 md:shadow-none relative overflow-hidden animate-entrance [animation-delay:100ms] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'} h-full md:h-auto`}>
                    {/* Floating Reactions Layer */}
                    <div className="absolute inset-0 pointer-events-none z-50">
                        {reactions.map(r => (
                            <div key={r.id} className="absolute animate-float-up text-4xl filter drop-shadow-2xl" style={{ left: r.x, top: r.y }}>❤️</div>
                        ))}
                    </div>

                    {/* Header */}
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
                                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">{activeConv.user.status} • {activeConv.user.resonance}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                            </button>
                        </div>
                    </header>

                    {/* Chat Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-grow overflow-y-auto scrollbar-hide p-6 md:p-10 space-y-6 md:space-y-8 bg-black/40"
                    >
                        {activeConv.chat.map((msg) => (
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
                                                    <h5 className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-widest text-center mb-4 md:mb-6">{msg.description}</h5>
                                                    <button
                                                        onClick={() => handleUnlock(msg.id)}
                                                        disabled={isUnlocking === msg.id}
                                                        className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-none hover:bg-primary hover:text-white transition-all flex items-center gap-2 md:gap-3 disabled:opacity-50"
                                                    >
                                                        {isUnlocking === msg.id ? (
                                                            <>
                                                                <span className="w-2 md:w-3 h-2 md:h-3 border-2 border-zinc-200 border-t-primary rounded-full animate-spin"></span>
                                                                Resonating...
                                                            </>
                                                        ) : `Unlock Vision • ${msg.price}`}
                                                    </button>
                                                </div>
                                            )}
                                            {msg.unlocked && (
                                                <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2">
                                                    <span className="bg-primary text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg h-min">Unlocked</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 md:p-6 flex justify-between items-center bg-zinc-900">
                                            <div className="space-y-0.5 md:space-y-1">
                                                <p className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">The Altar Collection</p>
                                                <p className="text-[9px] md:text-[11px] font-black text-white italic">{msg.description}</p>
                                            </div>
                                            {msg.unlocked && (
                                                <button className="text-zinc-600 hover:text-white transition-colors">
                                                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <span className={`text-[7px] md:text-[8px] font-black text-zinc-600 mt-2 uppercase tracking-widest ${msg.sender === 'me' ? 'mr-1 md:mr-2' : 'ml-1 md:ml-2'}`}>{msg.time}</span>
                            </div>
                        ))}
                    </div>

                    {/* Composer Area */}
                    <footer className="p-4 md:p-8 border-t border-zinc-800 bg-black/60 backdrop-blur-md z-20">
                        <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
                            <div className="flex-grow relative group/composer">
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2 flex items-end shadow-none focus-within:border-zinc-700 transition-all">
                                    <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg>
                                    </button>
                                    <textarea
                                        rows={1}
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                        placeholder="Whisper..."
                                        className="flex-grow bg-transparent border-none outline-none py-3 md:py-4 px-1 md:px-2 text-[12px] md:text-[13px] font-bold italic text-white placeholder:text-zinc-700 resize-none min-h-[48px] max-h-32 md:max-h-48"
                                    />
                                    <div className="flex items-center p-1 gap-1">
                                        {persona === 'fan' ? (
                                            <button
                                                onClick={handleSupport}
                                                className="h-8 md:h-10 px-3 md:px-4 bg-zinc-800 text-white rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-1.5 md:gap-2"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" strokeWidth="3"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /><path d="M12 14v.01" /></svg>
                                                <span className="hidden sm:inline">Support</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSendLocked}
                                                className="h-8 md:h-10 px-3 md:px-4 bg-primary/20 text-primary rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 md:gap-2"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-4M12 14l-2 2M12 14l2 2" /></svg>
                                                <span className="hidden sm:inline">Locked</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={handleSendMessage}
                                            className="w-8 h-8 md:w-10 md:h-10 bg-white text-black rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-none active:scale-95"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>

                {/* 3. The Resonance Profile (Right Rail) */}
                <aside className="hidden xl:flex flex-col w-80 h-full animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                    <div className="bg-zinc-900/40 rounded-[4rem] border border-zinc-800 p-10 flex flex-col items-center text-center shadow-none">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-black text-3xl font-black italic shadow-2xl mb-6 ring-8 ring-zinc-900/50">
                            {activeConv.user.avatar}
                        </div>
                        <h4 className="text-2xl font-black italic text-white tracking-tighter">{activeConv.user.name}</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 mb-8">@{activeConv.user.name.toLowerCase().replace(' ', '')}</p>

                        <div className="grid grid-cols-2 gap-4 w-full mb-10">
                            <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-[11px] font-bold text-white">Active Soul</p>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Tier</p>
                                <p className="text-[11px] font-bold text-primary">Sovereign</p>
                            </div>
                        </div>

                        <div className="w-full space-y-4 pt-10 border-t border-zinc-800">
                            <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-4">Quick Resonance</h5>
                            <button
                                onClick={handleGift}
                                className="w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-none"
                            >
                                Gift Glimpse
                            </button>
                            <button
                                onClick={() => showToast("Resonance Reported for Sanitization")}
                                className="w-full py-4 border border-zinc-800 text-zinc-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all"
                            >
                                Report Resonance
                            </button>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
