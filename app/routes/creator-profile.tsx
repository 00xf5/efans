import { useState, useRef, memo } from "react";
import { Link, useParams } from "react-router";

const CREATOR_DATA = {
    v_noir: {
        name: "Valentina Noir",
        handle: "@v_noir",
        bio: "Architecture of shadows. Narrative of silence. Exploring the intersection of high-fashion and midnight sequences.",
        avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        stats: { adored: "128k", visions: "1.2k", whispers: "92k" },
        tags: ["Midnight Art", "Tactile Silence", "High Fidelity"],
        isFollowing: true
    }
};

const MOCK_MOMENTS = [
    {
        id: "v1",
        type: "EXCLUSIVE",
        time: "2h ago",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        locked: true,
        price: "$10"
    },
    {
        id: "v2",
        type: "GLIMPSE",
        time: "10h ago",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800",
        locked: false
    },
    {
        id: "v3",
        type: "VISION",
        time: "1d ago",
        image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800",
        locked: false
    },
    {
        id: "v4",
        type: "TACTILE",
        time: "3d ago",
        image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800",
        locked: true,
        price: "$25"
    },
    {
        id: "v5",
        type: "EXCLUSIVE",
        time: "4d ago",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=801",
        locked: true,
        price: "$15"
    },
    {
        id: "v6",
        type: "GLIMPSE",
        time: "1w ago",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=801",
        locked: false
    }
];

const MOCK_REELS = [
    {
        id: "r1",
        name: "Valentina Noir",
        video: "https://player.vimeo.com/external/433870681.sd.mp4?s=0183386055d7b567b5e4c8bc45b7367f08df8576&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "r2",
        name: "Valentina Noir",
        video: "https://player.vimeo.com/external/459389137.sd.mp4?s=87ae19dc810ea2a0a1f9e2b02713f01b7a2d677d&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "r3",
        name: "Valentina Noir",
        video: "https://player.vimeo.com/external/517090025.sd.mp4?s=d74944d6c1b3437537b03657cd33116819b1652d&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "r4",
        name: "Valentina Noir",
        video: "https://player.vimeo.com/external/371433846.sd.mp4?s=231da6ab3a074c053174548480749e4d56f6ce4e&profile_id=139&oauth2_token_id=57447761",
        poster: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=400",
    }
];

const MOCK_WHISPERS = [
    { id: "w1", content: "The shadows are lengthening in the studio. Session starting in 10.", time: "2h ago", likes: 124, whispers: 12 },
    { id: "w2", content: "Thinking about the theme for next week's 'Midnight Sequence'. Any desires?", time: "22h ago", likes: 842, whispers: 95 },
    { id: "w3", content: "New vision dropping at midnight. Be ready.", time: "2d ago", likes: "1.2k", whispers: 210 },
];

const MOCK_COLLECTIBLES = [
    { id: "c1", name: "Midnight Silhouette #01", price: "2.4 ETH", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800", type: "Digital Artifact" },
    { id: "c2", name: "The Velvet Void", price: "1.8 ETH", image: "https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&q=80&w=800", type: "Ephemeral Fragment" },
    { id: "c3", name: "Tactile Silence", price: "3.5 ETH", image: "https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=800", type: "Core Genesis" },
];

export default function CreatorProfile() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("Visions");
    const [visions, setVisions] = useState(MOCK_MOMENTS);
    const [showSubModal, setShowSubModal] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const creator = CREATOR_DATA.v_noir; // Defaulting to Valentina for demo

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleUnlockVision = (id: string) => {
        setIsUnlocking(id);
        setTimeout(() => {
            setVisions(prev => prev.map(v => v.id === id ? { ...v, locked: false } : v));
            setIsUnlocking(null);
        }, 1500);
    };

    return (
        <div className="relative w-full h-full bg-white text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden">
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
                            <Link to="/timeline" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 transition-all font-bold group">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-pink-500 transition-colors"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                                <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                            </Link>
                            <Link to="/messages" className="flex items-center gap-4 px-5 py-3 hover:bg-pink-50 rounded-2xl text-pink-900/60 transition-all font-bold group">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-pink-500 transition-colors"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                <span className="text-[11px] font-black uppercase tracking-widest">Whispers</span>
                            </Link>
                        </nav>
                        <div className="mt-auto p-5 glass-card rounded-[2rem] border-pink-100 flex items-center gap-4 mb-8 shadow-pink-100/30">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-black">U2</div>
                        </div>
                    </aside>

                    {/* Main Creator Profile */}
                    <main className="flex-grow max-w-2xl h-full overflow-y-auto scrollbar-hide flex flex-col pt-8">
                        {/* Cover & Profile Identity */}
                        <div className="relative flex-shrink-0 group">
                            <div className="h-64 rounded-[3.5rem] overflow-hidden border border-pink-100 shadow-2xl relative">
                                <img src={creator.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent"></div>

                                {/* Overlay Stats */}
                                <div className="absolute bottom-8 right-12 flex gap-8">
                                    {Object.entries(creator.stats).map(([k, v]) => (
                                        <div key={k} className="text-center">
                                            <p className="text-white font-black text-xl leading-none">{v}</p>
                                            <p className="text-pink-100 text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">{k}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Avatar Float */}
                            <div className="absolute -bottom-12 left-12 flex items-end gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
                                    <img src={creator.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-white relative z-10 shadow-2xl" alt="" />
                                </div>
                                <div className="pb-4">
                                    <h1 className="text-3xl text-premium italic text-pink-900 leading-none">{creator.name}</h1>
                                    <p className="text-pink-400 text-sm font-bold tracking-widest mt-2">{creator.handle}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio & Actions */}
                        <div className="mt-20 px-4 space-y-8 flex-shrink-0">
                            <div className="flex justify-between items-start gap-12">
                                <p className="text-zinc-600 font-medium leading-relaxed italic text-lg max-w-md">
                                    "{creator.bio}"
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowSubModal(true)}
                                        className="bg-pink-500 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-pink-200 hover:bg-pink-600 transition-all active:scale-95 flex items-center gap-3"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        Fuel the Altar
                                    </button>
                                    <Link to="/messages" className="w-14 h-14 bg-white border border-pink-100 rounded-3xl flex items-center justify-center hover:bg-pink-50 transition-all shadow-sm text-pink-500">
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H17.5C20 5 22 7 22 9.5V17Z" /><path d="m2 9 8.244 4.523a4 4 0 0 0 3.512 0L22 9" /></svg>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {creator.tags.map(t => (
                                    <span key={t} className="px-5 py-2 rounded-full border border-pink-100 text-[9px] font-black uppercase tracking-widest text-pink-400 bg-pink-50/20">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content Feed Tabs */}
                        <div className="mt-12 sticky top-0 z-20 bg-white/80 backdrop-blur-3xl border-b border-pink-50 py-4 px-2">
                            <div className="flex gap-4">
                                {["Visions", "Glimpses", "Whispers", "Collectibles"].map(tab => (
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
                                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {visions.map((item) => (
                                        <div key={item.id} className="glass-card rounded-[2.5rem] overflow-hidden group/item cursor-pointer shadow-xl shadow-pink-100/20">
                                            <div className="relative aspect-[3/4]">
                                                <img src={item.image} className={`absolute inset-0 w-full h-full object-cover transition-all duration-[4s] group-hover/item:scale-110 ${item.locked ? 'blur-3xl grayscale brightness-[0.7]' : ''}`} alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-40"></div>

                                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{item.type} • {item.time}</span>
                                                </div>

                                                {item.locked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-pink-900/20 backdrop-blur-sm group-hover/item:backdrop-blur-none transition-all duration-700">
                                                        <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white mb-4 group-hover/item:scale-110 transition-transform shadow-2xl">
                                                            {isUnlocking === item.id ? (
                                                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-pulse"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>
                                                            ) : (
                                                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                            )}
                                                        </div>
                                                        <button
                                                            disabled={isUnlocking !== null}
                                                            onClick={(e) => { e.stopPropagation(); handleUnlockVision(item.id); }}
                                                            className="bg-white text-pink-900 px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-pink-50 transition-colors flex items-center gap-3"
                                                        >
                                                            {isUnlocking === item.id ? (
                                                                <>
                                                                    <span className="w-2.5 h-2.5 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></span>
                                                                    Resonating...
                                                                </>
                                                            ) : `Reveal for ${item.price}`}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "Glimpses" && (
                                <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {MOCK_REELS.map((reel) => (
                                        <div key={reel.id} className="relative aspect-[9/16] rounded-[2rem] overflow-hidden glass-card group/glimpse cursor-pointer">
                                            <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-pink-900/10 group-hover/glimpse:bg-transparent transition-colors"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "Whispers" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {MOCK_WHISPERS.map((whisper) => (
                                        <div key={whisper.id} className="glass-card p-8 rounded-[2.5rem] border-pink-50 space-y-4 hover:bg-pink-50/10 transition-colors">
                                            <p className="text-zinc-700 font-medium italic leading-relaxed text-lg">"{whisper.content}"</p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{whisper.time}</span>
                                                <div className="flex gap-6">
                                                    <span className="text-[10px] font-black text-pink-400">❤️ {whisper.likes}</span>
                                                    <span className="text-[10px] font-black text-pink-400">💬 {whisper.whispers}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "Collectibles" && (
                                <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {MOCK_COLLECTIBLES.map((nft) => (
                                        <div key={nft.id} className="glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-pink-100/30 group/artifact">
                                            <div className="w-full md:w-1/2 aspect-square relative overflow-hidden">
                                                <img src={nft.image} className="absolute inset-0 w-full h-full object-cover group-hover/artifact:scale-110 transition-transform duration-[5s]" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 to-transparent"></div>
                                            </div>
                                            <div className="p-10 flex flex-col justify-center space-y-6 md:w-1/2">
                                                <div>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400">{nft.type}</span>
                                                    <h3 className="text-3xl text-premium italic text-pink-900 mt-2 leading-tight">{nft.name}</h3>
                                                </div>
                                                <div className="flex items-center justify-between align-bottom">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase text-zinc-300 tracking-widest">Reserve Price</p>
                                                        <p className="text-2xl font-black text-zinc-900">{nft.price}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => showToast(`Artifact ${nft.name} Reserved`)}
                                                        className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-pink-600 transition-all active:scale-95"
                                                    >
                                                        Acquire
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Rail Doomscroll (Creator Specific Flow) */}
                    <aside className="hidden xl:flex flex-col w-80 py-8 h-full space-y-8 bg-pink-50/20 px-4 border-x border-pink-50">
                        <div className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">Live Flow</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                        </div>
                        <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide pb-32 relative" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                            {MOCK_REELS.map((reel) => (
                                <div key={reel.id} className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-pink-100 group/reel cursor-pointer shadow-xl transition-all">
                                    <video src={reel.video} poster={reel.poster} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-pink-900/20"></div>
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <h5 className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none">{reel.name}</h5>
                                    </div>
                                </div>
                            ))}
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
                                        {tier.title === "Bronze Spark" ? (
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1.232-3.21.316-.36.468-.54.268-1.79-.15.75.1.75.5 1.5.5.938.5 1.5 0 2.5Z" /></svg>
                                        ) : tier.title === "Silver Surge" ? (
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m13 2-2 10h8L7 22l2-10H1L13 2Z" /></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Zm3 16h14" /></svg>
                                        )}
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
                                            setShowSubModal(false);
                                            showToast(`Subscribed to ${tier.title} • Altar Fueled`);
                                        }}
                                        className={`w-full py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${tier.recommended ? 'bg-pink-500 text-white shadow-xl shadow-pink-200 hover:bg-pink-600' : 'bg-zinc-900 text-white hover:bg-black'}`}
                                    >
                                        subscribe
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
