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
        <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t("full_statement")}</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-bold tracking-tight">{t("monitor_desc")}</p>
                </div>
                <Button className="h-14 px-8 rounded-2xl font-black bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 border-none">
                    <Download className="w-5 h-5 mr-3" />
                    {t("export_pdf")}
                </Button>
            </div>

            <Card className="border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="p-10 pb-6 space-y-8">
                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                placeholder={t("search_tx")}
                                className="pl-14 h-16 rounded-[1.25rem] border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 font-bold text-base focus-visible:ring-emerald-500/20"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-[1.25rem] border border-slate-100 dark:border-white/5">
                                {[
                                    { id: "all", label: t("all") },
                                    { id: "entry", label: t("entries") },
                                    { id: "exit", label: t("exits") }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-8 h-12 rounded-xl text-sm font-black transition-all ${filterType === tab.id
                                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className={`h-[calc(4rem-0.375rem)] px-8 rounded-[1.25rem] font-black border-slate-100 dark:border-white/5 transition-all ${showDateFilters ? "bg-emerald-500 text-white border-emerald-500" : "hover:bg-slate-50"}`}
                                onClick={() => setShowDateFilters(!showDateFilters)}
                            >
                                <Filter className="w-5 h-5 mr-3" />
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
                                <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-emerald-600 px-1">{t("date_from")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                                            <Input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="pl-12 h-14 rounded-2xl border-emerald-500/20 bg-white dark:bg-slate-900 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-emerald-600 px-1">{t("date_to")}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                                            <Input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="pl-12 h-14 rounded-2xl border-emerald-500/20 bg-white dark:bg-slate-900 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button className="flex-1 h-14 rounded-2xl font-black bg-emerald-500 hover:bg-emerald-600 border-none">
                                            {t("apply_filters")}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-14 w-14 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => {
                                                setDateFrom("");
                                                setDateTo("");
                                            }}
                                        >
                                            <X className="w-5 h-5" />
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
                                <tr className="bg-slate-50 dark:bg-white/5 border-y border-slate-100 dark:border-white/5">
                                    <th className="text-left p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t("transaction")}</th>
                                    <th className="text-left p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t("date")}</th>
                                    <th className="text-left p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t("status")}</th>
                                    <th className="text-right p-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t("value")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {mockTransactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="p-6">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === "entry" ? "bg-emerald-500/10 text-emerald-500 shadow-sm shadow-emerald-500/10" : "bg-red-500/10 text-red-500 shadow-sm shadow-red-500/10"}`}>
                                                    {tx.type === "entry" ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{tx.name}</p>
                                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tx.type === "entry" ? t("entry") : t("exit")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-slate-500 dark:text-slate-400 font-bold tracking-tight">{tx.date}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${tx.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" :
                                                tx.status === "Pending" ? "bg-amber-500/10 text-amber-600" :
                                                    "bg-red-500/10 text-red-600"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${tx.status === "Completed" ? "bg-emerald-600" : tx.status === "Pending" ? "bg-amber-600" : "bg-red-600"}`} />
                                                {tx.status}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <p className={`text-2xl font-black ${tx.type === "entry" ? "text-emerald-500" : "text-slate-900 dark:text-white"}`}>
                                                {tx.amount} <span className="text-xs uppercase tracking-widest ml-1 opacity-50">pts</span>
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
