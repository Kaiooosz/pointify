"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet, ArrowUpDown, Users, AlertCircle, CheckCircle2,
    RefreshCw, Shield, Info, ExternalLink, ChevronDown,
    ArrowRight, Bitcoin, Hash, Send, Copy, Check
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { FEES } from "@/lib/fees";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Mode = "choose" | "external" | "internal";
type Step = "form" | "confirm" | "success";
type Token = "USDT" | "BTC";

const TOKENS = {
    USDT: {
        label: "USDT", name: "Tether USD", icon: "$", color: "#26A17B",
        userBalance: 12.50, decimals: 4,
        feePercent: FEES.SWAP_USDT.PERCENT,
        networks: [
            { id: "TRC20", label: "TRC20", chain: "Tron Network", fee: "~0.1 USDT" },
            { id: "ERC20", label: "ERC20", chain: "Ethereum", fee: "Gas Fee" },
            { id: "BEP20", label: "BEP20", chain: "BNB Smart Chain", fee: "~0.05 USDT" },
            { id: "POLYGON", label: "Polygon", chain: "Polygon (MATIC)", fee: "~0.01 USDT" },
        ],
    },
    BTC: {
        label: "BTC", name: "Bitcoin", icon: "₿", color: "#F7931A",
        userBalance: 0.00042000, decimals: 8,
        feePercent: FEES.SWAP_BTC.PERCENT,
        networks: [
            { id: "BITCOIN", label: "Bitcoin", chain: "Bitcoin Network", fee: "~$2-10" },
            { id: "SOLANA", label: "Solana", chain: "Solana (wBTC)", fee: "~0.000005 SOL" },
            { id: "POLYGON_BTC", label: "Polygon", chain: "Polygon (wBTC)", fee: "~0.01 MATIC" },
            { id: "ERC20_BTC", label: "ERC20", chain: "Ethereum (wBTC)", fee: "Gas Fee" },
        ],
    },
} as const;

type Network = typeof TOKENS[Token]["networks"][number];

// Mock user balance PTS
const PTS_BALANCE = 12500;

// ─── TX ID fake para sucesso ──────────────────────────────────────────────────
function fakeTxId() {
    return "PTF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function WithdrawPage() {
    const { t } = useLanguage();

    // Mode
    const [mode, setMode] = useState<Mode>("choose");
    const [step, setStep] = useState<Step>("form");
    const [txId] = useState(fakeTxId);

    // External state
    const [selectedToken, setSelectedToken] = useState<Token>("USDT");
    const [selectedNetwork, setSelectedNetwork] = useState<Network>(TOKENS.USDT.networks[0]);
    const [amount, setAmount] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [showTokenDrop, setShowTokenDrop] = useState(false);
    const [showNetworkDrop, setShowNetworkDrop] = useState(false);

    // Internal state
    const [recipientId, setRecipientId] = useState("");
    const [ptsAmount, setPtsAmount] = useState("");
    const [description, setDescription] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const token = TOKENS[selectedToken];
    const amountNum = parseFloat(amount) || 0;
    const fee = amountNum * (token.feePercent / 100);
    const net = amountNum - fee;
    const ptsNum = parseInt(ptsAmount) || 0;

    const handleSelectToken = (key: Token) => {
        setSelectedToken(key);
        setSelectedNetwork(TOKENS[key].networks[0] as Network);
        setShowTokenDrop(false);
        setAmount("");
    };

    const handleExternalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (amountNum <= 0) { setError("Informe um valor válido."); return; }
        if (amountNum > token.userBalance) { setError("Saldo insuficiente."); return; }
        if (!walletAddress || walletAddress.length < 20) { setError("Informe um endereço de carteira válido."); return; }
        setStep("confirm");
    };

    const handleInternalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!recipientId.startsWith("PTF-") && recipientId.length < 8) { setError("Informe um ID Pointify válido (começa com PTF-)."); return; }
        if (ptsNum < 1) { setError("Informe uma quantidade de pontos válida."); return; }
        if (ptsNum > PTS_BALANCE) { setError("Saldo de pontos insuficiente."); return; }
        setStep("confirm");
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsLoading(false);
        setStep("success");
    };

    const copyTxId = () => {
        navigator.clipboard.writeText(txId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setMode("choose");
        setStep("form");
        setAmount("");
        setWalletAddress("");
        setRecipientId("");
        setPtsAmount("");
        setDescription("");
        setError(null);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0B0B0B] p-6 md:p-10">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                            <Send className="w-5 h-5 text-[#1DB954]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Pagamentos</h1>
                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Retirada ou Transferência</p>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">

                    {/* ══ ESCOLHA DO MODO ══════════════════════════════════ */}
                    {mode === "choose" && (
                        <motion.div key="choose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">

                            {/* Card: Retirada para Carteira */}
                            <button onClick={() => setMode("external")} className="w-full text-left p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 hover:border-[#1DB954]/30 transition-all group">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1DB954]/20 transition-all">
                                        <Wallet className="w-6 h-6 text-[#1DB954]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white uppercase tracking-tight">Retirada para Carteira</p>
                                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Enviar USDT ou BTC para sua hot/cold wallet</p>
                                        <div className="flex gap-3 mt-4">
                                            {["USDT", "BTC"].map(tk => (
                                                <span key={tk} className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10">{tk}</span>
                                            ))}
                                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-400/5 border border-amber-400/10">
                                                Taxa: {FEES.SWAP_USDT.PERCENT}%-{FEES.SWAP_BTC.PERCENT}%
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#A7A7A7] group-hover:text-[#1DB954] group-hover:translate-x-1 transition-all mt-1" />
                                </div>
                            </button>

                            {/* Card: Transferência Interna */}
                            <button onClick={() => setMode("internal")} className="w-full text-left p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 hover:border-sky-500/30 transition-all group">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 transition-all">
                                        <Users className="w-6 h-6 text-sky-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white uppercase tracking-tight">Transferência Pointify</p>
                                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Enviar pontos para outro usuário pelo ID</p>
                                        <div className="flex gap-3 mt-4">
                                            <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10">PTS</span>
                                            <span className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1DB954]/5 border border-[#1DB954]/10">
                                                Sem taxa
                                            </span>
                                            <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-sky-400/5 border border-sky-400/10">
                                                Instantâneo
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#A7A7A7] group-hover:text-sky-400 group-hover:translate-x-1 transition-all mt-1" />
                                </div>
                            </button>

                            {/* Info nota */}
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 mt-2">
                                <Info className="w-4 h-4 text-[#1DB954] flex-shrink-0 mt-0.5" />
                                <p className="text-[9px] font-black text-[#A7A7A7]/60 uppercase tracking-widest leading-relaxed">
                                    Transferências internas entre usuários Pointify são gratuitas e instantâneas. Retiradas para carteiras externas estão sujeitas à taxa da rede.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* ══ RETIRADA EXTERNA ════════════════════════════════ */}
                    {mode === "external" && step === "form" && (
                        <motion.div key="ext-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                            {/* Back */}
                            <button onClick={() => setMode("choose")} className="flex items-center gap-2 text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white transition-colors mb-6">
                                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Voltar
                            </button>

                            {/* Saldo */}
                            <div className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${token.color}15`, border: `1px solid ${token.color}30` }}>
                                        <span className="text-sm font-black" style={{ color: token.color }}>{token.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Saldo Disponível</p>
                                        <p className="text-lg font-black text-white">{token.userBalance.toFixed(token.decimals)} <span className="text-sm" style={{ color: token.color }}>{token.label}</span></p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Taxa: <span style={{ color: token.color }}>{token.feePercent}%</span></div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-3">
                                        <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                        <p className="text-xs font-black text-rose-500/80 uppercase tracking-wide">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleExternalSubmit} className="space-y-4">
                                {/* Token selector */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">Ativo</label>
                                    <div className="relative">
                                        <button type="button" onClick={() => setShowTokenDrop(!showTokenDrop)}
                                            className="w-full flex items-center justify-between px-6 py-4 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-black" style={{ backgroundColor: token.color }}>{token.icon}</div>
                                                <div className="text-left">
                                                    <p className="text-xs font-black text-white uppercase">{token.label}</p>
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{token.name}</p>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[#A7A7A7] transition-transform ${showTokenDrop ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showTokenDrop && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#111] border border-white/5 overflow-hidden z-20 shadow-2xl">
                                                    {(Object.keys(TOKENS) as Token[]).map(key => {
                                                        const tk = TOKENS[key];
                                                        return (
                                                            <button key={key} type="button" onClick={() => handleSelectToken(key)}
                                                                className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-all text-left">
                                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black" style={{ backgroundColor: tk.color }}>{tk.icon}</div>
                                                                <div>
                                                                    <p className="text-xs font-black text-white uppercase">{tk.label}</p>
                                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{tk.name} · Taxa {tk.feePercent}%</p>
                                                                </div>
                                                                {selectedToken === key && <div className="ml-auto w-2 h-2 rounded-full bg-[#1DB954]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Rede */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">Rede</label>
                                    <div className="relative">
                                        <button type="button" onClick={() => setShowNetworkDrop(!showNetworkDrop)}
                                            className="w-full flex items-center justify-between px-6 py-4 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-[#1DB954]/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-4 h-4 text-[#1DB954]" />
                                                <div className="text-left">
                                                    <p className="text-xs font-black text-white uppercase">{selectedNetwork.label}</p>
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{selectedNetwork.chain} · {selectedNetwork.fee}</p>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[#A7A7A7] transition-transform ${showNetworkDrop ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showNetworkDrop && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#111] border border-white/5 overflow-hidden z-10 shadow-2xl">
                                                    {token.networks.map(net => (
                                                        <button key={net.id} type="button" onClick={() => { setSelectedNetwork(net as Network); setShowNetworkDrop(false); }}
                                                            className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-white/5 transition-all ${selectedNetwork.id === net.id ? "text-[#1DB954]" : "text-[#A7A7A7]"}`}>
                                                            <Shield className="w-4 h-4 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-black uppercase">{net.label}</p>
                                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{net.chain} · {net.fee}</p>
                                                            </div>
                                                            {selectedNetwork.id === net.id && <div className="ml-auto w-2 h-2 rounded-full bg-[#1DB954] shadow-[0_0_6px_#1DB954]" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Valor */}
                                <div className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Valor</span>
                                        <button type="button" onClick={() => setAmount(token.userBalance.toString())}
                                            className="text-[9px] font-black text-[#1DB954] uppercase px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20">MAX</button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="number" step="any" placeholder="0" value={amount} onChange={e => { setAmount(e.target.value); setError(null); }}
                                            className="flex-1 bg-transparent text-3xl font-black text-white outline-none placeholder:text-white/10" />
                                        <span className="text-sm font-black" style={{ color: token.color }}>{token.label}</span>
                                    </div>
                                    {amountNum > 0 && (
                                        <div className="flex justify-between text-[9px] font-black text-[#A7A7A7]/50 uppercase tracking-widest pt-2 border-t border-white/5">
                                            <span>Taxa ({token.feePercent}%): {fee.toFixed(token.decimals)} {token.label}</span>
                                            <span>Líquido: {net.toFixed(token.decimals)} {token.label}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Carteira */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">Endereço da Carteira ({selectedNetwork.label})</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]/40" />
                                        <input type="text" placeholder="Coloque o endereço da carteira" value={walletAddress} onChange={e => { setWalletAddress(e.target.value); setError(null); }}
                                            className="w-full h-16 pl-16 pr-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-[#1DB954]/30 focus:border-[#1DB954] focus:outline-none text-white font-black text-xs uppercase tracking-wider placeholder:text-[#A7A7A7]/20 transition-all" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all hover:scale-[1.02]">
                                    Revisar Retirada
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ══ TRANSFERÊNCIA INTERNA ════════════════════════════ */}
                    {mode === "internal" && step === "form" && (
                        <motion.div key="int-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                            <button onClick={() => setMode("choose")} className="flex items-center gap-2 text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white transition-colors mb-6">
                                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Voltar
                            </button>

                            {/* Saldo PTS */}
                            <div className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                                        <span className="text-sm font-black text-[#1DB954]">P</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Saldo Disponível</p>
                                        <p className="text-lg font-black text-white">{PTS_BALANCE.toLocaleString()} <span className="text-sm text-[#1DB954]">PTS</span></p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20">
                                    Sem Taxa
                                </span>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-3">
                                        <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                        <p className="text-xs font-black text-rose-500/80 uppercase tracking-wide">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleInternalSubmit} className="space-y-4">
                                {/* ID do destinatário */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">ID do Destinatário Pointify</label>
                                    <div className="relative">
                                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]/40" />
                                        <input type="text" placeholder="PTF-XXXXXXXX" value={recipientId} onChange={e => { setRecipientId(e.target.value.toUpperCase()); setError(null); }}
                                            className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-sky-500/30 focus:border-sky-500 focus:outline-none text-white font-black text-sm uppercase tracking-widest placeholder:text-[#A7A7A7]/20 transition-all" />
                                    </div>
                                    <p className="text-[9px] font-black text-[#A7A7A7]/50 uppercase tracking-widest px-2">O destinatário pode encontrar seu ID em Perfil → Meu ID</p>
                                </div>

                                {/* Quantidade PTS */}
                                <div className="p-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Pontos a Enviar</span>
                                        <button type="button" onClick={() => setPtsAmount(PTS_BALANCE.toString())}
                                            className="text-[9px] font-black text-[#1DB954] uppercase px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20">MAX</button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="number" min="1" placeholder="0" value={ptsAmount} onChange={e => { setPtsAmount(e.target.value); setError(null); }}
                                            className="flex-1 bg-transparent text-3xl font-black text-white outline-none placeholder:text-white/10" />
                                        <span className="text-sm font-black text-[#1DB954]">PTS</span>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest px-2">Descrição (opcional)</label>
                                    <input type="text" placeholder="Ex: Pagamento de serviço" value={description} onChange={e => setDescription(e.target.value)}
                                        className="w-full h-14 px-6 rounded-[2rem] bg-[#0F0F0F] border border-white/5 hover:border-white/10 focus:border-white/20 focus:outline-none text-white font-black text-xs uppercase tracking-widest placeholder:text-[#A7A7A7]/20 transition-all" />
                                </div>

                                <button type="submit" className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-sky-500 text-black hover:bg-sky-400 transition-all hover:scale-[1.02]">
                                    Revisar Transferência
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ══ CONFIRMAÇÃO ════════════════════════════════════ */}
                    {step === "confirm" && mode !== "choose" && (
                        <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                            <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 space-y-5">
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Resumo</p>

                                {mode === "external" ? (
                                    <>
                                        {[
                                            { label: "Ativo", value: `${token.label} · ${token.name}` },
                                            { label: "Rede", value: `${selectedNetwork.label} — ${selectedNetwork.chain}` },
                                            { label: "Valor Bruto", value: `${amountNum.toFixed(token.decimals)} ${token.label}` },
                                            { label: `Taxa (${token.feePercent}%)`, value: `${fee.toFixed(token.decimals)} ${token.label}` },
                                            { label: "Valor Líquido", value: `${net.toFixed(token.decimals)} ${token.label}`, highlight: true },
                                            { label: "Carteira", value: `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` },
                                        ].map(({ label, value, highlight }) => (
                                            <div key={label} className="flex justify-between py-3 border-b border-white/5">
                                                <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{label}</span>
                                                <span className={`text-xs font-black uppercase tracking-wider ${highlight ? "text-[#1DB954]" : "text-white"}`}>{value}</span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {[
                                            { label: "Destinatário ID", value: recipientId },
                                            { label: "Pontos", value: `${ptsNum.toLocaleString()} PTS` },
                                            { label: "Taxa", value: "0 PTS (gratuito)", highlight: true },
                                            ...(description ? [{ label: "Descrição", value: description }] : []),
                                        ].map(({ label, value, highlight }) => (
                                            <div key={label} className="flex justify-between py-3 border-b border-white/5">
                                                <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{label}</span>
                                                <span className={`text-xs font-black uppercase tracking-wider ${highlight ? "text-[#1DB954]" : "text-white"}`}>{value}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[9px] font-black text-amber-400/70 uppercase tracking-widest leading-relaxed">
                                    {mode === "external"
                                        ? "Verifique o endereço com atenção. Transações em blockchain são irreversíveis."
                                        : "Confirme o ID do destinatário. Transferências internas são instantâneas e irreversíveis."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setStep("form")} className="py-5 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 text-[#A7A7A7] hover:text-white hover:border-white/20 transition-all">
                                    Editar
                                </button>
                                <button onClick={handleConfirm} disabled={isLoading}
                                    className={`py-5 rounded-full font-black text-[10px] uppercase tracking-widest text-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${mode === "external" ? "bg-[#1DB954] hover:bg-[#1ED760]" : "bg-sky-500 hover:bg-sky-400"}`}>
                                    {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processando...</> : "Confirmar"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ══ SUCESSO ════════════════════════════════════════ */}
                    {step === "success" && (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                            <div className="p-10 rounded-[3rem] bg-[#0F0F0F] border border-[#1DB954]/10 space-y-6">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                                    className="w-20 h-20 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-9 h-9 text-[#1DB954]" />
                                </motion.div>

                                <div>
                                    <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.4em] mb-2">
                                        {mode === "external" ? "Retirada Enviada" : "Transferência Concluída"}
                                    </p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {mode === "external"
                                            ? `${net.toFixed(token.decimals)} ${token.label}`
                                            : `${ptsNum.toLocaleString()} PTS`}
                                    </h2>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">
                                        {mode === "external"
                                            ? `${selectedNetwork.label} · ${selectedNetwork.chain} · Até 30 min`
                                            : `Para ${recipientId} · Instantâneo`}
                                    </p>
                                </div>

                                {/* TX ID */}
                                <button onClick={copyTxId} className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 hover:border-white/10 transition-all">
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">ID:</p>
                                    <p className="text-xs font-black text-white tracking-widest flex-1 text-left">{txId}</p>
                                    {copied ? <Check className="w-4 h-4 text-[#1DB954]" /> : <Copy className="w-4 h-4 text-[#A7A7A7]" />}
                                </button>
                            </div>

                            <button onClick={reset} className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all hover:scale-[1.02]">
                                Nova Operação
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
