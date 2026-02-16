"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Link as LinkIcon,
    Plus,
    Share2,
    Download,
    Info,
    BarChart3,
    Clock,
    Minus,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentLinksPage() {
    const { t } = useLanguage();
    const [amount, setAmount] = useState("20,00");
    const [quantity, setQuantity] = useState(1);

    const summaryItems = [
        { label: "Links criados", value: "0" },
        { label: "Links ativos", value: "0" },
        { label: "Pagamentos", value: "0" },
        { label: "Total recebido", value: "R$ 0,00", isPrice: true },
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 shadow-xl">
                            <LinkIcon className="w-6 h-6 text-[#1DB954]" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Links de Pagamento</h2>
                    </div>
                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] ml-16">Crie links e receba em DePix</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-full border-white/10 bg-[#121212] hover:bg-[#181818] text-[#A7A7A7] font-black uppercase text-[9px] tracking-widest px-6">
                        <Info className="w-3.5 h-3.5 mr-2" /> Ajuda
                    </Button>
                    <Button variant="outline" className="h-10 rounded-full border-white/10 bg-[#121212] hover:bg-[#181818] text-[#A7A7A7] font-black uppercase text-[9px] tracking-widest px-6">
                        Configurações
                    </Button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-4 py-6 border-y border-white/5">
                <Button className="h-12 px-10 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[10px] tracking-widest shadow-lg">
                    <Plus className="w-4 h-4 mr-2" /> Criar
                </Button>
                <Button variant="ghost" className="h-12 px-8 rounded-full text-[#A7A7A7] hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest">
                    <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                </Button>
                <Button variant="ghost" className="h-12 px-8 rounded-full text-[#A7A7A7] hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest">
                    <Download className="w-4 h-4 mr-2" /> Receber
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Create Link Card */}
                <div className="lg:col-span-7">
                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                                    <Plus className="w-5 h-5 text-[#1DB954]" />
                                    Criar Link
                                </CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Min: R$ 20,00 | Max: R$ 3.000,00</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                            {/* Value Input */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Valor do Pagamento</label>
                                <div className="relative group">
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-[#1DB954]">R$</div>
                                    <Input
                                        type="text"
                                        className="h-24 pl-20 pr-10 rounded-[2rem] bg-[#181818] border-white/5 text-5xl font-black text-white tracking-tighter transition-all focus-visible:ring-[#1DB954]/20"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-3 px-2">
                                    {["50", "100", "200", "500"].map((v) => (
                                        <Button
                                            key={v}
                                            variant="outline"
                                            className="h-10 px-6 rounded-full border-white/5 bg-[#181818] text-[#A7A7A7] hover:text-white hover:border-[#1DB954]/30 font-black text-[10px] transition-all"
                                            onClick={() => setAmount(v + ",00")}
                                        >
                                            R$ {v}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Counter */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Quantidade de Pagamentos</label>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-[#181818] p-2 rounded-full border border-white/5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-12 h-12 rounded-full text-[#A7A7A7] hover:text-white"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <Minus className="w-5 h-5" />
                                        </Button>
                                        <div className="w-16 text-center text-xl font-black text-white">{quantity}</div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-12 h-12 rounded-full text-[#A7A7A7] hover:text-white"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <p className="text-[9px] font-black text-[#A767A7] dark:text-[#A7A7A7] uppercase tracking-widest opacity-60">O link será fechado após esta quantidade</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-4">Descrição (Opcional)</label>
                                <Input
                                    placeholder="Ex: Pedido #123, Produto XYZ..."
                                    className="h-16 px-8 rounded-[1.5rem] bg-[#181818] border-white/5 font-black text-xs text-white uppercase tracking-widest placeholder:text-white/10"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 pt-0">
                            <Button className="w-full h-16 rounded-full bg-white text-black hover:bg-white/90 font-black uppercase text-[11px] tracking-[0.3em] shadow-xl border-none">
                                <LinkIcon className="w-4 h-4 mr-3" />
                                Criar Link de Pagamento
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Info & Summary Column */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Summary Card */}
                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4 border-b border-white/5 bg-white/[0.01]">
                            <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-[#1DB954]" />
                                Resumo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-2 gap-8">
                            {summaryItems.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{item.label}</p>
                                    <p className={`text-xl font-black ${item.isPrice ? 'text-[#1DB954]' : 'text-white'}`}>{item.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* How it works */}
                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Plus className="w-4 h-4 text-[#1DB954]" />
                                Como funciona
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="space-y-6">
                                {[
                                    { s: 1, t: "Crie o link", d: "Defina valor e quantidade de pagamentos" },
                                    { s: 2, t: "Compartilhe", d: "Envie o link para seus clientes" },
                                    { s: 3, t: "Receba em DePix", d: "Pagamentos creditados automaticamente" }
                                ].map((item) => (
                                    <div key={item.s} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">{item.s}</div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.t}</p>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest opacity-60">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <div className="flex gap-4">
                                    <Clock className="w-5 h-5 text-[#1DB954] flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest">Validade</p>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest leading-loose opacity-60">
                                            Links expiram em 12h. QR Codes são regenerados automaticamente se necessário.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section: My Links */}
                <div className="lg:col-span-12">
                    <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <LinkIcon className="w-5 h-5 text-[#A7A7A7]" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Meus Links</CardTitle>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">0 links criados</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="h-10 px-6 rounded-full text-[#A7A7A7] hover:text-[#1DB954] font-black uppercase text-[9px] tracking-widest">
                                <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-24 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center border border-dashed border-white/10">
                                <LinkIcon className="w-10 h-10 text-white/10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Nenhum link criado ainda</p>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Crie seu primeiro link de pagamento acima</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
