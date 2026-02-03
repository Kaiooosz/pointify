"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    CreditCard,
    History
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect, useState } from "react";
import { getUserBalance, getRecentTransactions } from "@/actions/user-actions";

export default function DashboardPage() {
    const { t } = useLanguage();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Top Section / Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white border-none shadow-2xl shadow-emerald-500/10 overflow-hidden relative min-h-[260px] flex flex-col justify-center rounded-[2.5rem]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

                        <CardHeader className="pb-2 relative z-10 px-10">
                            <p className="text-emerald-50/80 text-sm font-black tracking-widest uppercase mb-1">{t("available_balance")}</p>
                            <CardTitle className="text-5xl md:text-7xl font-black flex items-baseline gap-3">
                                {isLoading ? "..." : balance?.toLocaleString() ?? "0"} <span className="text-2xl font-medium text-emerald-100">pts</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 px-10">
                            <div className="flex flex-wrap gap-4 mt-10">
                                <Link href="/dashboard/send">
                                    <Button className="bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-xl shadow-black/10 px-8 py-7 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95">
                                        <ArrowUpRight className="w-5 h-5 mr-2" />
                                        {t("send_points")}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/receive">
                                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-7 rounded-2xl font-black text-base backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                                        <ArrowDownLeft className="w-5 h-5 mr-2" />
                                        {t("receive")}
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="text-white hover:bg-white/10 px-6 py-7 rounded-2xl font-black text-base transition-all hover:scale-105 active:scale-95">
                                    <Plus className="w-5 h-5 mr-2" />
                                    {t("buy")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="h-full border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 flex flex-col justify-center p-8 rounded-[2.5rem]">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">{t("reserved_balance")}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-5xl font-black text-slate-900 dark:text-white mb-6">
                                0 <span className="text-xl font-medium text-slate-400">pts</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                <TrendingUp className="w-3.5 h-3.5" />
                                +0 PTS ESTE MÊS
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t("recent_transactions")}</h3>
                        <Link href="/dashboard/history">
                            <Button variant="link" className="text-emerald-600 font-black p-0 h-auto text-sm uppercase tracking-wider">{t("view_all")}</Button>
                        </Link>
                    </div>
                    <Card className="border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem]">
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">{t("loading")}</div>
                            ) : transactions.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">{t("no_transactions")}</div>
                            ) : (
                                transactions.map((tx, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}>
                                                {tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') ? (
                                                    <ArrowDownLeft className="w-7 h-7 text-emerald-500" />
                                                ) : (
                                                    <CreditCard className="w-7 h-7 text-rose-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-base">{tx.description || tx.type}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-lg ${tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') ? 'text-emerald-500' : 'text-rose-500'} tracking-tight`}>
                                                {tx.type.includes('PURCHASE') || tx.type.includes('CASHBACK') ? '+' : '-'}{tx.amount.toLocaleString()} pts
                                            </p>
                                            <p className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mt-1">{tx.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight px-2">{t("quick_actions")}</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <Card className="group cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 transition-all border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 min-h-[180px] flex items-center justify-center rounded-[2.5rem]">
                            <CardContent className="p-0 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform shadow-sm">
                                    <ArrowUpRight className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wide">{t("send_pix")}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">{t("points_to_cash")}</p>
                            </CardContent>
                        </Card>
                        <Card className="group cursor-pointer hover:shadow-2xl hover:shadow-sky-500/10 transition-all border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 min-h-[180px] flex items-center justify-center rounded-[2.5rem]">
                            <CardContent className="p-0 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 mb-5 group-hover:scale-110 transition-transform shadow-sm">
                                    <History className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wide">{t("schedule")}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">{t("future_payments")}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-slate-900 border border-white/5 overflow-hidden relative group cursor-pointer rounded-[2.5rem] shadow-2xl shadow-black/20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-500" />
                        <CardContent className="p-10 flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex flex-shrink-0 items-center justify-center text-white shadow-xl shadow-emerald-500/40 transition-transform group-hover:scale-110 duration-500">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-white text-xl tracking-tight mb-1">{t("cashback_program")}</h4>
                                <p className="text-sm text-slate-400 font-bold">{t("cashback_ready")}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-black uppercase text-xs tracking-widest">{t("view_details")}</Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
