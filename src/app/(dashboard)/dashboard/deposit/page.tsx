"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, CheckCircle2, ArrowRight, Share2, Download, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { createPixDeposit } from "@/actions/pix-actions";

export const dynamic = "force-dynamic";

export default function DepositPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1); // 1: Input, 2: PIX Display, 3: Receipt
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // For Receipt Snapshot
    const receiptRef = useRef<HTMLDivElement>(null);

    const handleCreatePix = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount);
        if (isNaN(value) || value < 1) {
            alert("Valor mínimo de R$ 1,00");
            return;
        }

        setLoading(true);
        const res = await createPixDeposit(value);
        if (res.success) {
            setPixData(res.pix);
            setStep(2);
        } else {
            alert(res.error || "Falha ao gerar PIX");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (!pixData?.copyPaste) return;
        navigator.clipboard.writeText(pixData.copyPaste);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Comprovante de Depósito - Pointify',
                    text: `Depósito de R$ ${parseFloat(amount).toFixed(2)} solicitado em ${new Date().toLocaleDateString()}`,
                    url: window.location.href, // Or a specific receipt URL if we had one
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Compartilhamento não suportado neste navegador. Tente tirar um print.");
        }
    };

    // Simulate "I Paid" which moves to Receipt
    const handleSimulatePayment = () => {
        // In real app, this would happen via webhook/socket update
        setStep(3);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <div className="flex flex-col gap-1 px-4 mt-6">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Depositar</h2>
                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Capital Infrastructure Integration</p>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-4"
                    >
                        <Card className="border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-[#121212]">
                            <CardHeader className="bg-white/[0.02] p-8 border-b border-white/5">
                                <CardTitle className="text-white font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                    <QrCode className="w-5 h-5 text-[#1DB954]" />
                                    Gerar QR Code PIX
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <form onSubmit={handleCreatePix} className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2 leading-none">Valor (BRL)</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1DB954] font-black text-xl">R$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="1"
                                                placeholder="0,00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="pl-16 h-20 rounded-full text-3xl font-black border-white/5 bg-[#181818] text-white focus:ring-[#1DB954]/20 transition-all placeholder:text-white/5"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="flex justify-between items-center px-4">
                                            <p className="text-[9px] text-[#A7A7A7] font-black uppercase tracking-widest opacity-40">Taxa de Operação: R$ 0,00</p>
                                            <p className="text-[9px] text-[#1DB954] font-black uppercase tracking-widest">Instantâneo</p>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-black uppercase tracking-[0.3em] text-xs shadow-[0_15px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] border-none"
                                    >
                                        {loading ? "Processando..." : "Gerar Pagamento"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6 px-4"
                    >
                        <Card className="border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-[#121212]">
                            <CardContent className="p-12 flex flex-col items-center text-center">
                                <div className="mb-10 relative">
                                    <div className="absolute inset-0 bg-[#1DB954]/10 blur-[60px] rounded-full" />
                                    <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-[#1DB954]/20">
                                        <img src={pixData.qrCode} alt="PIX QR" className="w-56 h-56 rounded-2xl mix-blend-multiply" />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-10">
                                    <p className="text-4xl font-black text-white tracking-tighter uppercase leading-none">R$ {parseFloat(amount).toFixed(2)}</p>
                                    <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Aguardando Confirmação em Tempo Real</p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="flex items-center gap-3 p-5 bg-[#181818] rounded-full border border-white/5 overflow-hidden">
                                        <code className="flex-1 text-[10px] font-black text-[#A7A7A7] truncate text-left uppercase tracking-widest px-2">{pixData.copyPaste}</code>
                                        <Button size="icon" variant="ghost" className="shrink-0 hover:bg-white/5 rounded-full" onClick={copyToClipboard}>
                                            {copied ? <CheckCircle2 className="w-5 h-5 text-[#1DB954]" /> : <Copy className="w-5 h-5 text-[#A7A7A7]" />}
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={copyToClipboard}
                                        className="w-full h-14 rounded-full font-black uppercase text-[10px] tracking-[0.2em] bg-white text-black hover:bg-white/90 border-none transition-all shadow-xl"
                                    >
                                        Copiar Código PIX
                                    </Button>
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/5 w-full space-y-6">
                                    <Button
                                        onClick={handleSimulatePayment}
                                        className="w-full h-14 rounded-full bg-[#181818] text-[#1DB954] hover:bg-[#282828] font-black uppercase text-[10px] tracking-[0.2em] border border-[#1DB954]/20 transition-all"
                                    >
                                        Simular Pagamento (Dev)
                                    </Button>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_8px_#1DB954]" />
                                        <p className="text-[8px] text-[#A7A7A7] font-black uppercase tracking-[0.3em] opacity-40">Polling Infrastructure v2.4 Active</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4"
                    >
                        <Card ref={receiptRef} className="border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-[#121212] relative">
                            <div className="absolute top-0 w-full h-1.5 bg-[#1DB954] shadow-[0_0_20px_#1DB954]" />

                            <CardContent className="p-12">
                                <div className="flex flex-col items-center text-center space-y-8">
                                    <div className="w-24 h-24 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(29,185,84,0.3)] mb-4">
                                        <CheckCircle2 className="w-12 h-12 text-black" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Sucesso!</h3>
                                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Capital On-Chain Confirmado</p>
                                    </div>

                                    <div className="w-full py-10 border-y border-white/5 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Valor Inserido</span>
                                            <span className="text-2xl font-black text-[#1DB954] tracking-tight">R$ {parseFloat(amount).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Data e Hora</span>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{new Date().toLocaleDateString("pt-BR")}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Protocolo</span>
                                            <span className="text-[10px] font-mono text-white/40 uppercase">{pixData?.transactionId.substring(0, 20)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <Button
                                            variant="outline"
                                            onClick={handleShare}
                                            className="h-14 rounded-full font-black uppercase text-[10px] tracking-[0.2em] border-white/10 bg-transparent text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Compartilhar
                                        </Button>
                                        <Button
                                            onClick={() => { setStep(1); setAmount(""); }}
                                            className="h-14 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-xl border-none"
                                        >
                                            Novo Depósito
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
