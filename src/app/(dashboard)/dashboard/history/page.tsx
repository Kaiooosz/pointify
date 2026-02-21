"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowLeftRight,
    Calendar,
    X,
    ChevronDown,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentTransactions } from "@/actions/user-actions";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [showDateFilters, setShowDateFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            const res = await getRecentTransactions();
            if (res.success) {
                setTransactions(res.transactions || []);
            }
            setIsLoading(false);
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
        // Search Filter
        const matchesSearch = !searchQuery ||
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.id?.toLowerCase().includes(searchQuery.toLowerCase());

        // Type Filter
        let matchesType = true;
        if (filterType === "entry") {
            matchesType = tx.type.includes("DEPOSIT") || tx.type.includes("CASHBACK") || tx.type.includes("TRANSFER_IN") || tx.type.includes("KYC_BONUS");
        } else if (filterType === "exit") {
            matchesType = tx.type.includes("WITHDRAW") || tx.type.includes("PURCHASE") || tx.type.includes("TRANSFER_OUT") || tx.type.includes("FEE");
        } else if (filterType === "swap") {
            matchesType = tx.type.includes("SWAP");
        }

        // Date Filter
        const txDate = new Date(tx.createdAt);
        const matchesFrom = !dateFrom || txDate >= new Date(dateFrom);
        const matchesTo = !dateTo || txDate <= new Date(dateTo + "T23:59:59");

        return matchesSearch && matchesType && matchesFrom && matchesTo;
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8 mt-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{t("full_statement")}</h2>
                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("monitor_desc")}</p>
                </div>
                <Button className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest bg-[#1DB954] text-black hover:bg-[#1ED760] border-none transition-all animate-fade-in shadow-[0_10px_30px_rgba(29,185,84,0.15)]">
                    <Download className="w-4 h-4 mr-2" />
                    {t("export_pdf")}
                </Button>
            </div>

            <Card className="border border-[#1DB954]/20 rounded-[2rem] bg-[#0A0A0A] overflow-hidden shadow-[0_0_50px_rgba(29,185,84,0.05)] mx-4 md:mx-8">
                <CardHeader className="p-8 pb-4 space-y-6">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder={t("search_tx")}
                                className="pl-12 h-12 rounded-full border-[#1DB954]/10 bg-[#080808] font-black text-xs uppercase tracking-widest focus-visible:ring-white/20 transition-all text-white placeholder:text-[#A7A7A7]/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex p-1 bg-[#080808] rounded-full border border-[#1DB954]/10">
                                {[
                                    { id: "all", label: t("all") },
                                    { id: "entry", label: t("entries") },
                                    { id: "exit", label: t("exits") },
                                    { id: "swap", label: "Swaps" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-6 h-10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterType === tab.id
                                            ? "bg-[#1DB954] text-black shadow-sm"
                                            : "text-[#A7A7A7] hover:text-white"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className={`h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest border-[#1DB954]/10 transition-all ${showDateFilters ? "bg-[#1DB954] text-black border-[#1DB954]" : "bg-[#080808] text-[#A7A7A7] hover:bg-[#282828]"}`}
                                onClick={() => setShowDateFilters(!showDateFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {t("filters")}
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showDateFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 rounded-2xl bg-[#080808] border border-[#1DB954]/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-[0_0_30px_rgba(29,185,84,0.05)]">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#A7A7A7] px-1">{t("date_from")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                            <Input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="pl-12 h-11 rounded-full border-[#1DB954]/10 bg-[#080808] font-black text-xs text-white uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#A7A7A7] px-1">{t("date_to")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                            <Input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="pl-12 h-11 rounded-full border-[#1DB954]/10 bg-[#080808] font-black text-xs text-white uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 h-11 rounded-full font-black text-[9px] uppercase tracking-widest bg-[#1DB954] text-black hover:bg-[#1ED760] border-none transition-all"
                                            onClick={() => setShowDateFilters(false)}
                                        >
                                            {t("apply_filters")}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-11 w-11 rounded-full text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all"
                                            onClick={() => {
                                                setDateFrom("");
                                                setDateTo("");
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#1DB954]/[0.02] border-y border-[#1DB954]/10">
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("transaction")}</th>
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("date")}</th>
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("status")}</th>
                                    <th className="text-right p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("value")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1DB954]/10">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Sincronizando Ledger...</p>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center text-[#A7A7A7]">
                                            <Search className="w-8 h-8 mx-auto mb-4 opacity-10" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma transação encontrada</p>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.map((tx) => {
                                    const isEntry = tx.type.includes("DEPOSIT") || tx.type.includes("CASHBACK") || tx.type.includes("TRANSFER_IN") || tx.type.includes("KYC_BONUS");
                                    const isExit = tx.type.includes("WITHDRAW") || tx.type.includes("PURCHASE") || tx.type.includes("TRANSFER_OUT") || tx.type.includes("FEE");
                                    const isSwap = tx.type.includes("SWAP");

                                    return (
                                        <tr key={tx.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all group-hover:bg-[#1DB954] group-hover:text-black ${isEntry ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20" : isSwap ? "bg-white/5 text-white border border-white/10" : "bg-[#181818] text-[#A7A7A7] border border-white/5"}`}>
                                                        {isEntry ? <ArrowDownLeft className="w-5 h-5" /> : isSwap ? <ArrowLeftRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-black text-white text-xs tracking-tight uppercase leading-none">{tx.description || t("transaction")}</p>
                                                        <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                                            {isEntry ? t("entry") : isExit ? t("exit") : "Swap"} • {tx.type}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-[#A7A7A7] font-black text-[10px] uppercase tracking-tight">{new Date(tx.createdAt).toLocaleString()}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="inline-flex items-center text-[8px] font-black uppercase tracking-widest">
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_currentColor] ${tx.status === "COMPLETED" ? "text-[#1DB954] bg-[#1DB954]" : tx.status === "PENDING" ? "text-[#A7A7A7] bg-[#A7A7A7]" : "text-white/20 bg-white/20"}`} />
                                                    <span className={tx.status === "COMPLETED" ? "text-[#1DB954]" : tx.status === "PENDING" ? "text-[#A7A7A7]" : "text-white/20"}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <p className={`text-sm font-black ${isEntry ? "text-[#1DB954]" : isSwap ? "text-white/60" : "text-white"}`}>
                                                    {isEntry ? "+" : isExit ? "-" : ""} {tx.amount.toLocaleString()} <span className="text-[8px] uppercase tracking-widest ml-1 opacity-40">pts</span>
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
