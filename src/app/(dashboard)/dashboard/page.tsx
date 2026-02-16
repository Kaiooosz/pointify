"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    CreditCard,
    History,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    FileText as FileIcon,
    Key,
    Users,
    Settings,
    Eye,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect, useState } from "react";
import { getUserBalance, getRecentTransactions } from "@/actions/user-actions";
import CountUp from "@/components/ui/react-bits/CountUp";
import ShinyText from "@/components/ui/react-bits/ShinyText";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";

export default function DashboardPage() {
    const { t } = useLanguage();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const balanceRes = await getUserBalance();
            const txRes = await getRecentTransactions();

            if (balanceRes.success) setBalance(balanceRes.balance ?? 0);
            if (txRes.success) setTransactions(txRes.transactions ?? []);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const quickActions = [
        { icon: ArrowDownCircle, label: "Depositar", sub: "Receba via PIX", link: "/dashboard/deposit", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { icon: ArrowUpCircle, label: t("send"), sub: "Envie para PIX", link: "/dashboard/send", color: "text-rose-500", bg: "bg-rose-500/10" },
        { icon: FileIcon, label: t("bills"), sub: t("pay_titles"), link: "/dashboard/pay", color: "text-[#1DB954]", bg: "bg-[#1DB954]/10" },
        { icon: History, label: t("history"), sub: "Histórico completo", link: "/dashboard/history", color: "text-sky-500", bg: "bg-sky-500/10" },
        { icon: Key, label: "Chave Fixa", sub: "Copiar link", link: "/dashboard/receive", color: "text-amber-500", bg: "bg-amber-500/10" },
        { icon: Users, label: "Subcontas", sub: "Gerenciar equipe", link: "/dashboard/partners", color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-32 px-4 md:px-8">
            {/* Header / Profile Section */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-[#181818] flex items-center justify-center text-[#1DB954] text-xl font-black shadow-2xl border border-white/5 uppercase">
                        KS
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">
                            Olá, Kaio
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-[#1DB954] shadow-[0_0_10px_#1DB954]" />
                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">
                                Infraestrutura Ativa
                            </p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-white/10 bg-[#121212] hover:bg-[#181818] text-[#A7A7A7] transition-all">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>

            {/* Main Balance Card (Spotify Clean Style) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-[#121212] border border-white/5 shadow-2xl overflow-hidden relative min-h-[300px] rounded-[2.5rem] flex flex-col justify-between p-10 group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1DB954]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[#1DB954]/10 rounded-xl border border-[#1DB954]/20">
                                    <Wallet className="w-5 h-5 text-[#1DB954]" />
                                </div>
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#1DB954] uppercase">Capital Disponível</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowBalance(!showBalance)}
                                className="text-[#A7A7A7] hover:text-white rounded-full w-10 h-10"
                            >
                                <Eye className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-3xl font-black text-[#1DB954]/30 tracking-tighter uppercase">BRL</span>
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                                {isLoading ? "..." : (
                                    <AnimatePresence mode="wait">
                                        {showBalance ? (
                                            <CountUp
                                                key="visible"
                                                to={balance || 0}
                                                decimals={2}
                                                decimal=","
                                                separator="."
                                            />
                                        ) : (
                                            <span key="hidden">••••••</span>
                                        )}
                                    </AnimatePresence>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-6 mt-6">
                        <div className="flex-1 p-6 rounded-2xl bg-[#181818] border border-white/5">
                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ArrowDownLeft className="w-3 h-3 text-[#1DB954]" /> Entradas
                            </p>
                            <p className="text-xl font-black text-white">
                                R$ <CountUp to={balance ? balance * 1.2 : 0} decimals={2} />
                            </p>
                        </div>
                        <div className="flex-1 p-6 rounded-2xl bg-[#181818] border border-white/5">
                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ArrowUpRight className="w-3 h-3 text-[#1DB954]" /> Saídas
                            </p>
                            <p className="text-xl font-black text-white">
                                R$ <CountUp to={balance ? balance * 0.4 : 0} decimals={2} />
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Actions Grid (More Compact) */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                {quickActions.map((action, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 + 0.2 }}
                    >
                        <Link href={action.link} className="contents">
                            <SpotlightCard className="h-full bg-[#121212] border border-white/5 rounded-3xl p-6 group cursor-pointer transition-all hover:bg-[#181818]">
                                <CardContent className="p-0 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/5 flex items-center justify-center text-[#1DB954] mb-4 group-hover:bg-[#1DB954] group-hover:text-black transition-all border border-[#1DB954]/10">
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-black text-white text-[10px] uppercase tracking-widest leading-tight">{action.label}</h4>
                                </CardContent>
                            </SpotlightCard>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black text-[#A7A7A7] uppercase tracking-[0.2em]">Fluxo de Atividade</h3>
                        <Link href="/dashboard/history">
                            <Button variant="ghost" className="text-[#1DB954] text-[9px] font-black uppercase tracking-widest hover:bg-[#1DB954]/10 rounded-full h-8 px-4">Ver Ledger</Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {transactions.slice(0, 4).length > 0 ? transactions.slice(0, 4).map((tx, i) => (
                            <div key={i} className="bg-[#121212] border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-[#181818] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#1DB954]/5 flex items-center justify-center text-[#1DB954] border border-[#1DB954]/10">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-xs tracking-tight uppercase">{tx.description || "Transação"}</p>
                                        <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">ID {tx.id?.slice(-8).toUpperCase()} • Ativo</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-black ${tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') || tx.type.includes('DEPOSIT') ? 'text-[#1DB954]' : 'text-white'}`}>
                                    {tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') || tx.type.includes('DEPOSIT') ? '+' : '-'} R$ {tx.amount.toLocaleString()}
                                </p>
                            </div>
                        )) : (
                            <div className="bg-[#121212] border border-white/5 p-10 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Nenhuma atividade recente.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <Card className="h-full bg-gradient-to-br from-[#1DB954] to-[#121212] border-none rounded-[2rem] p-8 text-black overflow-hidden relative group cursor-pointer">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-black/10">
                                    <TrendingUp className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter leading-tight uppercase">Cashback <br />Verificado</h3>
                                    <p className="text-black/60 font-black mt-2 uppercase tracking-widest text-[9px]">Rendimento diário ativo.</p>
                                </div>
                            </div>
                            <Button className="bg-black text-[#1DB954] hover:bg-black/90 w-full h-12 rounded-full font-black uppercase text-[9px] tracking-[0.2em] transition-all border-none mt-8">
                                Configurar
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}






