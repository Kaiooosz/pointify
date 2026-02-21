"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpDown, Wallet, AlertCircle, CheckCircle2,
    RefreshCw, Shield, Info, ExternalLink, ChevronDown, Bitcoin, Coins
} from "lucide-react";
import { calcSwapFeePercent, FEES } from "@/lib/fees";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect, useState } from "react";
import { getUserBalance } from "@/actions/user-actions";

// ─── Tokens & Redes disponíveis ───────────────────────────────────────────────
const TOKENS = {
    USDT: {
        label: "USDT",
        name: "Tether USD",
        icon: "$",
        color: "#1DB954",
        ratePerPts: 0.001, // 1000 PTS = 1 USDT
        networks: [
            { id: "TRC20", label: "TRC20", chain: "Tron Network", fee: "~0.1 USDT" },
            { id: "ERC20", label: "ERC20", chain: "Ethereum", fee: "Gas Fee" },
            { id: "BEP20", label: "BEP20", chain: "BNB Smart Chain", fee: "~0.05 USDT" },
            { id: "POLYGON", label: "Polygon", chain: "Polygon (MATIC)", fee: "~0.01 USDT" },
        ],
    },
    BTC: {
        label: "BTC",
        name: "Bitcoin",
        icon: "₿",
        color: "#F7931A",
        ratePerPts: 0.0000001, // 1000 PTS = 0.0001 BTC (mock)
        networks: [
            { id: "BITCOIN", label: "Bitcoin", chain: "Bitcoin Network", fee: "~$2-10" },
            { id: "BEP20_BTC", label: "BEP20", chain: "BNB Smart Chain (wBTC)", fee: "~0.0005 BNB" },
            { id: "SOLANA", label: "Solana", chain: "Solana (wBTC)", fee: "~0.000005 SOL" },
            { id: "POLYGON_BTC", label: "Polygon", chain: "Polygon (wBTC)", fee: "~0.01 MATIC" },
            { id: "ERC20_BTC", label: "ERC20", chain: "Ethereum (wBTC)", fee: "Gas Fee" },
            { id: "TRC20_BTC", label: "TRC20", chain: "Tron (wBTC)", fee: "~0.1 TRX" },
        ],
    },
} as const;

type TokenKey = keyof typeof TOKENS;
type Network = typeof TOKENS[TokenKey]["networks"][number];
type Step = "form" | "confirm" | "success";

const MIN_PTS = 100;

export default function SwapPage() {
    const { t } = useLanguage();

    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>("form");
    const [selectedToken, setSelectedToken] = useState<TokenKey>("USDT");
    const [selectedNetwork, setSelectedNetwork] = useState<Network>(TOKENS.USDT.networks[0]);
    const [ptsAmount, setPtsAmount] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTokenDropdown, setShowTokenDropdown] = useState(false);
    const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
    const [userBalance, setUserBalance] = useState<number>(0);

    const fetchData = async () => {
        const res = await getUserBalance();
        if (res.success) {
            setUserBalance(res.balance ?? 0);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const token = TOKENS[selectedToken];
    const FEE_PERCENT = calcSwapFeePercent(selectedToken as "USDT" | "BTC");
    const ptsValue = parseFloat(ptsAmount) || 0;
    const cryptoRaw = ptsValue * token.ratePerPts;
    const fee = cryptoRaw * (FEE_PERCENT / 100);
    const cryptoFinal = cryptoRaw - fee;

    const handleSelectToken = (key: TokenKey) => {
        setSelectedToken(key);
        setSelectedNetwork(TOKENS[key].networks[0]);
        setShowTokenDropdown(false);
        setPtsAmount("");
        setError(null);
    };

    const handleMax = () => setPtsAmount(userBalance.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (ptsValue < MIN_PTS) {
            setError(t("swap_min_error").replace("{min}", MIN_PTS.toString()));
            return;
        }
        if (ptsValue > userBalance) {
            setError(t("swap_balance_error"));
            return;
        }
        if (!walletAddress || walletAddress.length < 20) {
            setError(t("swap_wallet_error"));
            return;
        }
        setStep("confirm");
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setIsLoading(false);
        setStep("success");
    };

    const handleReset = () => {
        setStep("form");
        setPtsAmount("");
        setWalletAddress("");
        setError(null);
        fetchData(); // Refresh balance after "success"
    };

    const cryptoDecimals = selectedToken === "BTC" ? 8 : 4;

    return (
        <div className="min-h-screen bg-black p-6 md:p-10">
            <div className="max-w-xl mx-auto">

                {/* ── Header ──────────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                            <ArrowUpDown className="w-5 h-5 text-[#1DB954]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t("swap_title")}</h1>
                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("swap_subtitle")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 mt-4">
                        <Info className="w-3.5 h-3.5 text-white/40" />
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">
                            {t("swap_rate")}: <span className="text-white">1.000 PTS = {selectedToken === "USDT" ? "1 USDT" : "0.0001 BTC"}</span>
                            &nbsp;·&nbsp;
                            {t("swap_fee")}: <span className="text-[#1DB954]">{selectedToken === "USDT" ? FEES.SWAP_USDT.PERCENT : FEES.SWAP_BTC.PERCENT}%</span>
                        </p>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ── FORM ─────────────────────────────────────────────── */}
                    {step === "form" && (
                        <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                            {/* Balance */}
                            <div className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#1DB954]/10 flex items-center justify-center">
                                        <Wallet className="w-4 h-4 text-[#1DB954]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("available_balance")}</p>
                                        <p className="text-lg font-black text-white">{mounted ? userBalance.toLocaleString() : "0"} <span className="text-[#A7A7A7] text-sm">PTS</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">≈ {selectedToken}</p>
                                    <p className="text-lg font-black text-white">{(userBalance * token.ratePerPts).toFixed(cryptoDecimals)}</p>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                        <AlertCircle className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
                                        <p className="text-xs font-black text-[#1DB954] uppercase tracking-wide">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* FROM: PTS */}
                                <div className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("swap_from")}</span>
                                        <button type="button" onClick={handleMax} className="text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                            MAX
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
                                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[8px] font-black text-black">P</div>
                                            <span className="text-xs font-black text-white uppercase">PTS</span>
                                        </div>
                                        <input
                                            type="number" min={MIN_PTS} max={userBalance} placeholder="0"
                                            value={ptsAmount}
                                            onChange={(e) => { setPtsAmount(e.target.value); setError(null); }}
                                            className="flex-1 bg-transparent text-2xl font-black text-white outline-none placeholder:text-white/10 text-right focus:text-[#1DB954] transition-colors"
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-[#A7A7A7]/50 uppercase tracking-widest text-right">{t("swap_min")}: {MIN_PTS} PTS</p>
                                </div>

                                {/* Arrow */}
                                <div className="flex justify-center">
                                    <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/5 border border-[#1DB954]/10 flex items-center justify-center">
                                        <ArrowUpDown className="w-4 h-4 text-[#1DB954]" />
                                    </div>
                                </div>

                                {/* TO: Token selector + amount */}
                                <div className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 space-y-4">
                                    <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("swap_to")}</span>

                                    {/* Token selector */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 transition-all"
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-black ${selectedToken === 'BTC' ? 'bg-[#F7931A]' : 'bg-[#1DB954]'}`}>
                                                {token.icon}
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-wider text-white">{token.label}</span>
                                            <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{token.name}</span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-[#A7A7A7] transition-transform ml-1 ${showTokenDropdown ? "rotate-180" : ""}`} />
                                        </button>

                                        <AnimatePresence>
                                            {showTokenDropdown && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 rounded-2xl bg-[#111] border border-white/5 overflow-hidden z-20 shadow-2xl min-w-[200px]">
                                                    {(Object.keys(TOKENS) as TokenKey[]).map((key) => {
                                                        const tk = TOKENS[key];
                                                        return (
                                                            <button
                                                                key={key} type="button"
                                                                onClick={() => handleSelectToken(key)}
                                                                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-all text-left"
                                                            >
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black ${key === 'BTC' ? 'bg-[#F7931A]' : 'bg-[#1DB954]'}`}>
                                                                    {tk.icon}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-white uppercase tracking-wider">{tk.label}</p>
                                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{tk.name}</p>
                                                                </div>
                                                                {selectedToken === key && <div className={`ml-auto w-2 h-2 rounded-full shadow-[0_0_6px_rgba(29,185,84,0.4)] ${key === 'BTC' ? 'bg-[#F7931A]' : 'bg-[#1DB954]'}`} />}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Amount preview */}
                                    <p className="text-2xl font-black text-white text-right">
                                        {cryptoFinal > 0 ? cryptoFinal.toFixed(cryptoDecimals) : "0." + "0".repeat(cryptoDecimals)}
                                        <span className="text-sm ml-2 text-[#A7A7A7]">{token.label}</span>
                                    </p>

                                    {ptsValue > 0 && (
                                        <div className="flex justify-between text-[9px] font-black text-[#A7A7A7]/50 uppercase tracking-widest">
                                            <span>{t("swap_fee_label")}: {fee.toFixed(cryptoDecimals)} {token.label}</span>
                                            <span>{t("swap_net")}: {cryptoFinal.toFixed(cryptoDecimals)} {token.label}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Network selector */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">{t("swap_network")}</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                                            className="w-full flex items-center justify-between px-6 py-4 rounded-[2rem] bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#1DB954]/10 flex items-center justify-center">
                                                    <Shield className="w-4 h-4 text-[#1DB954]" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-black text-white uppercase tracking-wider">{selectedNetwork.label}</p>
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{selectedNetwork.chain} · {selectedNetwork.fee}</p>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[#A7A7A7] transition-transform ${showNetworkDropdown ? "rotate-180" : ""}`} />
                                        </button>

                                        <AnimatePresence>
                                            {showNetworkDropdown && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#111] border border-white/5 overflow-hidden z-10 shadow-2xl">
                                                    {token.networks.map((net) => (
                                                        <button
                                                            key={net.id} type="button"
                                                            onClick={() => { setSelectedNetwork(net); setShowNetworkDropdown(false); }}
                                                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all hover:bg-white/5 ${selectedNetwork.id === net.id ? "text-white" : "text-[#A7A7A7]"}`}
                                                        >
                                                            <Shield className="w-4 h-4 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-widest">{net.label}</p>
                                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{net.chain} · {t("swap_network_fee")}: {net.fee}</p>
                                                            </div>
                                                            {selectedNetwork.id === net.id && <div className="ml-auto w-2 h-2 rounded-full bg-[#1DB954] shadow-[0_0_6px_#1DB954]" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Wallet address */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">{t("swap_wallet_label")} ({selectedNetwork.label})</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]/40" />
                                        <input
                                            type="text"
                                            placeholder={t("swap_wallet_ph")}
                                            value={walletAddress}
                                            onChange={(e) => { setWalletAddress(e.target.value); setError(null); }}
                                            className="w-full h-16 pl-16 pr-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 hover:border-white/10 focus:border-white/20 focus:outline-none text-white font-black text-xs uppercase tracking-widest placeholder:text-[#A7A7A7]/20 transition-all focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t("swap_continue")}
                                </button>
                            </form>

                            <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                <Shield className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                                <p className="text-[9px] font-black text-[#A7A7A7]/60 uppercase tracking-widest leading-relaxed">{t("swap_security_note")}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ── CONFIRM ──────────────────────────────────────────── */}
                    {step === "confirm" && (
                        <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
                            <div className="p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 space-y-6">
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("swap_review")}</p>
                                <div className="space-y-4">
                                    {[
                                        { label: t("swap_from"), value: `${mounted ? ptsValue.toLocaleString() : ptsValue} PTS` },
                                        { label: t("swap_to"), value: `${cryptoFinal.toFixed(cryptoDecimals)} ${token.label}` },
                                        { label: t("swap_fee_label"), value: `${fee.toFixed(cryptoDecimals)} ${token.label} (${FEE_PERCENT}%)` },
                                        { label: t("swap_network"), value: `${selectedNetwork.label} · ${selectedNetwork.chain}` },
                                        { label: t("swap_wallet_label"), value: `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center py-3 border-b border-white/5">
                                            <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{label}</span>
                                            <span className="text-xs font-black text-white uppercase tracking-wider">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 text-white/70 flex-shrink-0" />
                                <p className="text-[9px] font-black text-white/70 uppercase tracking-widest leading-relaxed">{t("swap_confirm_warning")}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setStep("form")} className="py-5 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 text-[#A7A7A7] hover:text-white hover:border-white/20 transition-all">
                                    {t("back_and_edit")}
                                </button>
                                <button onClick={handleConfirm} disabled={isLoading} className="py-5 rounded-full font-black text-[10px] uppercase tracking-widest bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                    {isLoading ? (<><RefreshCw className="w-4 h-4 animate-spin text-black" />{t("swap_processing")}</>) : t("confirm_and_send")}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── SUCCESS ──────────────────────────────────────────── */}
                    {step === "success" && (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center space-y-8">
                            <div className="p-10 rounded-[3rem] bg-[#0A0A0A] border border-white/5 space-y-6">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="w-20 h-20 rounded-full bg-[#1DB954] flex items-center justify-center mx-auto shadow-2xl">
                                    <CheckCircle2 className="w-9 h-9 text-black" />
                                </motion.div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-2">{t("swap_success_title")}</p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {cryptoFinal.toFixed(cryptoDecimals)} <span className="text-[#A7A7A7]">{token.label}</span>
                                    </h2>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{mounted ? ptsValue.toLocaleString() : ptsValue} PTS {t("swap_converted")}</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2">
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("swap_wallet_label")}</p>
                                    <p className="text-xs font-black text-white tracking-wider break-all">{walletAddress}</p>
                                    <p className="text-[9px] font-black text-[#A7A7A7]/50 uppercase tracking-widest">{selectedNetwork.label} · {selectedNetwork.chain} · {t("swap_delivery_time")}</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02]">
                                {t("swap_new")}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
