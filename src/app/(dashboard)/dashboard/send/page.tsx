"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Send, Search, Loader2, CheckCircle2, ArrowRight, ArrowLeft, Info, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { sendPoints, getUserBalance } from "@/actions/user-actions";

export const dynamic = "force-dynamic";

export default function SendPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [formData, setFormData] = useState({
        recipient: "",
        amount: "",
        description: ""
    });

    useEffect(() => {
        getUserBalance().then(res => {
            if (res.success) setBalance(res.balance || 0);
        });
    }, []);

    const amountNum = parseInt(formData.amount) || 0;
    const isExternalPix = formData.recipient.includes("@") || formData.recipient.length > 20 || /^\d+$/.test(formData.recipient); // Simplified check for PIX key
    const feePercent = isExternalPix ? 1 : 0; // 1% for PIX QR/Key, 0% for internal
    const feeAmount = Math.ceil(amountNum * (feePercent / 100));
    const totalToDebit = amountNum + feeAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (totalToDebit > balance) {
            alert("Saldo insuficiente considerando a taxa.");
            return;
        }
        setStep(2); // Confirmation step
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            // Internal transfer or PIX Withdrawal (simplified logic here)
            const res = await sendPoints(formData.recipient, amountNum, formData.description);
            if (res.success) {
                setStep(3);
            } else {
                alert((res as any).error || "Falha ao enviar pontos");
            }
        } catch (error) {
            alert("Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            {/* Header com Estilo Spotify consistent */}
            <div className="flex flex-col gap-1 px-4 mt-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                        <Send className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{t("send_points_title")}</h2>
                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em] mt-1">Network Transfer Protocol · Instantâneo</p>
                    </div>
                </div>
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
                        <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_50px_rgba(29,185,84,0.05)] rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-6 border-b border-[#1DB954]/10 bg-[#1DB954]/[0.01]">
                                <CardTitle className="text-white font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                                            <Send className="w-4 h-4 text-[#1DB954]" />
                                        </div>
                                        {t("recipient_data")}
                                    </div>
                                    <Button variant="ghost" className="h-10 px-6 rounded-full text-[9px] font-black uppercase tracking-widest text-[#A7A7A7] hover:text-[#1DB954] hover:bg-[#1DB954]/10 transition-all border border-white/5">
                                        <QrCode className="w-3.5 h-3.5 mr-2" />
                                        Escanear QR
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-10 p-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4 leading-none">Chave PIX ou E-mail do Usuário</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#1DB954]/20 to-transparent rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                                        <div className="relative">
                                            <Input
                                                placeholder="Ex: pix@pointify.com ou (11) 99999-9999"
                                                className="h-16 pl-14 pr-8 rounded-full border-[#1DB954]/10 bg-[#080808] font-black text-xs uppercase tracking-widest focus-visible:ring-[#1DB954]/40 focus-visible:border-[#1DB954]/40 transition-all text-white placeholder:text-[#A7A7A7]/20"
                                                value={formData.recipient}
                                                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                                required
                                            />
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4 leading-none">{t("amount_in_points")}</label>
                                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#080808] border border-[#1DB954]/10 group-focus-within:border-[#1DB954]/40 transition-all p-8 shadow-inner">
                                        <div className="flex items-baseline gap-4">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className="h-20 text-7xl font-black px-0 bg-transparent border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white tracking-tighter"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                required
                                            />
                                            <span className="text-2xl font-black text-[#1DB954] tracking-tighter opacity-50">PTS</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-[#1DB954]/60" />
                                            <p className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-[0.2em]">
                                                {t("available_balance_label")}: <span className="text-white">{balance.toLocaleString()} PTS</span>
                                            </p>
                                        </div>
                                        {feePercent > 0 && (
                                            <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest leading-none">Taxa Externo PIX: {feePercent}%</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4 leading-none">{t("description_optional")}</label>
                                    <Input
                                        placeholder={t("payment_purpose")}
                                        className="h-16 px-8 rounded-full border-[#1DB954]/10 bg-[#080808] font-black text-xs uppercase tracking-widest focus-visible:ring-[#1DB954]/40 focus-visible:border-[#1DB954]/40 transition-all text-white"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 pt-0">
                                <Button
                                    className="w-full h-16 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(29,185,84,0.15)] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all group border-none"
                                    onClick={handleSubmit}
                                    disabled={!formData.recipient || !formData.amount || amountNum <= 0}
                                >
                                    {t("continue_to_review")}
                                    <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="px-4"
                    >
                        <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_80px_rgba(29,185,84,0.15)] rounded-[3rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#1DB954]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                            <CardHeader className="text-center pb-8 pt-12 px-8">
                                <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{t("confirm_send")}</CardTitle>
                                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em] mt-3">Revise os detalhes abaixo</p>
                            </CardHeader>
                            <CardContent className="space-y-10 p-10">
                                <div className="flex flex-col items-center py-12 px-8 bg-[#080808] rounded-[3rem] border border-[#1DB954]/10 shadow-2xl relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-6 relative z-10">{t("you_are_sending")}</p>
                                    <div className="flex items-baseline gap-3 relative z-10">
                                        <p className="text-7xl font-black text-[#1DB954] tracking-tighter">{formData.amount}</p>
                                        <p className="text-2xl font-black text-[#1DB954] opacity-30">PTS</p>
                                    </div>
                                    <div className="w-16 h-1 bg-[#1DB954]/20 rounded-full my-10 relative z-10" />
                                    <div className="text-center relative z-10">
                                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-3">{t("to")}</p>
                                        <p className="text-xl font-black text-white uppercase tracking-tight break-all">{formData.recipient}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 px-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                        <span className="text-[#A7A7A7]">Valor do Envio</span>
                                        <span className="text-white">{amountNum.toLocaleString()} PTS</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                        <span className="text-[#A7A7A7]">Taxa de Processamento ({feePercent}%)</span>
                                        <span className="text-[#1DB954]">{feeAmount.toLocaleString()} PTS</span>
                                    </div>
                                    <div className="h-px bg-[#1DB954]/10 w-full" />
                                    <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.4em]">
                                        <span className="text-[#A7A7A7]">Total a Debitar</span>
                                        <span className="text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">{totalToDebit.toLocaleString()} PTS</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 p-10 pt-0 pb-12">
                                <Button
                                    className="w-full h-16 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(29,185,84,0.3)] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all border-none"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-3" />
                                            {t("confirm_and_send")}
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" className="w-full h-12 font-black text-[#A7A7A7] hover:text-white text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 rounded-full transition-all" onClick={() => setStep(1)} disabled={isLoading}>
                                    <ArrowLeft className="w-4 h-4 mr-3" />
                                    {t("back_and_edit")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center px-4"
                    >
                        <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_100px_rgba(29,185,84,0.2)] py-20 rounded-[4rem] overflow-hidden relative">
                            <div className="absolute top-0 inset-x-0 h-2 bg-[#1DB954] shadow-[0_0_30px_rgba(29,185,84,0.6)]" />
                            <CardContent className="space-y-12">
                                <div className="relative mx-auto w-36 h-36">
                                    <div className="absolute inset-0 bg-[#1DB954]/20 rounded-full animate-ping" />
                                    <div className="relative w-36 h-36 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(29,185,84,0.4)]">
                                        <CheckCircle2 className="w-16 h-16 text-black" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{t("send_completed")}</h3>
                                    <p className="text-[#A7A7A7] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed text-[11px]">
                                        Seu envio de <span className="text-[#1DB954]">{formData.amount} PTS</span> para <span className="text-white">{formData.recipient}</span> foi processado com sucesso na rede Pointify.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10 px-10">
                                    <Button variant="outline" className="h-16 px-10 rounded-full font-black text-[11px] uppercase tracking-[0.3em] border-[#1DB954]/20 text-[#A7A7A7] hover:text-white hover:bg-[#1DB954]/10 transition-all w-full sm:w-auto" onClick={() => window.print()}>{t("receipt")}</Button>
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <Button className="h-16 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.3em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.3)] w-full border-none">
                                            {t("back_to_start")}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
