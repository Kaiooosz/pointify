"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Share2, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function ReceivePage() {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const userId = "USER-7284-KAI";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight px-2">{t("receive_points")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl">
                    <div className="relative group mb-10">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-emerald-500/30 transition-all" />
                        <div className="relative w-56 h-56 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-inner">
                            <QrCode className="w-40 h-40 text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <p className="text-base text-center text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 max-w-[280px]">
                        {t("scan_qr_desc")}
                    </p>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
                        <Share2 className="w-5 h-5 mr-3" />
                        {t("share_qr")}
                    </Button>
                </Card>

                <div className="space-y-8">
                    <Card className="border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader className="pt-10 px-8 pb-4">
                            <CardTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("your_id")}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                            <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner group">
                                <code className="flex-1 font-mono text-xl text-emerald-500 font-black tracking-tighter truncate">{userId}</code>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={`w-12 h-12 rounded-2xl transition-all ${copied ? "bg-emerald-500 text-white" : "hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400"}`}
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                            <AnimatePresence>
                                {copied && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-emerald-500 mt-4 font-black uppercase tracking-widest text-center"
                                    >
                                        {t("copied_success")}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Card className="bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <CardContent className="p-10">
                            <div className="flex gap-6">
                                <div className="mt-1 flex-shrink-0">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                                        <Info className="w-6 h-6 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-wider">{t("how_to_receive")}</h4>
                                    <ul className="space-y-4">
                                        {[
                                            t("receive_step1"),
                                            t("receive_step2"),
                                            t("receive_step3"),
                                            t("receive_step4")
                                        ].map((step, i) => (
                                            <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] flex items-center justify-center font-black">
                                                    {i + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
