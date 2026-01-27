import { useState, useMemo, memo } from "react";
import { Link } from "react-router";

// --- ROI-Focused Design Tokens ---

const MOCK_ROI_STATS = [
    { label: "Active Fuel", val: "₦12.8M", sub: "+14% this week", color: "from-emerald-500 to-teal-400", type: "currency" },
    { label: "Conversion Heat", val: "8.2%", sub: "Top 1% of Hub", color: "from-pink-500 to-rose-400", type: "percent" },
    { label: "Aegis Guard", val: "1,240", sub: "Bad actors neutralized", color: "from-blue-600 to-indigo-500", type: "count" },
    { label: "Growth Engine", val: "₦842k", sub: "Referral Income", color: "from-amber-500 to-orange-400", type: "rank" },
];

const RECENT_CONVERSIONS = [
    { id: 1, type: "Vision Unlock", fan: "User_842", amount: "+₦45,000", time: "2m ago", status: "success" },
    { id: 2, type: "Whisper Tip", fan: "Nexus_Prime", amount: "+₦120,000", time: "14m ago", status: "success" },
    { id: 3, type: "New Loyalty", fan: "Dark_Muse", amount: "+₦15,000/mo", time: "1h ago", status: "pending" },
    { id: 4, type: "Vision Unlock", fan: "Sensus_Fan", amount: "+₦25,000", time: "3h ago", status: "success" },
];

export default function ExperienceHub() {
    const [subPrice, setSubPrice] = useState(15000);
    const [activeView, setActiveView] = useState("overview");
    const [persona, setPersona] = useState<"creator" | "fan">("creator");
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [sovereignty, setSovereignty] = useState({ ghostComments: true, stealthMode: false, aggressiveSanitization: true });
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Vault & Bank State (Creator) ---
    const [bankAccount, setBankAccount] = useState({ bank: "GTBank", name: "Valentina Noir", number: "0123456789", verified: true });
    const [vaultBalance, setVaultBalance] = useState(4280000);

    // --- Apex Status Calculations ---
    const statusTier = useMemo(() => {
        if (vaultBalance > 10000000) return { label: "Sovereign Apex", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Zm3 16h14" /></svg>, color: "text-amber-500", shadow: "shadow-amber-500/20" };
        if (vaultBalance > 1000000) return { label: "Elite Hub", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M11 3 8 9l4 12 4-12-3-6" /><path d="M2 9h20" /></svg>, color: "text-blue-500", shadow: "shadow-blue-500/20" };
        return { label: "Rising Resonance", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813L4.275 10.725l5.813 1.912L12 18.45l1.912-5.813 5.813-1.912-5.813-1.912L12 3Z" /></svg>, color: "text-pink-500", shadow: "shadow-pink-500/20" };
    }, [vaultBalance]);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    // --- Wallet State (Fan) ---
    const [walletBalance, setWalletBalance] = useState(25000);
    const [addAmount, setAddAmount] = useState("");

    // Link/Edit Form State
    const [linkForm, setLinkForm] = useState({ bank: "GTBank", number: "0123456789", name: "Valentina Noir" });
    const [isVerifying, setIsVerifying] = useState(false);

    // --- Actions ---
    const closeModals = () => {
        setActiveModal(null);
        setIsVerifying(false);
        setIsExtracting(false);
    };

    const triggerEditBank = () => {
        setLinkForm({ bank: bankAccount.bank, number: bankAccount.number, name: bankAccount.name });
        setActiveModal('link_bank');
    };

    const handleLinkBank = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setBankAccount({ bank: linkForm.bank, name: linkForm.name, number: linkForm.number, verified: true });
            setIsVerifying(false);
            setActiveModal('withdraw');
            setWithdrawAmount("");
        }, 1500);
    };

    const handleWithdraw = () => {
        const amt = parseInt(withdrawAmount);
        if (!amt || amt <= 0 || amt > vaultBalance) return;

        setIsExtracting(true);
        setTimeout(() => {
            setVaultBalance(prev => prev - amt);
            setIsExtracting(false);
            setActiveModal(null);
            setWithdrawAmount("");
        }, 2000);
    };

    return (
        <div className="fixed inset-0 top-16 bg-[#FAFAFA] text-zinc-900 flex justify-center selection:bg-pink-100 overflow-hidden font-display w-full">
            {/* Resonance Feedback Altar */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {toast}
                </div>
            )}
            {/* Economic Aurora */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-50/40 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-50/30 rounded-full blur-[160px]"></div>
            </div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10 h-full overflow-x-hidden">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12 h-full overflow-x-hidden">

                    {/* Left Pillar: Navigation */}
                    <aside className="hidden lg:flex flex-col w-72 py-10 h-full overflow-y-auto scrollbar-hide">
                        <div className="space-y-12">
                            {/* Persona Switcher */}
                            <div className="px-5">
                                <div className="p-1 bg-zinc-100 rounded-[2rem] flex items-center relative gap-1 shadow-inner">
                                    <button
                                        onClick={() => setPersona('creator')}
                                        className={`flex-1 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all z-10 ${persona === 'creator' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    >
                                        Creator Hub
                                    </button>
                                    <button
                                        onClick={() => setPersona('fan')}
                                        className={`flex-1 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all z-10 ${persona === 'fan' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    >
                                        Fan Nexus
                                    </button>
                                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[1.8rem] transition-all duration-500 ease-out-back ${persona === 'fan' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mb-6">{persona === 'creator' ? 'Management' : 'Nexus Control'}</h4>
                                <nav className="space-y-2">
                                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3.5 bg-zinc-900 text-white rounded-3xl shadow-xl shadow-zinc-200 transition-all group">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Performance Hub</span>
                                    </Link>
                                    <Link to="/timeline" className="flex items-center gap-4 px-5 py-3.5 hover:bg-white border border-transparent hover:border-zinc-100 rounded-3xl text-zinc-400 hover:text-zinc-900 transition-all font-bold">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Visions Control</span>
                                    </Link>
                                </nav>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mb-6">Economy</h4>
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveModal('withdraw')}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white border border-transparent hover:border-zinc-100 rounded-3xl text-zinc-400 hover:text-zinc-900 transition-all font-bold text-left group"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Withdraw Fuel</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('link_bank')}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white border border-transparent hover:border-zinc-100 rounded-3xl text-zinc-400 hover:text-zinc-900 transition-all font-bold text-left group"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Vault Settings</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('split')}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white border border-transparent hover:border-zinc-100 rounded-3xl text-zinc-400 hover:text-zinc-900 transition-all font-bold text-left group"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-zinc-900 transition-colors">80/20 Revenue Split</span>
                                    </button>
                                </nav>
                            </div>

                            <div className="px-5 bg-pink-500/5 py-8 rounded-[2.5rem] mt-6 border border-pink-500/10">
                                <h4 className="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em] italic mb-4">Referral Engine</h4>
                                <p className="text-[10px] text-zinc-500 font-bold mb-4 leading-relaxed">Earn 10% of every creator you bring to the hub. Lifetime resonance.</p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText("https://fns.fan/ref/creator_apex");
                                        showToast("Referral Engine Vector Copied");
                                    }}
                                    className="w-full bg-pink-500 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-pink-200"
                                >
                                    Copy Referral Link
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content: The Hub */}
                    <main className="flex-grow py-10 h-full overflow-y-auto scrollbar-hide space-y-12 pb-32">
                        {persona === 'creator' ? (
                            <>
                                <header className="flex justify-between items-end animate-entrance">
                                    <div className="space-y-3">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1 bg-white border border-zinc-100 rounded-full shadow-lg ${statusTier.shadow} transition-all`}>
                                            <span className={`${statusTier.color}`}>{statusTier.icon}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusTier.color}`}>{statusTier.label}</span>
                                        </div>
                                        <h1 className="text-6xl text-premium italic text-zinc-900 leading-tight">Sovereign <span className="text-gradient">Control.</span></h1>
                                        <div className="flex items-center gap-4 text-zinc-400">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">This is YOUR Space</span>
                                            <div className="h-0.5 w-12 bg-blue-100 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 leading-none">Aegis Guard Active</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Net Revenue Share</span>
                                        <div className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                                            <span className="text-3xl font-black text-zinc-900">80<span className="text-pink-500">%</span></span>
                                        </div>
                                    </div>
                                </header>
                            </>
                        ) : (
                            <>
                                <header className="flex justify-between items-end animate-entrance">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-white border border-zinc-100 rounded-full shadow-lg shadow-violet-500/10 transition-all">
                                            <span className="text-violet-500">
                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Nexus Elite</span>
                                        </div>
                                        <h1 className="text-6xl text-premium italic text-zinc-900 leading-tight">Nexus <span className="text-gradient-fan">Collection.</span></h1>
                                        <div className="flex items-center gap-4 text-zinc-400">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Your Exclusive Access</span>
                                            <div className="h-0.5 w-12 bg-violet-100 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500 leading-none">24 Unlocked Visions</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveModal('add_funds')}
                                        className="flex flex-col items-end gap-2 group"
                                    >
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-violet-500 transition-colors">Spending Power</span>
                                        <div className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl shadow-sm group-hover:border-violet-200 transition-all">
                                            <span className="text-3xl font-black text-zinc-900 tabular-nums">₦{walletBalance.toLocaleString()}</span>
                                        </div>
                                    </button>
                                </header>

                                <div className="grid grid-cols-3 gap-8 animate-entrance [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                                    <div className="col-span-2 bg-white rounded-[4rem] border border-zinc-100 p-12 shadow-sm hover:shadow-xl transition-all shadow-zinc-100/50 group/nexus">
                                        <div className="flex justify-between items-center mb-8">
                                            <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] italic">Active Connections</h4>
                                            <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">Pro Status</span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { name: "Valentina Noir", sub: "₦15,000/mo", status: "Active", heat: 92, avatar: "VN" },
                                                { name: "Adrien Thorne", sub: "₦5,000/mo", status: "Expiring in 2d", statusColor: "text-amber-500", heat: 84, avatar: "AT" }
                                            ].map((sub) => (
                                                <div key={sub.name} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-violet-200 hover:bg-white transition-all group/sub cursor-pointer">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-white rounded-[1.8rem] border border-zinc-100 flex items-center justify-center text-sm font-black italic shadow-sm group-hover/sub:scale-110 transition-transform">{sub.avatar}</div>
                                                        <div>
                                                            <p className="text-[11px] font-black uppercase text-zinc-900 tracking-wider leading-none">{sub.name}</p>
                                                            <p className="text-[10px] text-zinc-400 font-bold italic mt-2">{sub.sub}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${sub.statusColor || 'text-emerald-500'}`}>{sub.status}</span>
                                                        <div className="w-32 h-1 bg-zinc-200 rounded-full mt-3 overflow-hidden">
                                                            <div className="h-full bg-violet-500 rounded-full group-hover/sub:bg-pink-500 transition-colors" style={{ width: `${sub.heat}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[4rem] p-12 text-white flex flex-col justify-between relative overflow-hidden group/perk">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                                        <div className="space-y-4 relative z-10">
                                            <h4 className="text-[10px] font-black text-violet-200 uppercase tracking-[0.4em] italic leading-none">Nexus Perk</h4>
                                            <h3 className="text-3xl text-premium italic leading-tight">Priority <br />Sanctuary.</h3>
                                            <p className="text-violet-100/60 text-[11px] font-bold leading-relaxed italic">Your membership ensures ultra-low latency vision unlocks and priority DM resonance.</p>
                                        </div>
                                        <button
                                            onClick={() => showToast("Whisper Received: New Glimpse Protocol Initiated")}
                                            className="w-full py-5 bg-white text-violet-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-indigo-900/40 relative z-10"
                                        >
                                            Claim Daily Whisper
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Apex Stats Grid */}
                        <div className="grid grid-cols-4 gap-6 animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                            {(persona === 'creator' ? MOCK_ROI_STATS : [
                                { label: "Total Contributed", val: "₦85.4k", sub: "+₦12k this month", color: "from-violet-500/20" },
                                { label: "Unlocked Visions", val: "142", sub: "24 new in Nexus", color: "from-emerald-500/20" },
                                { label: "Resonance Level", val: "92", sub: "Top 5% Hub Member", color: "from-pink-500/20" },
                                { label: "Sovereign Tier", val: "Gold", sub: "Priority Resonance", color: "from-amber-500/20" }
                            ]).map((stat) => (
                                <div key={stat.label} className="bg-white p-8 rounded-[3.5rem] border border-zinc-100 hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-700 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-1000`}></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 italic">{stat.label}</p>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-5xl font-black text-zinc-950 tabular-nums tracking-tighter leading-none">{stat.val}</h3>
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${stat.sub.includes('+') || stat.sub.includes('Referral') ? 'text-emerald-500' : 'text-zinc-400'} italic`}>{stat.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subscription Callibrator & Payouts */}
                        <div className="grid grid-cols-3 gap-8 animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                            {/* Vault Calibration (Price Setting) */}
                            <div className="col-span-2 bg-white rounded-[4rem] border border-zinc-100 p-12 relative overflow-hidden shadow-sm hover:shadow-xl transition-all shadow-zinc-100/50 group/calib">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-600 scale-x-0 group-hover/calib:scale-x-100 transition-transform duration-700 origin-left"></div>
                                <div className="flex justify-between items-center mb-12">
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] italic">Loyalty Calibration</h4>
                                        <h3 className="text-3xl text-premium italic text-zinc-900">Set your Monthly Fuel.</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-4 italic">Optimized for Conversion</span>
                                        <button className="px-6 py-3 bg-zinc-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-zinc-200">Apply Pricing</button>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="flex items-center gap-12">
                                        <div className="flex-grow space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Monthly Subscription Fee</span>
                                                <span className="text-4xl font-black text-zinc-950 italic tabular-nums">₦{subPrice.toLocaleString()}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5000"
                                                max="50000"
                                                step="500"
                                                value={subPrice}
                                                onChange={(e) => setSubPrice(parseInt(e.target.value))}
                                                className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-pink-500"
                                            />
                                            <div className="flex justify-between text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">
                                                <span>₦5,000</span>
                                                <span>Optimal Reach</span>
                                                <span>₦50,000</span>
                                            </div>
                                        </div>
                                        <div className="w-[1px] h-24 bg-zinc-100"></div>
                                        <div className="w-56 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Your Take (80%)</p>
                                                <p className="text-2xl font-black text-emerald-500 italic leading-none">₦{Math.floor(subPrice * 0.82).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Platform (18%)</p>
                                                <p className="text-sm font-black text-zinc-300 italic leading-none">₦{Math.floor(subPrice * 0.18).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-50">
                                        <div className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="animate-pulse-live w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Fast Payout Protocol</h4>
                                            </div>
                                            <p className="text-[11px] text-zinc-600 font-bold leading-relaxed">Direct Naira transfer within 24 hours. No currency lag.</p>
                                        </div>
                                        <div className="p-6 bg-pink-50/30 rounded-3xl border border-pink-100">
                                            <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2 italic">Hub Growth</h4>
                                            <p className="text-[11px] text-zinc-600 font-bold leading-relaxed">Top 1% engagement niche. ₦12k-₦18k range optimal.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Extraction Stream / Social Graph Mock */}
                            <div className="space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="animate-pulse-live w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] italic">Live Extraction</h4>
                                    </div>
                                    <button
                                        onClick={() => showToast("Under Calibration: Resonance Mapping Active Soon")}
                                        className="text-[8px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900 transition-colors"
                                    >
                                        Resonance Map
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-6 rounded-[2.5rem] border border-pink-100 shadow-xl shadow-pink-500/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-2xl"></div>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.25em] italic">Current Destination</span>
                                            <button onClick={triggerEditBank} className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors">Edit Hub</button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-[11px] font-black group-hover:rotate-12 transition-transform">
                                                {bankAccount.bank.substring(0, 3).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase text-zinc-900 tracking-wider font-display leading-none">{bankAccount.bank}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold italic mt-2 tracking-wide font-display">**** {bankAccount.number.slice(-4)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {RECENT_CONVERSIONS.map((log) => (
                                        <div key={log.id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between hover:shadow-xl hover:shadow-zinc-100 transition-all cursor-pointer group hover:-translate-y-1">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-zinc-50 rounded-[1.8rem] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform font-black italic text-zinc-900">
                                                    {log.fan[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none">{log.type}</p>
                                                    <p className="text-zinc-400 text-[11px] font-bold mt-2 italic">Hub Participant {log.fan}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-emerald-500 tabular-nums leading-none tracking-tighter">{log.amount}</p>
                                                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mt-2">{log.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Aegis Sovereignty Panel */}
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 bg-zinc-950 rounded-[4rem] p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>
                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] italic">Aegis Sovereignty</h4>
                                        <h3 className="text-3xl text-premium italic text-white">Your rules, your sanctuary.</h3>
                                    </div>
                                    <div className="px-5 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                        <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Self-HEALING MODE: ACTIVE</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    {[
                                        { id: 'ghostComments', label: 'Ghost Commenting', sub: 'Non-patrons see themselves posting, but no one else does.', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M10 21V19M14 21V19" /></svg> },
                                        { id: 'stealthMode', label: 'Stealth Discovery', sub: 'Remove yourself from the Global Altar temporarily.', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.12 13.12 0 0 1-1.5 2.5" /><path d="M8.47 5.76C3.41 7.21 2 12 2 12s3 7 10 7c1.44 0 2.63-.31 3.65-.85" /><path d="m2 2 20 20" /></svg> },
                                        { id: 'aggressiveSanitization', label: 'Proactive Sanitization', sub: 'AI automatically bans bad actors before they interact.', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg> },
                                    ].map((trait) => (
                                        <div key={trait.id} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer ${(sovereignty as any)[trait.id] ? 'bg-blue-500/10 border-blue-500/40 shadow-xl shadow-blue-500/5' : 'bg-white/5 border-white/10 hover:border-white/20'}`} onClick={() => setSovereignty(prev => ({ ...prev, [trait.id]: !(prev as any)[trait.id] }))}>
                                            <div className="flex justify-between items-start mb-6">
                                                <span className={`${(sovereignty as any)[trait.id] ? 'text-blue-400' : 'text-zinc-500'}`}>{trait.icon}</span>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-all ${(sovereignty as any)[trait.id] ? 'bg-blue-500' : 'bg-white/10'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${(sovereignty as any)[trait.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{trait.label}</h5>
                                            <p className="text-[10px] text-zinc-500 font-bold italic leading-relaxed">{trait.sub}</p>
                                        </div>
                                    ))}
                                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 flex flex-col justify-center">
                                        <h5 className="text-[11px] font-black text-pink-400 uppercase tracking-widest mb-2">Psychological Guard</h5>
                                        <p className="text-[10px] text-zinc-400 font-bold italic leading-relaxed">System identifies & shadow-bans copycats and bad actors attempting to siphon your resonance handle.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] border border-zinc-100 p-12 flex flex-col justify-between shadow-sm">
                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] italic">Moderation Pulse</h4>
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end border-b border-zinc-50 pb-6">
                                            <div>
                                                <p className="text-3xl font-black text-zinc-900 italic leading-none">842</p>
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">Bad Actors Neutralized</p>
                                            </div>
                                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic">Live Feed</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-zinc-50 pb-6">
                                            <div>
                                                <p className="text-3xl font-black text-zinc-900 italic leading-none">12,402</p>
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">Whispers Filtered</p>
                                            </div>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">+12 Today</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => showToast("Accessing Aegis Registry... Credentials Required")}
                                    className="w-full py-5 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-zinc-200"
                                >
                                    View Ban Registry
                                </button>
                            </div>
                        </div>

                        {/* Retention & Growth Altar */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-[4rem] p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[50%] h-full bg-white opacity-[0.03] -skew-x-12 translate-x-1/2"></div>
                            <div className="w-full max-w-[100vw] md:max-w-[1600px] h-full flex flex-col md:flex-row relative z-10 overflow-x-hidden items-center justify-between gap-12">
                                <div className="space-y-4">
                                    <div className="inline-flex px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">growth protocol • 10% lifetime Referral</span>
                                    </div>
                                    <h3 className="text-5xl text-premium italic text-white leading-tight">Scale your <br /><span className="text-gradient">Engine.</span></h3>
                                    <p className="text-zinc-400 text-sm max-w-md leading-relaxed italic">Turn your connections into fuel. Every creator you bring onboard expands your passive resonance by 10% of their net split.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <input readOnly value="https://fns.fan/ref/creator_apex" className="bg-white/5 border border-white/10 text-white px-8 py-6 rounded-full font-bold text-[11px] w-80 outline-none" />
                                        <button className="absolute right-3 top-3 bottom-3 bg-white text-zinc-900 px-6 rounded-3xl font-black text-[9px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">Copy</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* --- Economic Portals (Modals) --- */}
            {activeModal === 'withdraw' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100">
                        <button onClick={closeModals} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic leading-none">Extraction Protocol</h4>
                                <h3 className="text-4xl text-premium italic text-zinc-900">Withdrawal Vault.</h3>
                            </div>

                            <div className="p-10 bg-zinc-50 rounded-[3rem] space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Withdrawal Amount</span>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Max: ₦{vaultBalance.toLocaleString()}</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-zinc-300">₦</span>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white border border-zinc-100 pl-16 pr-8 py-8 rounded-[2rem] text-4xl font-black text-zinc-950 outline-none focus:border-emerald-200 transition-all placeholder:text-zinc-100"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 pt-6 border-t border-zinc-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Destination Vault</span>
                                        <button onClick={triggerEditBank} className="text-[9px] font-black text-pink-500 uppercase tracking-widest hover:underline italic">Edit Details</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white text-[10px] font-black">{bankAccount.bank.substring(0, 3).toUpperCase()}</div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase text-zinc-900">{bankAccount.bank}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold italic mt-0.5">**** {bankAccount.number.slice(-4)} • {bankAccount.name}</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-500"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg></span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0 || parseInt(withdrawAmount) > vaultBalance || isExtracting}
                                    className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-4"
                                >
                                    {isExtracting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            Extracting Fuel...
                                        </>
                                    ) : (
                                        `Extract ₦${parseInt(withdrawAmount || "0").toLocaleString()} to Bank`
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Guaranteed Arrival within 24 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'split' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100">
                        <button onClick={closeModals} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] italic leading-none">Transparency Protocol</h4>
                                <h3 className="text-4xl text-premium italic text-zinc-900">Revenue Anatomy.</h3>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: "Creator Essence (You)", val: 80, color: "bg-pink-500", detail: "Direct share of all Loyality Fees & Vision Unlocks" },
                                    { label: "Growth Engine (Referrals)", val: 10, color: "bg-emerald-400", detail: "Fueling the expansion of our digital hub" },
                                    { label: "System Maintenance", val: 10, color: "bg-zinc-200", detail: "Optimizing the discovery altar and security" },
                                ].map((row) => (
                                    <div key={row.label} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">{row.label}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold italic mt-1 leading-none">{row.detail}</p>
                                            </div>
                                            <span className="text-3xl font-black text-zinc-950 italic tabular-nums">{row.val}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-zinc-50 rounded-full overflow-hidden p-[2px] border border-zinc-100">
                                            <div className={`h-full ${row.color} rounded-full transition-all duration-1000 delay-300`} style={{ width: `${row.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                                <p className="text-[11px] text-zinc-500 font-bold text-center leading-relaxed italic">
                                    "Our 80/20 resonance model is engineered to prioritize your independence. We grow only when your influence expands."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 'link_bank' && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-lg rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100">
                        <button onClick={() => setActiveModal('withdraw')} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>

                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] italic leading-none">Vault Configuration</h4>
                                <h3 className="text-4xl text-premium italic text-zinc-900">Link Naira Hub.</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-4">Financial Institution</label>
                                    <select
                                        value={linkForm.bank}
                                        onChange={(e) => setLinkForm({ ...linkForm, bank: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-100 px-8 py-5 rounded-3xl font-bold text-zinc-900 outline-none focus:border-pink-200 transition-all appearance-none"
                                    >
                                        <option value="">Select your bank</option>
                                        <option value="Access Bank">Access Bank</option>
                                        <option value="GTBank">Guaranty Trust Bank</option>
                                        <option value="Zenith Bank">Zenith Bank</option>
                                        <option value="Standard Chartered">Standard Chartered</option>
                                        <option value="Kuda Bank">Kuda Bank</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-4">Account Holder Name</label>
                                    <input
                                        placeholder="Full Name on Account"
                                        value={linkForm.name}
                                        onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-100 px-8 py-5 rounded-3xl font-bold text-zinc-900 outline-none focus:border-pink-200 transition-all font-display"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-4">Account Number</label>
                                    <input
                                        placeholder="0000000000"
                                        maxLength={10}
                                        value={linkForm.number}
                                        onChange={(e) => setLinkForm({ ...linkForm, number: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-100 px-8 py-5 rounded-3xl font-bold text-zinc-900 outline-none focus:border-pink-200 transition-all"
                                    />
                                </div>

                                {isVerifying && (
                                    <div className="flex items-center justify-center gap-3 py-4 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-150"></div>
                                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest italic">Authenticating Hub Details...</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleLinkBank}
                                    disabled={!linkForm.bank || linkForm.number.length < 10 || !linkForm.name || isVerifying}
                                    className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all"
                                >
                                    Verify & Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 'add_funds' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100">
                        <button onClick={closeModals} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.4em] italic leading-none">Wallet Protocol</h4>
                                <h3 className="text-4xl text-premium italic text-zinc-900">Fuel the Nexus.</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deposit Amount</span>
                                        <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest italic leading-none">Instant Naira Top-up</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-zinc-300">₦</span>
                                        <input
                                            type="number"
                                            value={addAmount}
                                            onChange={(e) => setAddAmount(e.target.value)}
                                            placeholder="5,000"
                                            className="w-full bg-zinc-50 border border-zinc-100 pl-16 pr-8 py-8 rounded-[2rem] text-4xl font-black text-zinc-950 outline-none focus:border-violet-200 transition-all placeholder:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {["5,000", "15,000", "50,000"].map(v => (
                                        <button key={v} onClick={() => setAddAmount(v.replace(',', ''))} className="py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all">
                                            ₦{v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={() => showToast("Paystack Gateway Initiating... Syncing Hub")}
                                    className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Initialize Paystack Portal
                                </button>
                                <div className="flex items-center justify-center gap-3">
                                    <svg viewBox="0 0 24 24" width="16" height="16" className="text-zinc-300"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Fast Hub Clearing • Real-time Sync</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
