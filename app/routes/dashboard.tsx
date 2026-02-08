import { useState, useMemo, useEffect } from "react";
import { Link, useLoaderData, useFetcher } from "react-router";
import { requireUserId } from "../utils/session.server";
import { db } from "../db/index.server";
import { profiles, ledger } from "../db/schema";
import { eq, desc, sum, sql } from "drizzle-orm";
import { formatTimeAgo } from "../utils/date";


interface DbProfile {
    id: string;
    name: string | null;
    tag: string | null;
    persona: "creator" | "fan";
    balance: any;
}

interface DbLedgerEntry {
    id: string;
    senderId: string | null;
    receiverId: string | null;
    amount: any;
    creatorCut: any;
    type: string;
    status: string | null;
    createdAt: Date;
}

export async function loader({ request }: { request: Request }) {
    try {
        const userId = await requireUserId(request);

        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.id, userId)
        });

        if (!profile) {
            throw new Error("Profile resonance lost.");
        }

        // Fetch total income (sum of ledger where receiver is User)
        const incomeResult = await db.select({
            total: sum(ledger.creatorCut)
        }).from(ledger).where(eq(ledger.receiverId, userId));

        const totalEarnings = parseFloat(incomeResult[0]?.total || "0");

        // Fetch recent ledger events with sender info using JOIN to avoid N+1
        const recentTransactions = await db.select({
            id: ledger.id,
            type: ledger.type,
            amount: ledger.amount,
            creatorCut: ledger.creatorCut,
            createdAt: ledger.createdAt,
            status: ledger.status,
            senderName: profiles.name
        })
            .from(ledger)
            .leftJoin(profiles, eq(ledger.senderId, profiles.id))
            .where(eq(ledger.receiverId, userId))
            .orderBy(desc(ledger.createdAt))
            .limit(10);

        const transactions = recentTransactions.map((t: any) => ({

            id: t.id,
            type: t.type === 'unlock' ? 'Vision Unlock' : t.type === 'tip' ? 'Whisper Tip' : t.type === 'subscription' ? 'Subscription' : t.type,
            fan: t.senderName || "Anonymous",
            amount: `+₦${parseFloat(t.creatorCut?.toString() || "0").toLocaleString()}`,
            time: formatTimeAgo(t.createdAt ? new Date(t.createdAt) : new Date()),
            status: t.status || "success"
        }));

        return {
            profile,
            totalEarnings,
            transactions
        };
    } catch (error: any) {
        if (error instanceof Response) throw error;
        console.error("Dashboard Loader Failure:", error);
        throw new Response(`Dashboard Calibration Failed: ${error?.message || error}`, { status: 500 });
    }

}


export async function action({ request }: { request: Request }) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "withdraw") {
        const amount = parseFloat(formData.get("amount") as string);
        const profile = await db.query.profiles.findFirst({ where: eq(profiles.id, userId) });
        const currentBalance = parseFloat(profile?.balance?.toString() || "0");

        if (amount > 0 && amount <= currentBalance) {
            // Update balance
            await db.update(profiles)
                .set({ balance: (currentBalance - amount).toString() })
                .where(eq(profiles.id, userId));

            // Log withdrawal
            await db.insert(ledger).values({
                senderId: userId,
                receiverId: userId, // Withdrawal to self/bank
                amount: amount.toString(),
                creatorCut: "0",
                platformCut: "0",
                type: "withdrawal",
                status: "success"
            });

            return { success: true };
        }
    }

    if (intent === "update_price") {
        const price = formData.get("price") as string;
        await db.update(profiles)
            .set({ subscriptionPrice: price })
            .where(eq(profiles.id, userId));
        return { success: true };
    }

    return { success: false };
}


export default function ExperienceHub() {
    const { profile, totalEarnings, transactions } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

    const [subPrice, setSubPrice] = useState(parseFloat(profile.subscriptionPrice?.toString() || "15000"));
    const [persona, setPersona] = useState<"creator" | "fan">(profile.persona as any);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [sovereignty, setSovereignty] = useState({ ghostComments: profile.ghostMode, stealthMode: profile.stealthMode, aggressiveSanitization: true });
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Vault & Bank State (Creator) ---
    const [bankAccount, setBankAccount] = useState({ bank: "GTBank", name: profile.name || "Sovereign Soul", number: "0123456789", verified: true });
    const vaultBalance = parseFloat(profile.balance?.toString() || "0");

    // --- Apex Status Calculations ---
    const statusTier = useMemo(() => {
        if (totalEarnings > 10000000) return { label: "Sovereign Apex", icon: "👑", color: "text-amber-500" };
        if (totalEarnings > 1000000) return { label: "Elite Hub", icon: "💎", color: "text-blue-500" };
        return { label: "Rising Resonance", icon: "✨", color: "text-pink-500" };
    }, [totalEarnings]);

    const [withdrawAmount, setWithdrawAmount] = useState("");
    const isExtracting = fetcher.state === "submitting";

    const closeModals = () => {
        setActiveModal(null);
    };

    const handleWithdraw = () => {
        const amt = parseFloat(withdrawAmount);
        if (!amt || amt <= 0 || amt > vaultBalance) return;

        const formData = new FormData();
        formData.append("intent", "withdraw");
        formData.append("amount", withdrawAmount);
        fetcher.submit(formData, { method: "POST" });

        showToast("Withdrawal Initialized");
        setActiveModal(null);
    };

    return (
        <div className="relative w-full min-h-screen bg-black text-white flex justify-center selection:bg-primary/20 font-display transition-colors duration-500 pb-32">
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {toast}
                </div>
            )}

            <div className="w-full flex justify-center px-4 md:px-6 relative z-10">
                <div className="flex w-full md:max-w-[1800px] gap-12">

                    {/* Left Pillar: Navigation */}
                    <aside className="hidden lg:flex flex-col w-72 py-10">
                        <div className="space-y-12">
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
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">Management</h4>
                                <nav className="space-y-2">
                                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3.5 bg-white text-black rounded-3xl transition-all">
                                        <span className="text-xl">📊</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Performance</span>
                                    </Link>
                                    <Link to="/timeline" className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900 rounded-3xl text-zinc-500 hover:text-white transition-all font-bold">
                                        <span className="text-xl">✨</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Visions</span>
                                    </Link>
                                </nav>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">Economy</h4>
                                <nav className="space-y-2">
                                    <button onClick={() => setActiveModal('withdraw')} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900 rounded-3xl text-zinc-500 hover:text-white transition-all font-bold text-left group">
                                        <span className="text-xl">💰</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Withdraw</span>
                                    </button>
                                </nav>
                            </div>

                            <div className="px-5">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic mb-6">Protocol</h4>
                                <nav className="space-y-2">
                                    <Link to="/logout" className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-red-500/10 rounded-3xl text-zinc-500 hover:text-red-500 transition-all font-bold text-left group">
                                        <span className="text-xl">🚪</span>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                                    </Link>
                                </nav>
                            </div>
                        </div>

                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow py-10 space-y-12">
                        <header className="flex justify-between items-end animate-entrance">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
                                    <span className={statusTier.color}>{statusTier.icon}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusTier.color}`}>{statusTier.label}</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter leading-tight">Sovereign <span className="text-gradient">Control.</span></h1>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic block mb-2">Vault Balance</span>
                                <div className="px-8 py-4 bg-white rounded-3xl shadow-none">
                                    <span className="text-3xl font-black text-black tabular-nums">₦{vaultBalance.toLocaleString()}</span>
                                </div>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Total Revenue", val: `₦${totalEarnings.toLocaleString()}`, sub: "Lifetime Resonance", color: "text-emerald-500" },
                                { label: "Active Fuel", val: `₦${(totalEarnings * 0.12).toLocaleString()}`, sub: "+12% this week", color: "text-emerald-500" },
                                { label: "Conversion Heat", val: "8.4%", sub: "Top 2% of Hub", color: "text-pink-500" },
                                { label: "Aegis Guard", val: "Active", sub: "Sanitizing anomalous flux", color: "text-blue-500" }
                            ].map((stat) => (
                                <div key={stat.label} className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 italic">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white tabular-nums tracking-tighter mb-2">{stat.val}</h3>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${stat.color} italic`}>{stat.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Extractions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-8">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Live Resonance Extraction</h4>
                                <div className="space-y-4">
                                    {transactions.length > 0 ? transactions.map((log: { id: string; type: string; fan: string; amount: string; time: string; status: string }) => (
                                        <div key={log.id} className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="w-14 h-14 bg-black rounded-[1.5rem] flex items-center justify-center text-xl font-black italic">{log.fan[0]}</div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-2">{log.type}</p>
                                                    <p className="text-zinc-600 text-[11px] font-bold italic">From {log.fan}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-emerald-500 tabular-nums leading-none">{log.amount}</p>
                                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mt-3 italic">{log.time}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-zinc-600 italic text-center py-20">No financial resonance found yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Vault Hub</h4>
                                <div className="bg-white p-10 rounded-[4rem] text-black">
                                    <div className="flex justify-between items-start mb-12">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Connected Bank</span>
                                        <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Verified</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-black rounded-[1.5rem] flex items-center justify-center text-white text-[12px] font-black">{bankAccount.bank.substring(0, 3)}</div>
                                        <div>
                                            <p className="text-[12px] font-black uppercase leading-none mb-2">{bankAccount.bank}</p>
                                            <p className="text-[11px] text-zinc-500 font-bold italic tracking-wide">**** {bankAccount.number.slice(-4)}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModal('withdraw')}
                                    className="w-full py-6 bg-primary text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                                >
                                    Initiate Extraction
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Withdrawal Modal */}
            {activeModal === 'withdraw' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in">
                    <div className="bg-zinc-900 w-full max-w-xl rounded-[4rem] p-12 border border-zinc-800 relative">
                        <button onClick={closeModals} className="absolute top-12 right-12 text-zinc-600 hover:text-white">
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
                                            className="w-full bg-black border border-zinc-800 pl-20 pr-8 py-10 rounded-[2.5rem] text-4xl font-black text-white outline-none focus:border-emerald-500/40 transition-all"
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
        </div>
    );
}
