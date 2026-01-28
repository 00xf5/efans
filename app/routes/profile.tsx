import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useTheme } from "../hooks/useTheme";

export default function IdentitySanctuary() {
    const [persona, setPersona] = useState<"creator" | "fan">("creator");
    const [isEditing, setIsEditing] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Identity State
    const [identity, setIdentity] = useState({
        name: "Valentina Noir",
        tag: "@valen_noir",
        bio: "Digital architect of sensual visions. Building a legacy of high-lvl resonance and unfiltered sovereignty.",
        location: "Lagos, Nigeria",
        website: "valentinanoir.hub",
        avatar: "VN",
        coverImg: "/profile_banner_aesthetic_1769530629270.png",
        profileImg: "" // If empty, show initials
    });

    // Form State
    const [editForm, setEditForm] = useState({ ...identity });
    const [isSaving, setIsSaving] = useState(false);

    // --- Settings & Tabs State ---
    const [activeSettingsTab, setActiveSettingsTab] = useState("Privacy Control");
    const [privacySettings, setPrivacySettings] = useState({
        "Ghost Mode": true,
        "Cipher Chat": true,
        "Vault Protection": false,
        "Stealth Discovery": true,
        "Deep Analytics": false,
        "Resonance Shield": true
    });

    const toggleSetting = (title: string) => {
        setPrivacySettings(prev => ({
            ...prev,
            [title]: !prev[title as keyof typeof privacySettings]
        }));
    };

    const [passwordForm, setPasswordForm] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const [isProcessingVisual, setIsProcessingVisual] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIdentity({ ...editForm });
            setIsSaving(false);
            setIsEditing(false);
        }, 1500);
    };

    const triggerVisualUpdate = (type: 'cover' | 'profile') => {
        if (type === 'cover') coverInputRef.current?.click();
        else profileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessingVisual(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setEditForm(prev => ({
                ...prev,
                [type === 'cover' ? 'coverImg' : 'profileImg']: result
            }));
            setIsProcessingVisual(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative w-full h-full bg-[var(--color-bg-app)] text-zinc-900 dark:text-zinc-100 flex justify-center selection:bg-pink-100 overflow-hidden font-display">
            {/* Global Background Grain/Blur */}
            <div className="fixed inset-0 pointer-events-none opacity-50">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-50/50 rounded-full blur-[160px]"></div>
            </div>

            <div className="w-full md:max-w-[1400px] h-full flex flex-col relative z-10 overflow-x-hidden">
                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide pb-32">

                    {/* Header: The Altar */}
                    <div className="relative h-48 md:h-96 w-full animate-entrance group/banner">
                        <img
                            src={identity.coverImg}
                            alt="Banner"
                            className="w-full h-full object-cover animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/60"></div>

                        {/* Banner Control Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-white/20 hover:bg-white/40 border border-white/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105"
                            >
                                Recalibrate Cover Altar
                            </button>
                        </div>

                        {/* Identity Badge Overlap */}
                        <div className="absolute -bottom-12 md:-bottom-24 left-4 md:left-12 flex items-end gap-4 md:gap-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-pink-500/20 rounded-[2rem] md:rounded-[3rem] blur-2xl group-hover:scale-125 transition-all duration-700"></div>
                                <div className="w-24 h-24 md:w-48 md:h-48 bg-white p-1 md:p-2 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10">
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-center text-2xl md:text-5xl font-black text-white italic shadow-inner overflow-hidden">
                                        {identity.profileImg ? (
                                            <img src={identity.profileImg} className="w-full h-full object-cover" alt="Profile" />
                                        ) : identity.avatar}
                                    </div>
                                    {/* Profile Pic Tooltip */}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="absolute inset-1 md:inset-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter"
                                    >
                                        Update Visual
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all z-20 border border-zinc-100"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                            </div>

                            <div className="pb-4 md:pb-8 space-y-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <h1 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{identity.name}</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Sovereign Mode</span>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="md:hidden px-4 py-2 bg-pink-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                        >
                                            Calibrate Identity
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-white/60 font-bold italic tracking-wide text-sm md:text-lg">{identity.tag}</p>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="hidden md:flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Calibrate Identity
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 md:mt-32 px-4 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                        {/* Side: Identity Stats */}
                        <div className="col-span-full md:col-span-4 space-y-8 animate-entrance [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                            <div className="bg-white dark:bg-zinc-900/60 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">Bio Calibration</h4>
                                    <p className="text-zinc-600 font-bold leading-relaxed italic text-sm">
                                        {identity.bio}
                                    </p>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-zinc-50">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest leading-none">{identity.location}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                        <span className="text-[11px] font-black uppercase tracking-widest leading-none text-pink-500 underline underline-offset-4">{identity.website}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-zinc-900 to-black p-10 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-zinc-200">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Resonance Metrics</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-3xl font-black italic tabular-nums leading-none">4.2k</p>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active Links</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-3xl font-black italic tabular-nums leading-none">92%</p>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Heat Level</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main: Advanced Settings */}
                        <div className="col-span-full md:col-span-8 space-y-8 animate-entrance [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                            <div className="bg-white dark:bg-zinc-900/60 rounded-[2rem] md:rounded-[4rem] border border-zinc-100 dark:border-zinc-800 p-6 md:p-12 shadow-sm min-h-[500px]">
                                <nav className="flex gap-4 md:gap-12 border-b border-zinc-100 dark:border-zinc-800 mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
                                    {['Privacy Control', 'Security Core', 'Account Core', 'Experience Calibration'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveSettingsTab(tab)}
                                            className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeSettingsTab === tab ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-300 hover:text-zinc-500'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>

                                <div className="space-y-8 md:space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        {(activeSettingsTab === 'Privacy Control' ? [
                                            { title: "Ghost Mode", desc: "Your identity becomes invisible to algorithmic crawlers." },
                                            { title: "Cipher Chat", desc: "All incoming resonance is encrypted end-to-end." },
                                            { title: "Vault Protection", desc: "Require 2FA for all wallet extractions." },
                                            { title: "Stealth Discovery", desc: "Appear only via direct link or QR resonance." }
                                        ] : activeSettingsTab === 'Security Core' ? [
                                            { title: "Biometric Altar", desc: "Unlock Sanctuary via local device biometrics." },
                                            { title: "Hardware Key", desc: "Require physical security token for entry." }
                                        ] : [
                                            { title: "Deep Analytics", desc: "Enable granular tracking of fan resonance heat." },
                                            { title: "Resonance Shield", desc: "Auto-filter low-status interaction requests." }
                                        ]).map(setting => (
                                            <button
                                                key={setting.title}
                                                onClick={() => toggleSetting(setting.title)}
                                                className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-pink-200 transition-all text-left"
                                            >
                                                <div className="space-y-2">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 leading-none">{setting.title}</h5>
                                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold italic pr-4 leading-relaxed">{setting.desc}</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-all ${privacySettings[setting.title as keyof typeof privacySettings] ? 'bg-zinc-900 dark:bg-pink-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${privacySettings[setting.title as keyof typeof privacySettings] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {activeSettingsTab === 'Account Core' && (
                                        <div className="space-y-12 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mb-6">Password Mutation</h4>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Current Cipher</label>
                                                            <input
                                                                type="password"
                                                                placeholder="••••••••"
                                                                value={passwordForm.current}
                                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                                                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-6 py-4 rounded-2xl font-bold text-zinc-900 dark:text-white outline-none focus:border-pink-200"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">New Cipher</label>
                                                            <input
                                                                type="password"
                                                                placeholder="••••••••"
                                                                value={passwordForm.new}
                                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                                                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-6 py-4 rounded-2xl font-bold text-zinc-900 dark:text-white outline-none focus:border-pink-200"
                                                            />
                                                        </div>
                                                        <button
                                                            disabled={!passwordForm.current || !passwordForm.new}
                                                            className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                                                        >
                                                            Update Protocol Cipher
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mb-6">Visual Resonance</h4>
                                                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group">
                                                        <div className="space-y-2">
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 leading-none">Midnight Mode</h5>
                                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold italic pr-4 leading-relaxed">Transition the sanctuary into deep visual rest.</p>
                                                        </div>
                                                        <button
                                                            onClick={toggleTheme}
                                                            className={`w-12 h-6 rounded-full p-1 transition-all ${theme === 'dark' ? 'bg-pink-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                                                        >
                                                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-pink-50/30 dark:bg-rose-500/5 p-8 rounded-[3rem] border border-pink-100 dark:border-rose-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-pink-100 dark:border-rose-500/20 text-pink-500">
                                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-pink-900 dark:text-rose-400 uppercase tracking-widest leading-none">Terminate Protocol</p>
                                                <p className="text-[10px] text-pink-500/60 font-bold italic mt-2">Immediately vault all data and exit the Sovereign Hub.</p>
                                            </div>
                                        </div>
                                        <button className="px-8 py-4 bg-pink-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-200">Deactivate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal: Calibration Portal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border border-zinc-100 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <button onClick={() => setIsEditing(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>

                        <div className="space-y-12">
                            <header className="space-y-4 text-center">
                                <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] italic leading-none">Identity Calibration</h4>
                                <h3 className="text-4xl text-zinc-900 font-black italic tracking-tighter">Modify Residency.</h3>
                            </header>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Full Identity Name</label>
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold text-zinc-900 outline-none focus:border-pink-200 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Public Resonance Tag</label>
                                        <input
                                            value={editForm.tag}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, tag: e.target.value }))}
                                            className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold text-zinc-900 outline-none focus:border-pink-200 shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Identity Bio</label>
                                    <textarea
                                        rows={4}
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold text-zinc-900 outline-none focus:border-pink-200 shadow-inner resize-none italic"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Residency (Location)</label>
                                        <input
                                            value={editForm.location}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                            className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold text-zinc-900 outline-none focus:border-pink-200 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Hub Link (Website)</label>
                                        <input
                                            value={editForm.website}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                                            className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold text-zinc-900 outline-none focus:border-pink-200 shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-50 space-y-6">
                                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">Visual Asset Calibration</h5>

                                    {/* Real File Uploaders */}
                                    <input type="file" ref={coverInputRef} onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" accept="image/*" />
                                    <input type="file" ref={profileInputRef} onChange={(e) => handleFileUpload(e, 'profile')} className="hidden" accept="image/*" />

                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Cover Uploader */}
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Cover Portal Asset</label>
                                            <div
                                                onClick={() => triggerVisualUpdate('cover')}
                                                className="group/up relative h-32 w-full bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:border-pink-200 transition-all overflow-hidden"
                                            >
                                                {editForm.coverImg ? (
                                                    <img src={editForm.coverImg} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover/up:opacity-50 transition-opacity" />
                                                ) : null}
                                                <div className="relative z-10 flex flex-col items-center gap-2">
                                                    <svg viewBox="0 0 24 24" width="24" height="24" className="text-zinc-300 group-hover/up:text-pink-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Replace Altar</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profile Uploader */}
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4">Profile Icon Asset</label>
                                            <div
                                                onClick={() => triggerVisualUpdate('profile')}
                                                className="group/up relative h-32 w-full bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:border-pink-200 transition-all overflow-hidden"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm relative z-10 overflow-hidden">
                                                    {editForm.profileImg ? (
                                                        <img src={editForm.profileImg} className="w-full h-full object-cover" />
                                                    ) : <span className="text-zinc-300 font-black italic">VN</span>}
                                                </div>
                                                <span className="mt-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none relative z-10">Select Icon</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-400 font-bold italic leading-relaxed">System automatically re-samples assets to the highest resonance density (4K optimized).</p>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        Committing Residency...
                                    </>
                                ) : "Commit Resonance Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
