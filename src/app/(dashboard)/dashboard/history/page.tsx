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
    Calendar,
    X,
    ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";

const mockTransactions = [
    { id: "1", name: "Supermercado Silva", type: "exit", amount: "-450", date: "2026-02-02 14:20", status: "Completed" },
    { id: "2", name: "Recebido de Maria", type: "entry", amount: "+1.200", date: "2026-02-01 18:30", status: "Completed" },
    { id: "3", name: "Café Star", type: "exit", amount: "-22", date: "2026-02-01 09:15", status: "Completed" },
    { id: "4", name: "Recarga de Pontos", type: "entry", amount: "+5.000", date: "2026-01-30 11:00", status: "Completed" },
    { id: "5", name: "Estorno de Compra", type: "entry", amount: "+120", date: "2026-01-28 15:45", status: "Pending" },
    { id: "6", name: "Loja de Conveniência", type: "exit", amount: "-85", date: "2026-01-28 10:20", status: "Failed" },
    { id: "7", name: "Pagamento de Aluguel", type: "exit", amount: "-2.500", date: "2026-01-25 08:00", status: "Completed" },
];

export default function HistoryPage() {
    const { t } = useLanguage();
    const [filterType, setFilterType] = useState("all");
    const [showDateFilters, setShowDateFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8 mt-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{t("full_statement")}</h2>
                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("monitor_desc")}</p>
                </div>
                <Button className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest bg-[#1DB954] hover:bg-[#1ED760] text-black border-none shadow-[0_10px_30px_rgba(29,185,84,0.2)] transition-all animate-fade-in">
                    <Download className="w-4 h-4 mr-2" />
                    {t("export_pdf")}
                </Button>
            </div>

            <Card className="border border-white/5 rounded-[2rem] bg-[#121212] overflow-hidden shadow-2xl mx-4 md:mx-8">
                <CardHeader className="p-8 pb-4 space-y-6">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] group-focus-within:text-[#1DB954] transition-colors" />
                            <Input
                                placeholder={t("search_tx")}
                                className="pl-12 h-12 rounded-full border-white/5 bg-[#181818] font-black text-xs uppercase tracking-widest focus-visible:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/40"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex p-1 bg-[#181818] rounded-full border border-white/5">
                                {[
                                    { id: "all", label: t("all") },
                                    { id: "entry", label: t("entries") },
                                    { id: "exit", label: t("exits") }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-6 h-10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterType === tab.id
                                            ? "bg-[#282828] text-[#1DB954] shadow-sm"
                                            : "text-[#A7A7A7] hover:text-white"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className={`h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest border-white/5 transition-all ${showDateFilters ? "bg-[#1DB954] text-black border-[#1DB954]" : "bg-[#181818] text-[#A7A7A7] hover:bg-[#282828]"}`}
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
                                <div className="p-6 rounded-2xl bg-[#181818] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#A7A7A7] px-1">{t("date_from")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1DB954]" />
                                            <Input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="pl-12 h-11 rounded-full border-white/5 bg-[#121212] font-black text-xs text-white uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#A7A7A7] px-1">{t("date_to")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1DB954]" />
                                            <Input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="pl-12 h-11 rounded-full border-white/5 bg-[#121212] font-black text-xs text-white uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 h-11 rounded-full font-black text-[9px] uppercase tracking-widest bg-[#1DB954] hover:bg-[#1ED760] text-black border-none transition-all">
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
                                <tr className="bg-[#181818]/50 border-y border-white/5">
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("transaction")}</th>
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("date")}</th>
                                    <th className="text-left p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("status")}</th>
                                    <th className="text-right p-6 font-black text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7]">{t("value")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mockTransactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all group-hover:bg-[#1DB954] group-hover:text-black ${tx.type === "entry" ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20" : "bg-[#181818] text-[#A7A7A7] border border-white/5"}`}>
                                                    {tx.type === "entry" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-white text-xs tracking-tight uppercase leading-none">{tx.name}</p>
                                                    <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">{tx.type === "entry" ? t("entry") : t("exit")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[#A7A7A7] font-black text-[10px] uppercase tracking-tight">{tx.date}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className="inline-flex items-center text-[8px] font-black uppercase tracking-widest">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_currentColor] ${tx.status === "Completed" ? "text-[#1DB954] bg-[#1DB954]" : tx.status === "Pending" ? "text-amber-500 bg-amber-500" : "text-rose-500 bg-rose-500"}`} />
                                                <span className={tx.status === "Completed" ? "text-[#1DB954]" : tx.status === "Pending" ? "text-amber-500" : "text-rose-500"}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <p className={`text-sm font-black ${tx.type === "entry" ? "text-[#1DB954]" : "text-white"}`}>
                                                {tx.amount} <span className="text-[8px] uppercase tracking-widest ml-1 opacity-40">pts</span>
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
