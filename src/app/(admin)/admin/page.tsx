"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Activity,
    ShieldCheck,
    Search,
    TrendingUp,
    Download,
    Settings,
    AlertTriangle,
    UserMinus,
    DollarSign,
    Lock,
    ChevronRight,
    RefreshCw,
    Instagram,
    FileText,
    History,
    Zap,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    getAdminStats,
    getAdminUsers,
    getGlobalActivity,
    getAdminLogs,
    updateUserStatus,
    approveUserKyc
} from "@/actions/admin-actions";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/components/ui/react-bits/CountUp";
import { useLanguage } from "@/components/providers/language-provider";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<"overview" | "users" | "financial" | "logs">("overview");

    // Filters
    const [filterMethod, setFilterMethod] = useState<string>("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const refreshData = async () => {
        setIsLoading(true);
        const [statsRes, usersRes, activityRes, logsRes] = await Promise.all([
            getAdminStats(),
            getAdminUsers(),
            getGlobalActivity(),
            getAdminLogs()
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (usersRes.success && usersRes.users) setUsers(usersRes.users);
        if (activityRes.success && activityRes.transactions) setActivity(activityRes.transactions);
        if (logsRes.success && logsRes.logs) setLogs(logsRes.logs);
        setIsLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filteredTransactions = activity.filter(tx => {
        if (filterMethod !== "ALL" && tx.method !== filterMethod) return false;
        if (filterStatus !== "ALL" && tx.status !== filterStatus) return false;
        if (searchQuery && !tx.user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-12 max-w-[1700px] mx-auto pb-32 px-4 md:px-8 bg-[#0B0B0B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-12">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">{t("command_center")}</h2>
                    <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.5em] mt-3 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Core Infrastructure: Active & Shielded
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-full border border-white/5 shadow-2xl">
                    {[
                        { id: "overview", label: t("overview"), icon: Activity },
                        { id: "users", label: t("members"), icon: Users },
                        { id: "financial", label: t("financial_ledger"), icon: DollarSign },
                        { id: "logs", label: t("auditing"), icon: History },
                    ].map((tItem) => (
                        <button
                            key={tItem.id}
                            onClick={() => setTab(tItem.id as any)}
                            className={`h-12 px-8 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 ${tab === tItem.id ? "bg-[#1DB954] text-black shadow-[0_0_20px_rgba(29,185,84,0.3)]" : "text-[#A7A7A7] hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tItem.icon className="w-4 h-4" />
                            {tItem.label}
                        </button>
                    ))}
                    <Button variant="ghost" className="w-12 h-12 rounded-full p-0 text-[#A7A7A7] hover:text-white" onClick={refreshData}>
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {tab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                        {/* Macro Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: t("gross_volume"), value: stats?.totalVolume || 0, sub: t("processado_total"), icon: Activity, trend: "up" },
                                { label: t("revenue_spread"), value: stats?.netRevenue || 0, sub: t("captura_pointify"), icon: DollarSign, trend: "up" },
                                { label: t("avg_ticket"), value: stats?.ticketMedio || 0, sub: t("valor_por_ordem"), icon: TrendingUp, trend: "neutral" },
                                { label: t("daily_flow"), value: stats?.volToday || 0, sub: t("fluxo_diario"), icon: Zap, trend: "up" },
                            ].map((s, i) => (
                                <Card key={i} className="bg-[#121212] border-white/5 rounded-[2.5rem] p-10 hover:border-[#1DB954]/20 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1DB954]/[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#A7A7A7] group-hover:text-[#1DB954] transition-colors border border-white/5">
                                            <s.icon className="w-6 h-6" />
                                        </div>
                                        {s.trend === "up" && <ArrowUpRight className="w-5 h-5 text-[#1DB954]" />}
                                    </div>
                                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-3">{s.label}</p>
                                    <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">
                                        R$ <CountUp to={s.value} decimals={2} />
                                    </h3>
                                    <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest mt-6 opacity-60">{s.sub}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Visual Sales Dashboard */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            <Card className="xl:col-span-8 bg-[#121212] border-white/5 rounded-[3rem] p-12 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.05),transparent_50%)]" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-12">
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{t("sales_performance")}</h3>
                                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{t("sales_desc")}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" className="h-10 px-6 rounded-full text-[9px] font-black text-white uppercase bg-white/5 border border-white/10">7 Dias</Button>
                                            <Button variant="ghost" className="h-10 px-6 rounded-full text-[9px] font-black text-[#A7A7A7] uppercase hover:text-white">30 Dias</Button>
                                        </div>
                                    </div>

                                    {/* Mock Graph visualization using simple bars for high visual impact */}
                                    <div className="flex items-end justify-between h-64 gap-3 mt-10">
                                        {[60, 40, 85, 30, 95, 55, 75, 50, 90, 65, 45, 80].map((h, i) => (
                                            <div key={i} className="flex-1 group relative">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 1, delay: i * 0.05 }}
                                                    className={`w-full bg-gradient-to-t ${i === 4 || i === 8 ? 'from-[#1DB954] to-[#1ED760]' : 'from-white/5 to-white/10'} rounded-t-xl group-hover:from-[#1DB954] group-hover:to-[#1ED760] transition-all`}
                                                />
                                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#A7A7A7] uppercase opacity-0 group-hover:opacity-100 transition-all">Day {i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-10">
                                        {[
                                            { label: "PIX", val: stats?.volumeByMethod?.PIX || 0, p: "72%", sub: t("pix_instant") },
                                            { label: "BOLETO", val: stats?.volumeByMethod?.BOLETO || 0, p: "18%", sub: t("boleto_d2") },
                                            { label: "LINK", val: stats?.volumeByMethod?.LINK || 0, p: "10%", sub: t("pointify_links") },
                                        ].map((item, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{item.label}</p>
                                                    <p className="text-[9px] font-black text-[#1DB954] uppercase">{item.p}</p>
                                                </div>
                                                <h4 className="text-xl font-black text-white tabular-nums">R$ <CountUp to={item.val} decimals={2} /></h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <Card className="xl:col-span-4 bg-[#121212] border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-3xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954]">
                                            <TrendingUp className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{t("conversion_rate")}</h3>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{t("payment_efficiency")}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: "Links Pagos", val: "94.2%", color: "text-[#1DB954]" },
                                            { label: "Boletos Compensados", val: "42.8%", color: "text-amber-500" },
                                            { label: "Retenção de Base", val: "88.5%", color: "text-sky-500" }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                                <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{stat.label}</span>
                                                <span className={`text-sm font-black ${stat.color}`}>{stat.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button className="w-full h-16 rounded-[2rem] bg-white text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all mt-10">{t("fiscal_report_desc")}</Button>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {tab === "financial" && (
                    <motion.div key="financial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* Filters Row */}
                        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-[#121212] p-8 rounded-[2.5rem] border border-white/5">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-[#A7A7A7]">
                                    <Filter className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t("filters")}:</span>
                                </div>
                                <select
                                    className="bg-black text-[#A7A7A7] border-none rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none ring-1 ring-white/10 focus:ring-[#1DB954]"
                                    onChange={(e) => setFilterMethod(e.target.value)}
                                    value={filterMethod}
                                >
                                    <option value="ALL">{t("all")}</option>
                                    <option value="PIX">PIX</option>
                                    <option value="BOLETO">BOLETO</option>
                                    <option value="LINK">LINK</option>
                                </select>
                                <select
                                    className="bg-black text-[#A7A7A7] border-none rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none ring-1 ring-white/10 focus:ring-[#1DB954]"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    value={filterStatus}
                                >
                                    <option value="ALL">{t("all")}</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="FAILED">FAILED</option>
                                </select>
                                <div className="relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                    <input
                                        className="h-12 w-64 bg-black border-none rounded-full pl-14 pr-6 text-[10px] font-black text-white uppercase tracking-widest placeholder:text-[#A7A7A7] outline-none ring-1 ring-white/10 focus:ring-[#1DB954]"
                                        placeholder={`${t("search_tx")}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="h-12 px-10 rounded-full bg-[#1DB954] text-black font-black uppercase text-[10px] tracking-widest">
                                <Download className="w-4 h-4 mr-2" /> {t("export_ledger")}
                            </Button>
                        </div>

                        {/* Transaction List */}
                        <Card className="bg-[#121212] border-white/5 rounded-[3rem] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white/[0.01] border-b border-white/5">
                                            <th className="px-10 py-6 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">ID / {t("date")}</th>
                                            <th className="px-10 py-6 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("users")}</th>
                                            <th className="px-10 py-6 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{t("transaction")}</th>
                                            <th className="px-10 py-6 text-right text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Gross / Spread</th>
                                            <th className="px-10 py-6 text-right text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest pr-10">{t("status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredTransactions.map((tx, i) => (
                                            <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                                <td className="px-10 py-8">
                                                    <p className="text-[10px] font-black text-white uppercase font-mono">{tx.id.substring(0, 12)}</p>
                                                    <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(tx.createdAt).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <p className="text-[11px] font-black text-white uppercase italic">{tx.user.name}</p>
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{tx.user.email}</p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/10 w-fit">
                                                        <Zap className="w-3 h-3 text-[#1DB954]" /> {tx.method}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right tabular-nums">
                                                    <p className="text-sm font-black text-white">R$ {(tx.grossAmount / 100).toLocaleString()}</p>
                                                    <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                                                        <TrendingUp className="w-2.5 h-2.5" /> Spread: R$ {(tx.spread / 100).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-10 py-8 text-right pr-10">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${tx.status === 'COMPLETED' ? 'bg-[#1DB954]/5 text-[#1DB954] border-[#1DB954]/10' :
                                                        tx.status === 'FAILED' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' : 'bg-white/5 text-[#A7A7A7] border-white/10'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {tab === "users" && (
                    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <Card className="bg-[#121212] border-white/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{t("members")}</h3>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{t("risk_assessment_desc")}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                        <input className="h-14 w-80 bg-white/[0.02] border-none rounded-full pl-14 pr-6 text-[11px] font-black text-white uppercase tracking-widest placeholder:text-[#A7A7A7] outline-none focus:ring-1 focus:ring-white/10" placeholder={t("search_accounts")} />
                                    </div>
                                    <Button className="h-14 px-10 rounded-full bg-white text-black font-black uppercase text-[10px] tracking-widest">{t("new_profile")}</Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white/[0.01] border-b border-white/5">
                                            <th className="px-10 py-6 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("users")}</th>
                                            <th className="px-10 py-6 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("risk_status")}</th>
                                            <th className="px-10 py-6 text-right text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("available_balance_admin")}</th>
                                            <th className="px-10 py-6 text-right text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.2em]">{t("actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map((u, i) => (
                                            <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-white border border-white/5 group-hover:border-[#1DB954]/40 transition-all">
                                                            {u.name?.[0] || u.email[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">{u.name || "Default User"}</p>
                                                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{u.email}</p>
                                                            {u.instagram && <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mt-1">@ {u.instagram.replace('@', '')}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-3">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${u.status === 'ACTIVE' ? 'bg-[#1DB954]/5 text-[#1DB954] border-[#1DB954]/10' :
                                                            u.status === 'BLOCKED' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' : 'bg-white/5 text-[#A7A7A7] border-white/10'
                                                            }`}>
                                                            {u.status}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <div className={`h-full ${u.riskScore > 70 ? 'bg-rose-500' : u.riskScore > 30 ? 'bg-amber-500' : 'bg-[#1DB954]'}`} style={{ width: `${u.riskScore || 5}%` }} />
                                                            </div>
                                                            <span className="text-[9px] font-black text-[#A7A7A7] uppercase">Score {u.riskScore || 0}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right tabular-nums">
                                                    <p className="text-lg font-black text-[#1DB954]">{u.pointsBalance.toLocaleString()}</p>
                                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{t("total_points")}</p>
                                                </td>
                                                <td className="px-10 py-8 text-right pr-10">
                                                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        {u.kycStatus === 'PENDING' && (
                                                            <Button onClick={() => approveUserKyc("SUPER_ADMIN_ID", u.id).then(refreshData)} className="h-10 px-6 rounded-full bg-[#1DB954] text-black text-[9px] font-black uppercase">{t("approve")}</Button>
                                                        )}
                                                        <Button variant="ghost" className="h-10 px-6 rounded-full border border-white/5 text-[#A7A7A7] text-[9px] font-black uppercase">{t("terminate")}</Button>
                                                        <Button variant="ghost" className="w-10 h-10 rounded-full p-0 border border-white/5 text-[#A7A7A7]">
                                                            <Settings className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Percents = ({ className }: { className?: string }) => <div className={className}><TrendingUp className="w-full h-full" /></div>;
const Percent = ({ className }: { className?: string }) => <div className={className}><TrendingUp className="w-full h-full" /></div>;
