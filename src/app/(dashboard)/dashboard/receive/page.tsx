"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Share2, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

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
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            <div className="flex flex-col gap-1 mt-6">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{t("receive_points")}</h2>
                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Direct Peer-to-Peer Reception Hub</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <Card className="lg:col-span-5 flex flex-col items-center justify-center p-12 bg-[#121212] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="relative group mb-12">
                        <div className="absolute inset-0 bg-[#1DB954]/10 rounded-[3rem] blur-[60px] group-hover:bg-[#1DB954]/20 transition-all duration-700" />
                        <div className="relative w-72 h-72 bg-white p-8 rounded-[3rem] border border-[#1DB954]/20 shadow-2xl flex items-center justify-center overflow-hidden">
                            <QrCode className="w-56 h-56 text-black" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-[#A7A7A7] font-black leading-relaxed mb-10 max-w-[240px] uppercase tracking-[0.2em]">
                        {t("scan_qr_desc")}
                    </p>
                    <Button className="w-full h-14 rounded-full font-black bg-white text-black hover:bg-white/90 shadow-xl transition-all uppercase text-[10px] tracking-[0.2em] border-none">
                        <Share2 className="w-4 h-4 mr-3" />
                        {t("share_qr")}
                    </Button>
                </Card>

                <div className="lg:col-span-7 space-y-8">
                    <Card className="bg-[#121212] border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
                        <CardHeader className="pt-10 px-10 pb-4 border-b border-white/5 bg-white/[0.02]">
                            <CardTitle className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em]">{t("your_id")}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="flex items-center gap-4 p-6 bg-[#181818] rounded-full border border-white/5 shadow-2xl group hover:border-[#1DB954]/30 transition-all">
                                <code className="flex-1 font-black text-2xl text-[#1DB954] tracking-tighter truncate px-4">{userId}</code>
                                <Button
                                    size="icon"
                                    className={`w-14 h-14 rounded-full transition-all border-none ${copied ? "bg-[#1DB954] text-black" : "bg-white/5 text-[#A7A7A7] hover:bg-[#1DB954] hover:text-black"}`}
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                </Button>
                            </div>
                            <AnimatePresence>
                                {copied && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[9px] text-[#1DB954] mt-6 font-black uppercase tracking-[0.3em] text-center"
                                    >
                                        ID Copiado com Sucesso
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#121212] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#1DB954]/5 rounded-full translate-y-1/2 translate-x-1/2 blur-[80px]" />
                        <CardContent className="p-10">
                            <div className="flex gap-8">
                                <div className="mt-1 flex-shrink-0">
                                    <div className="w-14 h-14 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center border border-[#1DB954]/20 shadow-xl">
                                        <Info className="w-6 h-6 text-[#1DB954]" />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="font-black text-sm text-white uppercase tracking-[0.3em] mb-2">{t("how_to_receive")}</h4>
                                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.2em] opacity-60">Segurança de Rede Pointify v4.0</p>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            t("receive_step1"),
                                            t("receive_step2"),
                                            t("receive_step3"),
                                            t("receive_step4")
                                        ].map((step, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1DB954] text-black text-[10px] flex items-center justify-center font-black shadow-lg">
                                                    0{i + 1}
                                                </span>
                                                <p className="text-[10px] font-black text-[#A7A7A7] leading-relaxed uppercase tracking-wider mt-1.5">{step}</p>
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
