"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Key,
    Plus,
    Link as LinkIcon,
    ArrowUpCircle,
    Info,
    ShieldCheck,
    Trash2,
    Copy,
    CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function PixKeysPage() {
    const { t } = useLanguage();
    const [receivingKeys, setReceivingKeys] = useState<any[]>([]);
    const [withdrawalKeys, setWithdrawalKeys] = useState<any[]>([]);

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col gap-1 mt-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 shadow-xl">
                        <Key className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Minhas Chaves PIX</h2>
                </div>
                <p className="text-[10px] font-black text-[#A767A7] dark:text-[#A7A7A7] uppercase tracking-[0.3em] ml-16">Gerencie suas chaves para receber e enviar</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* Receiving Keys Section */}
                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-[#A7A7A7]" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Chaves PIX Recebimento</CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{receivingKeys.length}/5 criadas — Links fixos para receber</p>
                            </div>
                        </div>
                        <Button className="h-10 px-8 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[10px] tracking-widest transition-all border-none">
                            <Plus className="w-4 h-4 mr-2" /> Criar nova
                        </Button>
                    </CardHeader>
                    <CardContent className="p-20 flex flex-col items-center justify-center text-center space-y-8">
                        {receivingKeys.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto border border-dashed border-white/10 group hover:border-[#1DB954]/40 transition-all duration-500">
                                    <LinkIcon className="w-10 h-10 text-white/10 group-hover:text-[#1DB954]/40 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Nenhuma chave PIX fixa cadastrada</p>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Crie uma para facilitar o recebimento de pagamentos recurrentes</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full space-y-4">
                                {/* List items would go here */}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Withdrawal Keys Section */}
                <Card className="bg-[#121212] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <ArrowUpCircle className="w-5 h-5 text-[#A7A7A7]" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Chaves PIX para Saque</CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{withdrawalKeys.length}/5 cadastradas — Use nos seus saques</p>
                            </div>
                        </div>
                        <Button className="h-10 px-8 rounded-full bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] tracking-widest transition-all border-none">
                            <Plus className="w-4 h-4 mr-2" /> Adicionar
                        </Button>
                    </CardHeader>
                    <CardContent className="p-20 flex flex-col items-center justify-center text-center space-y-8">
                        {withdrawalKeys.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto border border-dashed border-white/10 group hover:border-white/40 transition-all duration-500">
                                    <Key className="w-10 h-10 text-white/10 group-hover:text-white/40 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Nenhuma chave de saque cadastrada</p>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Adicione suas chaves externas Bancárias para realizar saques</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full space-y-4">
                                {/* List items would go here */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Footer Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="bg-[#1DB954]/5 p-8 rounded-[2.5rem] border border-[#1DB954]/10 flex gap-6 group hover:bg-[#1DB954]/10 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-[#1DB954] text-black flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Segurança de Dados</p>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] leading-relaxed">
                            Suas chaves são criptografadas e utilizadas apenas para roteamento de pagamentos dentro da rede Pointify.
                        </p>
                    </div>
                </div>

                <div className="bg-[#181818] p-8 rounded-[2.5rem] border border-white/5 flex gap-6 group hover:border-white/10 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 text-[#1DB954] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Info className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Limites Operacionais</p>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] leading-relaxed">
                            O limite de chaves é baseado no seu nível de KYC. Usuários Elite podem gerenciar até 15 chaves simultâneas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
