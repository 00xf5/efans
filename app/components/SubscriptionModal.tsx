import { useState } from "react";
import Modal from "./Modal";

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    creatorName: string;
    price: string;
}

export default function SubscriptionModal({ isOpen, onClose, creatorName, price }: SubscriptionModalProps) {
    const [step, setStep] = useState<"options" | "payment" | "success">("options");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep("success");
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Subscribe to Creator">
            <div className="space-y-8 py-4 text-zinc-900 dark:text-white">
                {step === "options" && (
                    <>
                        <div className="text-center space-y-2">
                            <p className="text-zinc-500 font-medium italic">Unlocking exclusive access to</p>
                            <h2 className="text-3xl font-display font-black text-gradient uppercase">{creatorName}</h2>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="p-6 rounded-3xl border-2 border-primary bg-primary/5 cursor-pointer hover:scale-[1.02] transition-all"
                                onClick={() => setStep("payment")}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-lg">Monthly Access</h4>
                                        <p className="text-sm text-zinc-500 font-medium">Billed every 30 days. Cancel anytime.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-display font-black text-primary">${price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-zinc-100 dark:border-white/5 opacity-60 flex justify-between items-center grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                                <div>
                                    <h4 className="font-bold text-lg">Yearly Access</h4>
                                    <p className="text-sm text-zinc-500 font-medium">Save 20% with annual billing.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-display font-black text-zinc-400">$89.99</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                            By continuing, you agree to our Terms of Service and Age Verification policies.
                        </p>
                    </>
                )}

                {step === "payment" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card Details</h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    placeholder="Card Number"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                        placeholder="MM / YY"
                                    />
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                        placeholder="CVC"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-violet-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Securely Processing...</span>
                                </>
                            ) : (
                                <span>Confirm Payment • ${price}</span>
                            )}
                        </button>

                        <button
                            onClick={() => setStep("options")}
                            className="w-full py-2 text-sm font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {step === "success" && (
                    <div className="text-center space-y-6 py-8 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-5xl">
                            ✓
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-display font-black">Welcome to the Inner Circle.</h3>
                            <p className="text-zinc-500 font-medium">You now have full access to {creatorName}'s exclusive feed.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-zinc-900 text-white py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl active:scale-[0.98]"
                        >
                            Start Exploring
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
