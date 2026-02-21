"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { getPixKeys, createPixKey, deletePixKey } from "@/actions/pix-actions";
import { Input } from "@/components/ui/input";
import { Loader2, X, Bitcoin, Coins, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PixKeysPage() {
    const { t } = useLanguage();
    const [receivingKeys, setReceivingKeys] = useState<any[]>([]);
    const [withdrawalKeys, setWithdrawalKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalCategory, setModalCategory] = useState<"RECEIVING" | "WITHDRAWAL">("RECEIVING");
    const [newKeyData, setNewKeyData] = useState({
        key: "",
        type: "EMAIL" as any,
        network: "",
        label: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setIsLoading(true);
        const [resRec, resWit] = await Promise.all([
            getPixKeys("RECEIVING"),
            getPixKeys("WITHDRAWAL")
        ]);

        if (resRec.success) setReceivingKeys(resRec.keys || []);
        if (resWit.success) setWithdrawalKeys(resWit.keys || []);
        setIsLoading(false);
    };

    const handleAddKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await createPixKey({
            ...newKeyData,
            category: modalCategory
        });

        if (res.success) {
            await fetchKeys();
            setShowAddModal(false);
            setNewKeyData({ key: "", type: "EMAIL", network: "", label: "" });
        } else {
            alert(res.error || "Erro ao criar chave");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta chave PIX?")) return;
        const res = await deletePixKey(id);
        if (res.success) {
            await fetchKeys();
        } else {
            alert(res.error || "Erro ao excluir chave");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 md:px-8">
            {/* Header */}
            {/* Header Spotify Style */}
            <div className="flex flex-col gap-1 px-4 mt-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                        <Key className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Chaves e Carteiras</h2>
                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.3em] mt-1">Gerencie chaves PIX e endereços de cripto</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* Receiving Keys Section */}
                <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_50px_rgba(29,185,84,0.05)] rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-[#1DB954]/10 bg-[#1DB954]/[0.01] flex flex-row items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-[#1DB954]" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black text-white uppercase tracking-widest leading-none">Chaves PIX Recebimento</CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{receivingKeys.length}/5 criadas — Links fixos para receber</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => { setModalCategory("RECEIVING"); setShowAddModal(true); }}
                            className="h-10 px-8 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[10px] tracking-widest transition-all border-none shadow-[0_10px_20px_rgba(29,185,84,0.1)]"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Criar nova
                        </Button>
                    </CardHeader>
                    <CardContent className="p-10">
                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
                            </div>
                        ) : receivingKeys.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-full bg-[#1DB954]/5 flex items-center justify-center mx-auto border border-dashed border-[#1DB954]/20 group hover:border-[#1DB954]/40 transition-all duration-500">
                                        <LinkIcon className="w-10 h-10 text-[#1DB954]/20 group-hover:text-[#1DB954]/40 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Nenhuma chave PIX fixa cadastrada</p>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Crie uma para facilitar o recebimento de pagamentos recurrentes</p>
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                {receivingKeys.map((key) => (
                                    <div key={key.id} className="flex items-center justify-between p-6 bg-[#080808] rounded-[2rem] border border-[#1DB954]/10 hover:border-[#1DB954]/30 hover:shadow-[0_0_20px_rgba(29,185,84,0.05)] transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] font-black text-[10px] uppercase">
                                                {key.type === "BTC" ? <Bitcoin className="w-5 h-5" /> : key.type === "USDT" ? <Coins className="w-5 h-5" /> : key.type}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-white tracking-widest uppercase truncate max-w-[200px] md:max-w-md">{key.key}</p>
                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1 leading-none">
                                                    {key.label || (key.type === "BTC" || key.type === "USDT" ? "Carteira Cripto" : "Chave de Recebimento")}
                                                    {key.network && <span className="text-[#1DB954] ml-2">({key.network})</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-[#A7A7A7] hover:text-[#1DB954] hover:bg-[#1DB954]/10" onClick={() => navigator.clipboard.writeText(key.key)}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-[#A7A7A7] hover:text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(key.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Withdrawal Keys Section */}
                <Card className="bg-[#0A0A0A] border-[#1DB954]/20 shadow-[0_0_50px_rgba(29,185,84,0.05)] rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-[#1DB954]/10 bg-[#1DB954]/[0.01] flex flex-row items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                                <ArrowUpCircle className="w-5 h-5 text-[#1DB954]" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black text-white uppercase tracking-widest leading-none">Chaves PIX para Saque</CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{withdrawalKeys.length}/5 cadastradas — Use nos seus saques</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => { setModalCategory("WITHDRAWAL"); setShowAddModal(true); }}
                            className="h-10 px-8 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[10px] tracking-widest transition-all border-none shadow-[0_10px_20px_rgba(29,185,84,0.1)]"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Adicionar
                        </Button>
                    </CardHeader>
                    <CardContent className="p-10">
                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
                            </div>
                        ) : withdrawalKeys.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-full bg-[#1DB954]/5 flex items-center justify-center mx-auto border border-dashed border-[#1DB954]/20 group hover:border-[#1DB954]/40 transition-all duration-500">
                                        <Key className="w-10 h-10 text-[#1DB954]/20 group-hover:text-[#1DB954]/40 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Nenhuma chave de saque cadastrada</p>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Adicione suas chaves externas Bancárias para realizar saques</p>
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">
                                {withdrawalKeys.map((key) => (
                                    <div key={key.id} className="flex items-center justify-between p-6 bg-[#080808] rounded-[2rem] border border-[#1DB954]/10 hover:border-[#1DB954]/30 hover:shadow-[0_0_20px_rgba(29,185,84,0.05)] transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] font-black text-[10px] uppercase">
                                                {key.type === "BTC" ? <Bitcoin className="w-5 h-5" /> : key.type === "USDT" ? <Coins className="w-5 h-5" /> : key.type}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black text-white tracking-widest uppercase truncate max-w-[200px] md:max-w-md">{key.key}</p>
                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1 leading-none">
                                                    {key.label || (key.type === "BTC" || key.type === "USDT" ? "Carteira Cripto" : "Chave de Saque")}
                                                    {key.network && <span className="text-[#1DB954]/60 ml-2">({key.network})</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-[#A7A7A7] hover:text-[#1DB954] hover:bg-[#1DB954]/10" onClick={() => navigator.clipboard.writeText(key.key)}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-[#A7A7A7] hover:text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(key.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Footer Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-[#1DB954]/10 flex gap-6 group hover:bg-[#1DB954]/5 transition-all duration-500 shadow-[0_0_30px_rgba(29,185,84,0.02)]">
                    <div className="w-14 h-14 rounded-2xl bg-[#1DB954] text-black flex items-center justify-center shadow-[0_10px_20px_rgba(29,185,84,0.2)] transform group-hover:rotate-12 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Segurança de Dados</p>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] leading-relaxed">
                            Suas chaves são criptografadas e utilizadas apenas para roteamento de pagamentos dentro da rede Pointify.
                        </p>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-[#1DB954]/10 flex gap-6 group hover:bg-[#1DB954]/5 transition-all duration-500 shadow-[0_0_30px_rgba(29,185,84,0.02)]">
                    <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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

            {/* Add Key Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] px-4"
                        >
                            <Card className="bg-[#0A0A0A] border border-[#1DB954]/20 shadow-[0_0_80px_rgba(29,185,84,0.15)] rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10 pb-6 border-b border-[#1DB954]/10 bg-[#1DB954]/[0.01] flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-black text-white uppercase tracking-widest leading-none">
                                            {modalCategory === "RECEIVING" ? "Criar Chave Recebimento" : "Adicionar Chave Saque"}
                                        </CardTitle>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-3 opacity-60 leading-none">Complete os dados da chave abaixo</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 text-[#A7A7A7] hover:text-white" onClick={() => setShowAddModal(false)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="space-y-5">
                                        <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">Tipo de Chave / Moeda</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {["EMAIL", "CPF", "PHONE", "RANDOM", "CNPJ", "BTC", "USDT"].map((type) => (
                                                <Button
                                                    key={type}
                                                    variant="outline"
                                                    className={cn(
                                                        "h-12 rounded-2xl border-[#1DB954]/10 bg-[#080808] text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white hover:border-[#1DB954]/40 transition-all",
                                                        newKeyData.type === type && "border-[#1DB954]/60 text-white bg-[#1DB954]/5 shadow-[0_0_15px_rgba(29,185,84,0.1)]"
                                                    )}
                                                    onClick={() => setNewKeyData({ ...newKeyData, type: type as any, network: type === "USDT" ? "TRC20" : type === "BTC" ? "BITCOIN" : "" })}
                                                >
                                                    {type === "BTC" ? <span className="flex items-center gap-2"><Bitcoin className="w-3.5 h-3.5 text-[#1DB954]" /> BTC</span> :
                                                        type === "USDT" ? <span className="flex items-center gap-2"><Coins className="w-3.5 h-3.5 text-[#1DB954]" /> USDT</span> :
                                                            type}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {(newKeyData.type === "BTC" || newKeyData.type === "USDT") && (
                                        <div className="space-y-5">
                                            <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">Rede Disponível</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(newKeyData.type === "USDT"
                                                    ? ["TRC20", "ERC20", "BEP20", "POLYGON"]
                                                    : ["BITCOIN", "BEP20", "SOLANA", "POLYGON", "ERC20", "TRC20"]
                                                ).map((net) => (
                                                    <Button
                                                        key={net}
                                                        variant="outline"
                                                        className={cn(
                                                            "h-12 rounded-2xl border-[#1DB954]/10 bg-[#080808] text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white hover:border-[#1DB954]/40 transition-all",
                                                            newKeyData.network === net && "border-[#1DB954]/60 text-white bg-[#1DB954]/5 shadow-[0_0_15px_rgba(29,185,84,0.1)]"
                                                        )}
                                                        onClick={() => setNewKeyData({ ...newKeyData, network: net })}
                                                    >
                                                        {net}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-5">
                                        <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">
                                            {newKeyData.type === "BTC" || newKeyData.type === "USDT" ? "Endereço da Carteira" : "Identificador da Chave"}
                                        </label>
                                        <Input
                                            placeholder={newKeyData.type === "BTC" || newKeyData.type === "USDT" ? "Cole o endereço aqui" : "Ex: seu@email.com ou 000.000.000-00"}
                                            className="h-16 px-8 rounded-full bg-[#080808] border-[#1DB954]/10 font-black text-xs text-white uppercase tracking-widest focus-visible:ring-[#1DB954]/40 focus-visible:border-[#1DB954]/40 transition-all"
                                            value={newKeyData.key}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, key: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-2">Identificador (Opcional)</label>
                                        <Input
                                            placeholder="Ex: Minha conta principal"
                                            className="h-16 px-8 rounded-full bg-[#080808] border-[#1DB954]/10 font-black text-xs text-white uppercase tracking-widest focus-visible:ring-[#1DB954]/40 focus-visible:border-[#1DB954]/40 transition-all"
                                            value={newKeyData.label}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, label: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="p-10 pt-0">
                                    <Button
                                        onClick={handleAddKey}
                                        disabled={!newKeyData.key || isSubmitting}
                                        className="w-full h-16 rounded-full bg-[#1DB954] text-black hover:bg-[#1ED760] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_20px_40px_rgba(29,185,84,0.3)] border-none"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar e Salvar"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

