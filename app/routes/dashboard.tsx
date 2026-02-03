import { useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import { requireUserId } from "../utils/session.server";
import { db } from "../db/index.server";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";

export async function loader({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
    });

    if (!profile) {
        // This shouldn't happen if auth logic is correct, but for safety:
        throw new Error("Profile resonance lost.");
    }

    return { profile };
}

// --- ROI-Focused Design Tokens ---

const MOCK_ROI_STATS = [
    { label: "Active Fuel", val: "₦12.8M", sub: "+14% this week", color: "from-emerald-500/20", type: "currency" },
    { label: "Conversion Heat", val: "8.2%", sub: "Top 1% of Hub", color: "from-pink-500/20", type: "percent" },
    { label: "Aegis Guard", val: "1,240", sub: "Bad actors neutralized", color: "from-blue-600/20", type: "count" },
    { label: "Growth Engine", val: "₦842k", sub: "Referral Income", color: "from-amber-500/20", type: "rank" },
];

const RECENT_CONVERSIONS = [
    { id: 1, type: "Vision Unlock", fan: "User_842", amount: "+₦45,000", time: "2m ago", status: "success" },
    { id: 2, type: "Whisper Tip", fan: "Nexus_Prime", amount: "+₦120,000", time: "14m ago", status: "success" },
    { id: 3, type: "New Loyalty", fan: "Dark_Muse", amount: "+₦15,000/mo", time: "1h ago", status: "pending" },
    { id: 4, type: "Vision Unlock", fan: "Sensus_Fan", amount: "+₦25,000", time: "3h ago", status: "success" },
];

export default function ExperienceHub() {
    const { profile } = useLoaderData() as { profile: any };
    const [subPrice, setSubPrice] = useState(15000);
    const [persona, setPersona] = useState<"creator" | "fan">(profile.persona);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [sovereignty, setSovereignty] = useState({ ghostComments: true, stealthMode: false, aggressiveSanitization: true });
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Vault & Bank State (Creator) ---
    const [bankAccount, setBankAccount] = useState({ bank: "GTBank", name: profile.name || "Sovereign Soul", number: "0123456789", verified: true });
    const [vaultBalance, setVaultBalance] = useState(parseFloat(profile.balance) || 0);

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
        <div className="relative w-full min-h-screen bg-[var(--color-bg-app)] text-zinc-900 dark:text-zinc-100 flex justify-center selection:bg-pink-100 font-display transition-colors duration-500">
            {/* Resonance Feedback Altar */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {toast}
                </div>
            )}
            {/* Economic Aurora */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-zinc-800/20 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/40 rounded-full blur-[160px]"></div>
            </div>

            <div className="w-full flex justify-center px-0 md:px-6 relative z-10">
                <div className="flex w-full md:max-w-[2200px] gap-0 md:gap-12">

                    {/* Left Pillar: Navigation */}
                    <aside className="hidden lg:flex flex-col w-72 py-10">
                        <div className="space-y-12">
                            {/* Persona Switcher */}
                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">Persona</h4>
                                <div className="p-1 bg-zinc-900/40 rounded-[2rem] flex items-center relative gap-1 border border-zinc-800">
                                    <button
                                        onClick={() => setPersona('creator')}
                                        className={`flex-1 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all z-10 ${persona === 'creator' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Creator Hub
                                    </button>
                                    <button
                                        onClick={() => setPersona('fan')}
                                        className={`flex-1 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all z-10 ${persona === 'fan' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Fan Nexus
                                    </button>
                                </div>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">{persona === 'creator' ? 'Management' : 'Nexus Control'}</h4>
                                <nav className="space-y-2">
                                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3.5 bg-white text-black rounded-3xl transition-all group">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Performance Hub</span>
                                    </Link>
                                    <Link to="/timeline" className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900 rounded-3xl text-zinc-500 hover:text-white transition-all font-bold">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Visions Control</span>
                                    </Link>
                                </nav>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">Economy</h4>
                                <nav className="space-y-2">
                                    <button onClick={() => setActiveModal('withdraw')} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900 rounded-3xl text-zinc-500 hover:text-white transition-all font-bold text-left group">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Withdraw Fuel</span>
                                    </button>
                                    <button onClick={() => setActiveModal('link_bank')} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900 rounded-3xl text-zinc-500 hover:text-white transition-all font-bold text-left group">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Vault Settings</span>
                                    </button>
                                </nav>
                            </div>

                            <div className="px-5 bg-primary/5 py-8 rounded-[2.5rem] mt-6 border border-primary/10">
                                <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic mb-4">Referral Engine</h4>
                                <p className="text-[10px] text-zinc-500 font-bold mb-4 leading-relaxed">Earn 10% of every creator you bring to the hub. Lifetime resonance.</p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText("https://fns.fan/ref/creator_apex");
                                        showToast("Referral Engine Vector Copied");
                                    }}
                                    className="w-full bg-white text-black py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-none"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content: The Hub */}
                    <main className="flex-grow py-10 space-y-12 pb-32">
                        {persona === 'creator' ? (
                            <>
                                <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-0 animate-entrance">
                                    <div className="space-y-3">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-none transition-all`}>
                                            <span className={`${statusTier.color}`}>{statusTier.icon}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusTier.color}`}>{statusTier.label}</span>
                                        </div>
                                        <h1 className="text-4xl md:text-7xl font-black italic text-white tracking-tighter leading-tight">Sovereign <span className="text-gradient">Control.</span></h1>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-zinc-500">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Management Altar Ready</span>
                                            <div className="hidden md:block h-[1px] w-12 bg-zinc-800 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 leading-none">Aegis Guard Active</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-2 w-full md:w-auto">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Net Revenue Share</span>
                                        <div className="px-8 py-4 bg-white rounded-3xl shadow-none">
                                            <span className="text-2xl md:text-4xl font-black text-black">80<span className="text-primary">%</span></span>
                                        </div>
                                    </div>
                                </header>
                            </>
                        ) : (
                            <>
                                <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-0 animate-entrance px-4 md:px-0">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-none">
                                            <span className="text-primary">✨</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nexus Elite</span>
                                        </div>
                                        <h1 className="text-4xl md:text-7xl font-black italic text-white tracking-tighter leading-tight">Nexus <span className="text-gradient-fan">Collection.</span></h1>
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-zinc-500">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Member Since Cycle 01</span>
                                            <div className="hidden md:block h-[1px] w-12 bg-zinc-800 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary leading-none">24 Unlocked Visions</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveModal('add_funds')}
                                        className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-2 w-full md:w-auto group"
                                    >
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-primary transition-colors italic">Spending Power</span>
                                        <div className="px-8 py-4 bg-white rounded-3xl shadow-none group-hover:bg-primary transition-all">
                                            <span className="text-2xl md:text-4xl font-black text-black group-hover:text-white tabular-nums">₦{walletBalance.toLocaleString()}</span>
                                        </div>
                                    </button>
                                </header>
                            </>
                        )}

                        {/* Apex Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards] px-4 md:px-0">
                            {(persona === 'creator' ? MOCK_ROI_STATS : [
                                { label: "Total Contributed", val: "₦85.4k", sub: "+₦12k this month", color: "from-primary/20", type: "currency" },
                                { label: "Unlocked Visions", val: "142", sub: "24 new in Nexus", color: "from-zinc-100/10", type: "count" },
                                { label: "Resonance Level", val: "92", sub: "Top 5% Hub Member", color: "from-primary/20", type: "rank" },
                                { label: "Sovereign Tier", val: "Gold", sub: "Priority Resonance", color: "from-amber-500/10", type: "rank" }
                            ]).map((stat) => (
                                <div key={stat.label} className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 hover:bg-zinc-900 transition-all duration-700 relative overflow-hidden group">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 italic">{stat.label}</p>
                                    <div className="flex flex-col gap-1 md:gap-2">
                                        <h3 className="text-2xl md:text-5xl font-black text-white tabular-nums tracking-tighter leading-none">{stat.val}</h3>
                                        <p className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest ${stat.sub.includes('+') ? 'text-emerald-500' : 'text-zinc-600'} italic truncate`}>{stat.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subscription Calibrator */}
                        {persona === 'creator' && (
                            <div className="bg-zinc-900/40 rounded-[4rem] border border-zinc-800 p-12 relative overflow-hidden animate-entrance [animation-delay:300ms] mx-4 md:mx-0">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Loyalty Calibration</h4>
                                        <h3 className="text-3xl font-black text-white italic tracking-tighter leading-tight">Set your Monthly Fuel.</h3>
                                    </div>
                                    <button
                                        onClick={() => showToast(`Pricing Strategy Updated to ₦${subPrice.toLocaleString()}`)}
                                        className="w-full md:w-auto px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-none"
                                    >
                                        Apply Pricing
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                                    <div className="space-y-10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Monthly Sub Fee</span>
                                            <span className="text-4xl font-black text-white italic tabular-nums leading-none">₦{subPrice.toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5000"
                                            max="50000"
                                            step="500"
                                            value={subPrice}
                                            onChange={(e) => setSubPrice(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">
                                            <span>₦5k</span>
                                            <span>₦50k</span>
                                        </div>
                                    </div>
                                    <div className="p-10 bg-black rounded-[3rem] border border-zinc-800 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Your Take (80%)</p>
                                            <p className="text-3xl font-black text-emerald-500 italic leading-none">₦{Math.floor(subPrice * 0.80).toLocaleString()}</p>
                                        </div>
                                        <div className="h-12 w-[1px] bg-zinc-800"></div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">Platform</p>
                                            <p className="text-xl font-black text-zinc-700 italic leading-none">₦{Math.floor(subPrice * 0.20).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-0">
                            <div className="md:col-span-2 space-y-8">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Live Extraction Stream</h4>
                                <div className="space-y-4">
                                    {RECENT_CONVERSIONS.map((log) => (
                                        <div key={log.id} className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 flex items-center justify-between hover:bg-zinc-900 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-black rounded-[2rem] border border-zinc-800 flex items-center justify-center text-xl font-black italic text-white">{log.fan[0]}</div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-2">{log.type}</p>
                                                    <p className="text-zinc-600 text-[11px] font-bold italic">Hub Participant {log.fan}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-emerald-500 tabular-nums leading-none tracking-tighter">{log.amount}</p>
                                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mt-3 italic">{log.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Vault Hub</h4>
                                <div className="bg-white p-10 rounded-[4rem] text-black relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-12">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">Active Bank</span>
                                        <button onClick={triggerEditBank} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline leading-none">Edit</button>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-black rounded-[1.5rem] flex items-center justify-center text-white text-[12px] font-black">{bankAccount.bank.substring(0, 3).toUpperCase()}</div>
                                        <div>
                                            <p className="text-[12px] font-black uppercase tracking-wider leading-none mb-2">{bankAccount.bank}</p>
                                            <p className="text-[11px] text-zinc-500 font-bold italic mt-2 tracking-wide">**** {bankAccount.number.slice(-4)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aegis Sovereignty */}
                        {persona === 'creator' && (
                            <div className="bg-black rounded-[4rem] p-12 border border-zinc-800 relative overflow-hidden mx-4 md:mx-0">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">Aegis Sovereignty</h4>
                                        <h3 className="text-3xl font-black text-white italic tracking-tighter leading-tight">Your rules, your sanctuary.</h3>
                                    </div>
                                    <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Aegis Guard Active</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { id: 'ghostComments', label: 'Ghost Commenting', sub: 'Non-patrons see themselves posting, but no one else does.' },
                                        { id: 'stealthMode', label: 'Stealth Discovery', sub: 'Remove yourself from the Global Altar temporarily.' },
                                        { id: 'aggressiveSanitization', label: 'AI Sanitization', sub: 'Proactive neutralization of anomalous interactions.' },
                                    ].map((trait) => (
                                        <div key={trait.id} className={`p-10 rounded-[3rem] border transition-all cursor-pointer ${(sovereignty as any)[trait.id] ? 'bg-zinc-900 border-white/20' : 'bg-transparent border-zinc-900 hover:border-zinc-800'}`} onClick={() => setSovereignty(prev => ({ ...prev, [trait.id]: !(prev as any)[trait.id] }))}>
                                            <div className="flex justify-between items-center mb-8">
                                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest">{trait.label}</h5>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-all ${(sovereignty as any)[trait.id] ? 'bg-white' : 'bg-zinc-800'}`}>
                                                    <div className={`w-4 h-4 bg-black rounded-full transition-all ${(sovereignty as any)[trait.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-zinc-600 font-bold italic leading-relaxed">{trait.sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* --- Economic Portals (Modals) --- */}
            {activeModal === 'withdraw' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-zinc-900 w-full max-w-xl rounded-[4rem] p-12 border border-zinc-800 relative">
                        <button onClick={closeModals} className="absolute top-12 right-12 text-zinc-600 hover:text-white transition-colors">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Extraction Protocol</h4>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">Withdrawal Vault.</h3>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-2">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Amount</span>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Max: ₦{vaultBalance.toLocaleString()}</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-zinc-800">₦</span>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-black border border-zinc-800 pl-20 pr-8 py-10 rounded-[2.5rem] text-4xl font-black text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-zinc-900"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!withdrawAmount || isExtracting}
                                    className="w-full bg-white text-black py-8 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 disabled:opacity-20 transition-all"
                                >
                                    {isExtracting ? "Authenticating..." : "Initialize Extraction"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'link_bank' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-zinc-900 w-full max-w-xl rounded-[4rem] p-12 border border-zinc-800 relative">
                        <button onClick={closeModals} className="absolute top-12 right-12 text-zinc-600 hover:text-white transition-colors">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Vault Configuration</h4>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">Link Naira Hub.</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-6">Institution</label>
                                    <select
                                        value={linkForm.bank}
                                        onChange={(e) => setLinkForm({ ...linkForm, bank: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 px-8 py-6 rounded-3xl font-black text-white outline-none uppercase tracking-widest appearance-none"
                                    >
                                        <option value="GTBank">Guaranty Trust Bank</option>
                                        <option value="Access Bank">Access Bank</option>
                                        <option value="Zenith Bank">Zenith Bank</option>
                                        <option value="Kuda Bank">Kuda Bank</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block ml-6">Account Number</label>
                                    <input
                                        placeholder="0000000000"
                                        maxLength={10}
                                        value={linkForm.number}
                                        onChange={(e) => setLinkForm({ ...linkForm, number: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 px-8 py-6 rounded-3xl font-black text-white outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleLinkBank}
                                    disabled={linkForm.number.length < 10 || isVerifying}
                                    className="w-full bg-white text-black py-8 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 disabled:opacity-20 transition-all font-display"
                                >
                                    {isVerifying ? "Verifying..." : "Secure Configuration"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
