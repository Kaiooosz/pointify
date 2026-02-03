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
        <div className="max-w-2xl mx-auto space-y-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight px-2">{t("send_points_title")}</h2>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border border-slate-100 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="pb-8 pt-10 px-8">
                                <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">{t("recipient_data")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-10 px-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("email_or_id")}</label>
                                    <div className="relative group">
                                        <Input
                                            placeholder="Ex: joao@email.com"
                                            className="h-16 pl-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-bold text-lg"
                                            value={formData.recipient}
                                            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                            required
                                        />
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("amount_in_points")}</label>
                                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 group-focus-within:border-emerald-500/50 transition-all">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="h-24 text-6xl font-black px-8 bg-transparent border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-900 dark:text-white"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 dark:text-slate-600 pointer-events-none tracking-tighter">PTS</div>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <Info className="w-4 h-4 text-emerald-500" />
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t("available_balance_label")}: <span className="text-slate-900 dark:text-white font-black">12.450 PTS</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("description_optional")}</label>
                                    <Input
                                        placeholder={t("payment_purpose")}
                                        className="h-16 px-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 focus:border-emerald-500 transition-all font-bold"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="pt-8 pb-10 px-8">
                                <Button
                                    className="w-full h-18 text-xl font-black rounded-3xl shadow-2xl shadow-emerald-500/20 group"
                                    onClick={handleSubmit}
                                    disabled={!formData.recipient || !formData.amount}
                                >
                                    {t("continue_to_review")}
                                    <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border border-emerald-500/20 dark:border-emerald-500/10 bg-emerald-500/[0.02] shadow-2xl rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                            <CardHeader className="text-center pb-10 pt-12 px-8">
                                <CardTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("confirm_send")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-10 px-8">
                                <div className="flex flex-col items-center py-12 px-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-emerald-900/5">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{t("you_are_sending")}</p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-7xl font-black text-emerald-500 tracking-tighter">{formData.amount}</p>
                                        <p className="text-2xl font-black text-emerald-500/50">PTS</p>
                                    </div>
                                    <div className="w-32 h-1 bg-slate-50 dark:bg-white/5 rounded-full my-10" />
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{t("to")}</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{formData.recipient}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 px-4">
                                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{t("processing_fee")}</span>
                                        <span className="text-emerald-500">0 PTS</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{t("transaction_date")}</span>
                                        <span className="text-slate-900 dark:text-white">Hoje, 02 Feb</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 pt-12 pb-12 px-8">
                                <Button
                                    className="w-full h-18 text-xl font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-6 h-6 mr-3" />
                                            {t("confirm_and_send")}
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" className="w-full h-14 font-black text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm uppercase tracking-widest" onClick={() => setStep(1)} disabled={isLoading}>
                                    <ArrowLeft className="w-5 h-5 mr-3" />
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
                        className="text-center"
                    >
                        <Card className="border border-slate-100 dark:border-white/10 shadow-2xl py-16 rounded-[4rem] overflow-hidden relative bg-white dark:bg-slate-900">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                            <CardContent className="space-y-10">
                                <div className="relative mx-auto w-40 h-40">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                                    <div className="relative w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(16,185,129,0.4)]">
                                        <CheckCircle2 className="w-20 h-20 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t("send_completed")}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto leading-relaxed text-lg">
                                        {t("transaction_success").replace("{amount}", formData.amount)}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10 px-8">
                                    <Button variant="outline" className="h-16 px-10 rounded-2xl font-black text-base border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm" onClick={() => window.print()}>{t("receipt")}</Button>
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <Button className="h-16 px-12 rounded-2xl font-black text-base shadow-2xl shadow-emerald-500/20 w-full sm:w-auto">
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
