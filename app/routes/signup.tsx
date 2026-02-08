import { Link, Form, useActionData, useNavigation, redirect, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";
import { register } from "../utils/auth.server";
import { createUserSession } from "../utils/session.server";
import { sendVerificationEmail, verifyOTP } from "../utils/mailer.server";

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;
    const persona = formData.get("persona") as 'creator' | 'fan';

    if (intent === "initiate_creator") {
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const username = formData.get("username") as string;

        if (!email || !name || !username) {
            return { error: "All identity fragments are required for calibration." };
        }

        try {
            await sendVerificationEmail(email);
            return { step: "verify", email, name, username, phone: formData.get("phone"), gender: formData.get("gender"), country: formData.get("country"), referredBy: formData.get("referredBy"), willingNsfw: formData.get("willingNsfw") === "on" };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    if (intent === "verify_otp") {
        const email = formData.get("email") as string;
        const otp = formData.get("otp") as string;

        try {
            await verifyOTP(email, otp);
            return {
                step: "security",
                email,
                verified: true,
                name: formData.get("name"),
                username: formData.get("username"),
                phone: formData.get("phone"),
                gender: formData.get("gender"),
                country: formData.get("country"),
                referredBy: formData.get("referredBy"),
                willingNsfw: formData.get("willingNsfw") === "true"
            };
        } catch (error: any) {
            return { error: error.message, step: "verify", email, name: formData.get("name"), username: formData.get("username"), phone: formData.get("phone"), gender: formData.get("gender"), country: formData.get("country"), referredBy: formData.get("referredBy"), willingNsfw: formData.get("willingNsfw") };
        }
    }

    if (intent === "complete_creator") {
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            return { error: "Security keys do not match.", step: "security", ...Object.fromEntries(formData) };
        }

        try {
            const user = await register({
                email: formData.get("email") as string,
                password,
                name: formData.get("name") as string,
                persona: 'creator',
                phone: formData.get("phone") as string,
                gender: formData.get("gender") as string,
                country: formData.get("country") as string,
                willingNsfw: formData.get("willingNsfw") === "true",
                referredBy: formData.get("referredBy") as string
            });
            return createUserSession(user.id, "/dashboard");
        } catch (error: any) {
            return { error: error.message, step: "security", ...Object.fromEntries(formData) };
        }
    }

    if (intent === "fan_signup") {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string || email.split('@')[0];

        try {
            const user = await register({ email, password, name, persona: 'fan' });
            return createUserSession(user.id, "/timeline");
        } catch (error: any) {
            return { error: error.message };
        }
    }

    return null;
}

export default function Signup() {
    const [persona, setPersona] = useState<"creator" | "fan">("creator");
    const [step, setStep] = useState<"info" | "verify" | "security">("info");
    const actionData = useActionData() as any;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    // Update step based on action response
    useEffect(() => {
        if (actionData?.step) {
            setStep(actionData.step);
        }
    }, [actionData]);

    return (
        <div className="relative w-full h-full flex bg-black overflow-hidden font-display">
            {/* 50% Aesthetic Side */}
            <div className="hidden lg:flex w-1/2 relative h-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
                    alt="Aesthetic"
                    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent"></div>

                <div className="absolute bottom-20 left-20 z-10 space-y-6">
                    <div className="inline-block px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">The Sovereign Altar</span>
                    </div>
                    <h2 className="text-7xl font-black text-white italic leading-[1.1] tracking-tighter">
                        Claim Your <br />
                        <span className="text-gradient">Resonance.</span>
                    </h2>
                </div>
            </div>

            {/* 50% Form Side */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto scrollbar-hide flex flex-col items-center lg:items-start p-8 pt-12 md:p-20 bg-black relative">
                <div className="w-full max-w-lg space-y-12 relative z-10 mb-20">
                    <header className="space-y-4 text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8 group">
                            <span className="text-3xl font-black tracking-tighter text-white italic">
                                e<span className="text-gradient">Fans.</span>
                            </span>
                        </Link>
                        <h1 className="text-4xl font-black text-white leading-tight italic uppercase tracking-tighter">
                            {persona === 'creator' ? `Creator \nOnboarding` : `Fan \nEstablishment`}
                        </h1>
                        <p className="text-zinc-500 font-bold italic text-sm">
                            {persona === 'creator' ? `Step ${step === 'info' ? '1: Identity' : step === 'verify' ? '2: Verification' : '3: Security'}` : 'Direct access to exclusively curated content.'}
                        </p>
                    </header>

                    {/* Persona Selector (Only at start) */}
                    {step === 'info' && (
                        <div className="p-1.5 bg-zinc-950 rounded-[2.5rem] flex relative border border-zinc-900 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setPersona('creator')}
                                className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black uppercase tracking-widest relative z-10 transition-all ${persona === 'creator' ? 'text-black' : 'text-zinc-500'}`}
                            >
                                I am a Creator
                            </button>
                            <button
                                type="button"
                                onClick={() => setPersona('fan')}
                                className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black uppercase tracking-widest relative z-10 transition-all ${persona === 'fan' ? 'text-black' : 'text-zinc-500'}`}
                            >
                                I am a Fan
                            </button>
                            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[2.2rem] shadow-none transition-all duration-500 ease-out-back ${persona === 'fan' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}></div>
                        </div>
                    )}

                    {actionData?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-3xl flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic">{actionData.error}</p>
                        </div>
                    )}

                    {/* --- CREATOR FLOW --- */}
                    {persona === 'creator' && (
                        <Form method="post" className="space-y-10">
                            <input type="hidden" name="intent" value={step === 'info' ? 'initiate_creator' : step === 'verify' ? 'verify_otp' : 'complete_creator'} />
                            <input type="hidden" name="persona" value="creator" />

                            {/* Persistent data across steps */}
                            {step !== 'info' && (
                                <>
                                    <input type="hidden" name="email" value={actionData?.email} />
                                    <input type="hidden" name="name" value={actionData?.name} />
                                    <input type="hidden" name="username" value={actionData?.username} />
                                    <input type="hidden" name="phone" value={actionData?.phone} />
                                    <input type="hidden" name="gender" value={actionData?.gender} />
                                    <input type="hidden" name="country" value={actionData?.country} />
                                    <input type="hidden" name="referredBy" value={actionData?.referredBy} />
                                    <input type="hidden" name="willingNsfw" value={actionData?.willingNsfw?.toString()} />
                                </>
                            )}

                            {step === 'info' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Legal Identity</label>
                                            <input name="name" required placeholder="Sofia Valdéz" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Sanctuary Tag (Username)</label>
                                            <input name="username" required placeholder="@sofia.v" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Email Portal</label>
                                        <input type="email" name="email" required placeholder="name@sanctuary.hub" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Resonance Line (Phone)</label>
                                            <input name="phone" placeholder="+234..." className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Essence (Gender)</label>
                                            <select name="gender" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm appearance-none outline-none">
                                                <option value="female">Divine Female</option>
                                                <option value="male">Masculine Core</option>
                                                <option value="other">Fluid Resonance</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Territory (Country)</label>
                                            <input name="country" placeholder="Nigeria" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Summoned By (Referral)</label>
                                            <input name="referredBy" placeholder="UUID or Code" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white transition-all text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 px-6">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input type="checkbox" required className="w-5 h-5 rounded-lg border-zinc-800 bg-zinc-950 checked:bg-primary transition-all" />
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors">Agree to Protocol Terms & Privacy Sanctuary</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input type="checkbox" name="willingNsfw" className="w-5 h-5 rounded-lg border-zinc-800 bg-zinc-950 checked:bg-primary transition-all" />
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors">Willing to create NSFW content (Filtered Flow)</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-10"
                                    >
                                        {isSubmitting ? "Calibrating..." : "Initiate Verification"}
                                    </button>
                                </div>
                            )}

                            {step === 'verify' && (
                                <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
                                    <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] text-center space-y-4">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Code Transmitted to</p>
                                        <p className="text-xl font-black italic text-white">{actionData?.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">6-Digit Resonance Code</label>
                                        <input
                                            name="otp"
                                            required
                                            maxLength={6}
                                            placeholder="••••••"
                                            className="w-full bg-zinc-950 border border-zinc-900 px-8 py-8 rounded-[2rem] font-black text-4xl text-center tracking-[0.5em] text-white focus:border-primary transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Verifying..." : "Validate Echo"}
                                    </button>
                                </div>
                            )}

                            {step === 'security' && (
                                <div className="space-y-6 animate-in slide-in-from-right-10 duration-700">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Security Key (Password)</label>
                                        <input type="password" name="password" required className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Confirm Security Key</label>
                                        <input type="password" name="confirmPassword" required className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white text-lg" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-10"
                                    >
                                        {isSubmitting ? "Securing Sanctum..." : "Establish Sovereignty"}
                                    </button>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* --- FAN FLOW --- */}
                    {persona === 'fan' && (
                        <Form method="post" className="space-y-8 animate-in fade-in duration-500">
                            <input type="hidden" name="intent" value="fan_signup" />
                            <input type="hidden" name="persona" value="fan" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Email Portal</label>
                                    <input type="email" name="email" required placeholder="fan@sanctuary.hub" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white text-sm focus:border-primary transition-all shadow-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block ml-6 leading-none">Security Key</label>
                                    <input type="password" name="password" required placeholder="••••••••••••" className="w-full bg-zinc-950 border border-zinc-900 px-8 py-5 rounded-[2rem] font-bold text-white text-sm focus:border-primary transition-all shadow-none" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Establishing..." : "Access Sanctuary"}
                            </button>
                        </Form>
                    )}

                    <footer className="pt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">Encrypted Connection</span>
                        <div className="flex gap-4">
                            {['Google', 'Twitter', 'Apple'].map(s => (
                                <button key={s} className="w-12 h-12 rounded-2xl border border-zinc-800 flex items-center justify-center hover:bg-zinc-950 transition-all group">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase group-hover:text-white transition-colors">{s[0]}</span>
                                </button>
                            ))}
                        </div>
                    </footer>

                    <p className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-12 italic">
                        Already sovereign? <Link to="/login" className="text-primary hover:text-white transition-colors">Sign in to your Hub</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
