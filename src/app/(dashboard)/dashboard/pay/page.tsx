"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText,
    Upload,
    QrCode,
    CheckCircle2,
    Info,
    ArrowRight,
    Clock,
    FileUp,
    Hash,
    Loader2,
    Check
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PayBillsPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        billFile: null as File | null,
        txid: ""
    });

    const steps = [
        { id: 1, label: "Upload", icon: Upload },
        { id: 2, label: "Pagar", icon: QrCode },
        { id: 3, label: "TXID", icon: Hash }
    ];

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep(step + 1);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            {/* Header + Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Pagar Boletos</h2>
                    <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em]">Liquidação de Títulos via DePix</p>
                </div>

                {/* Spotify-style Progress Bar */}
                <div className="flex items-center gap-4 bg-[#121212] p-2 rounded-full border border-white/5">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full transition-all ${step === s.id
                                ? "bg-[#1DB954] text-black shadow-[0_0_20px_rgba(29,185,84,0.3)]"
                                : step > s.id
                                    ? "text-[#1DB954]"
                                    : "text-[#A7A7A7]"
                                }`}>
                                <s.icon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{s.label}</span>
                                {step > s.id && <Check className="w-3.5 h-3.5" />}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-8 h-[2px] bg-white/5 mx-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Action Area */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                                    <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5">
                                        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7] flex items-center gap-3">
                                            <FileUp className="w-5 h-5 text-[#1DB954]" />
                                            Upload do Boleto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-10">
                                        {/* Dropzone Area */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#1DB954]/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                            <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-white/5 hover:border-[#1DB954]/40 rounded-[2.5rem] bg-[#181818] cursor-pointer transition-all">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="w-20 h-20 bg-[#1DB954]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                                        <FileText className="w-8 h-8 text-[#1DB954]" />
                                                    </div>
                                                    <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Clique para carregar</p>
                                                    <p className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-widest">Imagem ou PDF do boleto</p>
                                                </div>
                                                <input type="file" className="hidden" />
                                            </label>
                                        </div>

                                        {/* Amount Input */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Valor do Boleto</label>
                                            <div className="relative group">
                                                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-[#1DB954]">R$</div>
                                                <Input
                                                    type="text"
                                                    placeholder="0,00"
                                                    className="h-24 pl-20 pr-10 rounded-full bg-[#181818] border-white/5 text-5xl font-black text-white tracking-tighter transition-all focus-visible:ring-[#1DB954]/20"
                                                    value={formData.amount}
                                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 pt-0">
                                        <Button
                                            className="w-full h-16 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_15px_40px_rgba(29,185,84,0.2)] transition-all border-none group"
                                            onClick={handleNext}
                                            disabled={!formData.amount || isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                <>
                                                    Gerar QR Code de Pagamento
                                                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="pay"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden text-center">
                                    <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5">
                                        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">{t("confirm_send")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-12">
                                        <div className="flex flex-col items-center">
                                            <div className="relative p-6 bg-white rounded-[2.5rem] mb-10 shadow-2xl group transition-all duration-700">
                                                <div className="absolute -inset-4 bg-[#1DB954]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
                                                <QrCode className="w-56 h-56 text-black relative z-10" />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em]">Valor Total a Pagar</p>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <span className="text-5xl font-black text-[#1DB954] tracking-tighter">R$ {formData.amount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#181818] p-6 rounded-3xl border border-white/5">
                                                <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mb-1">Status do Pedido</p>
                                                <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest">Aguardando Pagamento</p>
                                            </div>
                                            <div className="bg-[#181818] p-6 rounded-3xl border border-white/5">
                                                <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mb-1">ID da Operação</p>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">#BILL-29384-KAI</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 pt-0 flex flex-col gap-6">
                                        <Button
                                            className="w-full h-16 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl border-none"
                                            onClick={handleNext}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Já paguei, enviar TXID"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-full"
                                            onClick={() => setStep(1)}
                                        >
                                            Voltar e Corrigir Boleto
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="txid"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                                    <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5 text-center">
                                        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#A7A7A7]">Confirmação de Transação</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-10">
                                        <div className="flex flex-col items-center text-center space-y-6 py-8">
                                            <div className="w-24 h-24 bg-[#1DB954]/10 rounded-full flex items-center justify-center">
                                                <Hash className="w-10 h-10 text-[#1DB954]" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Vincular Comprovante</h3>
                                                <p className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-widest max-w-xs mx-auto">
                                                    Cole a TXID (ID da Transação) do seu pagamento Pix para validarmos a operação.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">TXID do Pagamento</label>
                                            <Input
                                                placeholder="Ex: E1234567890..."
                                                className="h-16 px-8 rounded-full bg-[#181818] border-white/5 font-black text-xs text-white tracking-widest transition-all focus-visible:ring-[#1DB954]/20"
                                                value={formData.txid}
                                                onChange={(e) => setFormData({ ...formData, txid: e.target.value })}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 pt-0">
                                        <Button
                                            className="w-full h-16 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl border-none"
                                            onClick={() => setStep(4)}
                                            disabled={!formData.txid || isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Finalizar Solicitação"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <Card className="bg-[#121212] border-white/5 shadow-2xl py-20 rounded-[4rem] overflow-hidden relative">
                                    <div className="absolute top-0 inset-x-0 h-2 bg-[#1DB954] shadow-[0_0_20px_#1DB954]" />
                                    <CardContent className="space-y-12 p-10">
                                        <div className="relative mx-auto w-32 h-32">
                                            <div className="absolute inset-0 bg-[#1DB954]/20 rounded-full animate-ping" />
                                            <div className="relative w-32 h-32 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(29,185,84,0.4)]">
                                                <CheckCircle2 className="w-16 h-16 text-black" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Solicitada!</h3>
                                            <p className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                                                Sua liquidação de boleto no valor de <span className="text-white">R$ {formData.amount}</span> foi enviada para processamento.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 px-10">
                                            <Button variant="outline" className="h-14 px-10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border-white/10 text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all w-full sm:w-auto">Acompanhar Status</Button>
                                            <Link href="/dashboard" className="w-full sm:w-auto">
                                                <Button className="h-14 px-12 rounded-full font-black text-[10px] uppercase tracking-[0.2em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-xl w-full border-none">
                                                    Voltar ao Início
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-[#181818] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Info className="w-4 h-4 text-[#1DB954]" />
                                Como Funciona
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-10">
                            {[
                                { step: 1, title: "Envie o boleto", desc: "Faça upload da imagem ou PDF do documento." },
                                { step: 2, title: "Pague na sua wallet", desc: "Escaneie o QR ou copie o endereço gerado." },
                                { step: 3, title: "Envie a TXID", desc: "Cole a TXID da transação para confirmar." }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-5 group transition-all">
                                    <div className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center font-black text-[11px] flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                        0{item.step}
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[11px] font-black text-white uppercase tracking-widest">{item.title}</p>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest leading-relaxed opacity-70">{item.desc}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-white/5">
                                <div className="bg-[#1DB954]/5 p-6 rounded-[2rem] border border-[#1DB954]/10 flex gap-4">
                                    <Clock className="w-5 h-5 text-[#1DB954] flex-shrink-0" />
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest">Tempo de Processamento</p>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest leading-loose opacity-60">
                                            Em média, até <span className="text-white">2 horas</span> em horário comercial (8h-20h).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[#1DB954]/10 to-transparent border border-[#1DB954]/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <CheckCircle2 className="w-7 h-7 text-[#1DB954]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-white uppercase tracking-wider">Garantia DePix</p>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest opacity-60">Liquidação 100% Protegida</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
