"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, Search, Loader2, CheckCircle2, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { sendPoints } from "@/actions/user-actions";

export default function SendPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        recipient: "",
        amount: "",
        description: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Confirmation step
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const res = await sendPoints(formData.recipient, parseInt(formData.amount), formData.description);
            if (res.success) {
                setStep(3);
            } else {
                alert((res as any).error || "Failed to send points");
            }
        } catch (error) {
            alert("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <div className="flex flex-col gap-1 px-4 mt-6">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{t("send_points_title")}</h2>
                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Network Point Distribution</p>
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
                                    <Send className="w-5 h-5 text-[#1DB954]" />
                                    {t("recipient_data")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-10 p-10">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2 leading-none">{t("email_or_id")}</label>
                                    <div className="relative group">
                                        <Input
                                            placeholder="Ex: joao@email.com"
                                            className="h-14 pl-12 rounded-full border-white/5 bg-[#181818] font-black text-xs uppercase tracking-widest focus-visible:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/20"
                                            value={formData.recipient}
                                            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                            required
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2 leading-none">{t("amount_in_points")}</label>
                                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#181818] border border-white/5 group-focus-within:border-[#1DB954]/50 transition-all p-6">
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
                                    <div className="flex items-center gap-2 px-4">
                                        <Info className="w-3.5 h-3.5 text-[#1DB954]" />
                                        <p className="text-[9px] text-[#A7A7A7] font-black uppercase tracking-[0.2em]">
                                            {t("available_balance_label")}: <span className="text-[#1DB954]">12.450 PTS</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2 leading-none">{t("description_optional")}</label>
                                    <Input
                                        placeholder={t("payment_purpose")}
                                        className="h-14 px-8 rounded-full border-white/5 bg-[#181818] font-black text-xs uppercase tracking-widest focus-visible:ring-[#1DB954]/20 transition-all text-white"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 pt-0">
                                <Button
                                    className="w-full h-16 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(29,185,84,0.2)] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all group border-none"
                                    onClick={handleSubmit}
                                    disabled={!formData.recipient || !formData.amount}
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
                        <Card className="border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-[#121212] relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                            <CardHeader className="text-center pb-8 pt-12 px-8">
                                <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{t("confirm_send")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-10 p-10">
                                <div className="flex flex-col items-center py-12 px-8 bg-[#181818] rounded-[3rem] border border-white/5 shadow-2xl">
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-6">{t("you_are_sending")}</p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-7xl font-black text-[#1DB954] tracking-tighter">{formData.amount}</p>
                                        <p className="text-2xl font-black text-[#1DB954] opacity-30">PTS</p>
                                    </div>
                                    <div className="w-16 h-1 bg-white/[0.03] rounded-full my-10" />
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-3">{t("to")}</p>
                                        <p className="text-xl font-black text-white uppercase tracking-tight">{formData.recipient}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 px-4">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-[#A7A7A7]">{t("processing_fee")}</span>
                                        <span className="text-[#1DB954]">0 PTS</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-[#A7A7A7]">{t("transaction_date")}</span>
                                        <span className="text-white">Hoje, {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 p-10 pt-0 pb-12">
                                <Button
                                    className="w-full h-16 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(29,185,84,0.3)] bg-[#1DB954] text-black hover:bg-[#1ED760] transition-all border-none"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-3" />
                                            {t("confirm_and_send")}
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" className="w-full h-12 font-black text-[#A7A7A7] hover:text-white text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 rounded-full" onClick={() => setStep(1)} disabled={isLoading}>
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
                        <Card className="border border-white/5 shadow-2xl py-20 rounded-[4rem] overflow-hidden relative bg-[#121212]">
                            <div className="absolute top-0 inset-x-0 h-2 bg-[#1DB954] shadow-[0_0_20px_#1DB954]" />
                            <CardContent className="space-y-12">
                                <div className="relative mx-auto w-32 h-32">
                                    <div className="absolute inset-0 bg-[#1DB954]/20 rounded-full animate-ping" />
                                    <div className="relative w-32 h-32 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(29,185,84,0.4)]">
                                        <CheckCircle2 className="w-16 h-16 text-black" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{t("send_completed")}</h3>
                                    <p className="text-[#A7A7A7] font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed text-[10px] opacity-60">
                                        {t("transaction_success").replace("{amount}", formData.amount)}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 px-10">
                                    <Button variant="outline" className="h-14 px-10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border-white/10 text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all w-full sm:w-auto" onClick={() => window.print()}>{t("receipt")}</Button>
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <Button className="h-14 px-12 rounded-full font-black text-[10px] uppercase tracking-[0.2em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-xl w-full border-none">
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
