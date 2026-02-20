"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Users, Activity, ShieldCheck, Search, TrendingUp, TrendingDown,
    Download, Settings, DollarSign, RefreshCw, Zap, Filter,
    ArrowUpRight, ArrowDownRight, Calendar, ArrowUpDown, Bitcoin,
    Clock, CheckCircle2, XCircle, AlertCircle, UserCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    getAdminStats, getAdminUsers, getGlobalActivity,
    getAdminLogs, approveUserKyc, approveUser, terminateUser, rejectUser
} from "@/actions/admin-actions";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/components/ui/react-bits/CountUp";
import { useLanguage } from "@/components/providers/language-provider";
import { FEES } from "@/lib/fees";

export const dynamic = "force-dynamic";

type Tab = "overview" | "users" | "financial" | "fees" | "logs";
type ModalAction = "terminate" | "reject" | null;

const ADMIN_ID = "SUPER_ADMIN";

export default function AdminDashboardPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("overview");
    const [filterMethod, setFilterMethod] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal de confirmação
    const [modalAction, setModalAction] = useState<ModalAction>(null);
    const [modalUser, setModalUser] = useState<any>(null);
    const [modalConfirmText, setModalConfirmText] = useState("");
    const [modalLoading, setModalLoading] = useState(false);

    const openModal = (action: ModalAction, user: any) => {
        setModalAction(action);
        setModalUser(user);
        setModalConfirmText("");
    };

    const closeModal = () => {
        setModalAction(null);
        setModalUser(null);
        setModalConfirmText("");
    };

    const handleModalConfirm = async () => {
        if (!modalUser || !modalAction) return;
        setModalLoading(true);
        if (modalAction === "terminate") {
            await terminateUser(ADMIN_ID, modalUser.id);
        } else if (modalAction === "reject") {
            await rejectUser(ADMIN_ID, modalUser.id);
        }
        setModalLoading(false);
        closeModal();
        refresh();
    };

    const modalConfirmWord = modalUser?.name?.split(" ")?.[0] || modalUser?.email?.split("@")?.[0] || "CONFIRMAR";

    const refresh = async () => {
        setIsLoading(true);
        const [sRes, uRes, aRes, lRes] = await Promise.all([
            getAdminStats(),
            getAdminUsers(),
            getGlobalActivity(),
            getAdminLogs(),
        ]);
        if (sRes.success) setStats(sRes.stats);
        if (uRes.success && uRes.users) setUsers(uRes.users);
        if (aRes.success && aRes.transactions) setActivity(aRes.transactions);
        if (lRes.success && lRes.logs) setLogs(lRes.logs);
        setIsLoading(false);
    };

    useEffect(() => { refresh(); }, []);

    const filteredTx = activity.filter(tx => {
        if (filterMethod !== "ALL" && tx.method !== filterMethod) return false;
        if (filterStatus !== "ALL" && tx.status !== filterStatus) return false;
        if (searchQuery && !tx.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const fmt = (v: number) => `R$ ${(v / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    const fmtN = (v: number) => v?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? "0,00";
    const growth = (v: number) => v > 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`;

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "overview", label: t("admin_overview"), icon: Activity },
        { id: "users", label: t("admin_members"), icon: Users },
        { id: "financial", label: t("admin_movements"), icon: DollarSign },
        { id: "fees", label: t("admin_fees"), icon: Zap },
        { id: "logs", label: t("admin_audit"), icon: ShieldCheck },
    ];

    return (
        <div className="space-y-10 max-w-[1700px] mx-auto pb-32 px-4 md:px-8">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-12">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">{t("command_center")}</h2>
                    <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.5em] mt-3 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> {t("admin_shield_status")}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-full border border-white/5 shadow-2xl flex-wrap">
                    {tabs.map((tItem) => (
                        <button key={tItem.id} onClick={() => setTab(tItem.id)}
                            className={`h-11 px-6 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${tab === tItem.id ? "bg-[#1DB954] text-black shadow-[0_0_20px_rgba(29,185,84,0.3)]" : "text-[#A7A7A7] hover:text-white hover:bg-white/5"}`}>
                            <tItem.icon className="w-3.5 h-3.5" />{tItem.label}
                        </button>
                    ))}
                    <button onClick={refresh} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-[#A7A7A7] hover:text-white transition-all">
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* ══ OVERVIEW ══════════════════════════════════════════════ */}
                {tab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                        {/* KPIs principais */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                {
                                    label: "Volume Total", value: (stats?.totalVolume || 0) / 100,
                                    sub: `${stats?.txCount || 0} transações`, icon: Activity,
                                    growth: stats?.volGrowth, prefix: "R$"
                                },
                                {
                                    label: "Receita (Taxas)", value: (stats?.netRevenue || 0) / 100,
                                    sub: `Spread capturado`, icon: DollarSign,
                                    growth: stats?.spreadGrowth, prefix: "R$"
                                },
                                {
                                    label: "Ticket Médio", value: (stats?.ticketMedio || 0) / 100,
                                    sub: `por operação`, icon: TrendingUp,
                                    growth: null, prefix: "R$"
                                },
                                {
                                    label: "Liquidado Hoje", value: (stats?.volToday || 0) / 100,
                                    sub: `${stats?.txToday || 0} ops hoje`, icon: Zap,
                                    growth: null, prefix: "R$"
                                },
                            ].map((s, i) => (
                                <Card key={i} className="bg-[#121212] border-white/5 rounded-[2.5rem] p-8 hover:border-[#1DB954]/20 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1DB954]/[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-[#A7A7A7] group-hover:text-[#1DB954] transition-colors border border-white/5">
                                            <s.icon className="w-5 h-5" />
                                        </div>
                                        {s.growth !== null && s.growth !== undefined && (
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${s.growth >= 0 ? "text-[#1DB954] bg-[#1DB954]/5 border-[#1DB954]/10" : "text-rose-500 bg-rose-500/5 border-rose-500/10"}`}>
                                                {growth(s.growth)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mb-2">{s.label}</p>
                                    <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums">
                                        {s.prefix} <CountUp to={s.value} decimals={2} />
                                    </h3>
                                    <p className="text-[9px] font-black text-[#1DB954]/60 uppercase tracking-widest mt-4">{s.sub}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Métricas de usuários */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: "Total Usuários", value: stats?.totalUsers || 0, icon: Users, color: "text-sky-400" },
                                { label: "Novos Hoje", value: stats?.newUsersToday || 0, icon: UserCheck, color: "text-[#1DB954]" },
                                { label: "Novos no Mês", value: stats?.newUsersMonth || 0, icon: TrendingUp, color: "text-amber-400" },
                                { label: "Aguardando Aprovação", value: stats?.pendingKyc || 0, icon: Clock, color: "text-rose-400" },
                            ].map((s, i) => (
                                <Card key={i} className="bg-[#121212] border-white/5 rounded-[2.5rem] p-8 flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 ${s.color}`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{s.label}</p>
                                        <p className={`text-2xl font-black ${s.color} tabular-nums`}>{s.value}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Receita por Período */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <Card className="bg-[#121212] border-white/5 rounded-[3rem] p-10 space-y-8">
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Receita por Período</h3>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Taxas capturadas pela plataforma</p>
                                </div>
                                {[
                                    { label: "Hoje", vol: stats?.volToday || 0, spread: stats?.spreadToday || 0 },
                                    { label: "Este Mês", vol: stats?.volMonth || 0, spread: stats?.spreadMonth || 0 },
                                    { label: "Mês Anterior", vol: stats?.volLastMonth || 0, spread: stats?.spreadLastMonth || 0 },
                                    { label: "Total Acumulado", vol: stats?.totalVolume || 0, spread: stats?.netRevenue || 0 },
                                ].map((p, i) => (
                                    <div key={i} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{p.label}</p>
                                            <p className="text-sm font-black text-white mt-1">{fmt(p.vol)} <span className="text-[#A7A7A7] font-black text-[10px]">volume</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest">Receita</p>
                                            <p className="text-lg font-black text-[#1DB954]">{fmt(p.spread)}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            <Card className="bg-[#121212] border-white/5 rounded-[3rem] p-10 space-y-8">
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Volume por Canal</h3>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Distribuição por método de captura</p>
                                </div>
                                {["PIX", "BOLETO", "LINK", "SWAP", "OTHER"].map((method, i) => {
                                    const vol = stats?.volumeByMethod?.[method] || 0;
                                    const spread = stats?.spreadByMethod?.[method] || 0;
                                    const pct = stats?.totalVolume > 0 ? (vol / stats.totalVolume) * 100 : 0;
                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                    {method === "SWAP" ? <ArrowUpDown className="w-3.5 h-3.5 text-[#1DB954]" /> : <Zap className="w-3.5 h-3.5 text-[#1DB954]" />}
                                                    {method}
                                                </span>
                                                <span className="text-[9px] font-black text-[#1DB954]">{fmt(spread)}</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ED760] rounded-full"
                                                />
                                            </div>
                                            <div className="flex justify-between text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                                <span>{fmt(vol)}</span>
                                                <span>{pct.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* ══ USERS ═════════════════════════════════════════════════ */}
                {tab === "users" && (
                    <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <Card className="bg-[#121212] border-white/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase">Membros da Plataforma</h3>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{users.length} contas registradas</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                    <input className="h-12 w-72 bg-white/[0.03] border border-white/5 rounded-full pl-12 pr-5 text-[11px] font-black text-white uppercase tracking-widest placeholder:text-[#A7A7A7]/40 outline-none focus:border-[#1DB954]/30 transition-all"
                                        placeholder="Buscar por email..." onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            {["Usuário", "Status", "KYC", "Pontos", "Transações", "Ações"].map(h => (
                                                <th key={h} className="px-8 py-5 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest last:text-right">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {users
                                            .filter(u => !searchQuery || u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((u, i) => (
                                                <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center font-black text-[#1DB954] text-sm flex-shrink-0">
                                                                {(u.name?.[0] || u.email?.[0] || "?").toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-white">{u.name || "—"}</p>
                                                                <p className="text-[9px] font-black text-[#A7A7A7] tracking-widest">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${u.status === "ACTIVE" ? "text-[#1DB954] bg-[#1DB954]/5 border-[#1DB954]/10" : u.status === "BLOCKED" || u.status === "TERMINATED" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" : "text-amber-400 bg-amber-400/5 border-amber-400/10"}`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${u.kycStatus === "VERIFIED" ? "text-sky-400 bg-sky-400/5 border-sky-400/10" : "text-[#A7A7A7] bg-white/5 border-white/10"}`}>
                                                            {u.kycStatus || "PENDING"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-[#1DB954] font-black text-sm">{(u.yunyPoints || 0).toLocaleString()}</td>
                                                    <td className="px-8 py-6 text-white font-black text-sm">{u._count?.transactions || 0}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                                                            {(u.status === "PENDING" || u.kycStatus === "PENDING") && (
                                                                <>
                                                                    <button onClick={() => approveUser(ADMIN_ID, u.id).then(refresh)}
                                                                        className="px-4 py-2 rounded-full bg-[#1DB954] text-black text-[9px] font-black uppercase flex items-center gap-1.5 hover:bg-[#1ED760] transition-all">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> {t("approve")}
                                                                    </button>
                                                                    <button onClick={() => openModal("reject", u)}
                                                                        className="px-4 py-2 rounded-full border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-1.5 hover:bg-amber-500/5 transition-all">
                                                                        <AlertCircle className="w-3.5 h-3.5" /> {t("admin_reject")}
                                                                    </button>
                                                                </>
                                                            )}
                                                            {u.status !== "TERMINATED" && (
                                                                <button onClick={() => openModal("terminate", u)}
                                                                    className="px-4 py-2 rounded-full border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase flex items-center gap-1.5 hover:bg-rose-500/5 transition-all">
                                                                    <XCircle className="w-3.5 h-3.5" /> {t("terminate")}
                                                                </button>
                                                            )}
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

                {/* ══ FINANCIAL LEDGER ══════════════════════════════════════ */}
                {tab === "financial" && (
                    <motion.div key="financial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Filtros */}
                        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-[#121212] p-6 rounded-[2.5rem] border border-white/5">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-[#A7A7A7]">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Filtros</span>
                                </div>
                                {["ALL", "PIX", "BOLETO", "LINK", "SWAP"].map(m => (
                                    <button key={m} onClick={() => setFilterMethod(m)}
                                        className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${filterMethod === m ? "bg-[#1DB954] text-black border-[#1DB954]" : "border-white/10 text-[#A7A7A7] hover:text-white"}`}>
                                        {m}
                                    </button>
                                ))}
                                {["ALL", "COMPLETED", "PENDING", "FAILED"].map(s => (
                                    <button key={s} onClick={() => setFilterStatus(s)}
                                        className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${filterStatus === s ? "bg-white text-black border-white" : "border-white/10 text-[#A7A7A7] hover:text-white"}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                                    <input className="h-11 w-60 bg-white/[0.03] border border-white/5 rounded-full pl-12 pr-5 text-[10px] font-black text-white uppercase tracking-widest placeholder:text-[#A7A7A7]/40 outline-none focus:border-[#1DB954]/30"
                                        placeholder="Email do usuário..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                                <button className="h-11 px-6 rounded-full bg-[#1DB954] text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#1ED760] transition-all">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>
                        </div>

                        <Card className="bg-[#121212] border-white/5 rounded-[2.5rem] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            {["ID / Data", "Usuário", "Método", "Gross / Taxa", "Líquido", "Status"].map(h => (
                                                <th key={h} className="px-8 py-5 text-left text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest last:text-right">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {filteredTx.length === 0 ? (
                                            <tr><td colSpan={6} className="px-8 py-16 text-center text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Nenhuma transação encontrada</td></tr>
                                        ) : filteredTx.map((tx, i) => {
                                            const gross = tx.grossAmount || 0;
                                            const spread = tx.spread || 0;
                                            const net = gross - spread;
                                            return (
                                                <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                                    <td className="px-8 py-6">
                                                        <p className="text-[10px] font-black text-white font-mono">{tx.id?.substring(0, 10)}...</p>
                                                        <p className="text-[9px] font-black text-[#A7A7A7] mt-1">{new Date(tx.createdAt).toLocaleString("pt-BR")}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-xs font-black text-white">{tx.user?.name || "—"}</p>
                                                        <p className="text-[9px] font-black text-[#A7A7A7]">{tx.user?.email}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                                                            <Zap className="w-3 h-3 text-[#1DB954]" />{tx.method || "OTHER"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-white">{fmt(gross)}</p>
                                                        <p className="text-[9px] font-black text-[#1DB954] mt-1">Taxa: {fmt(spread)}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-white">{fmt(net)}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${tx.status === "COMPLETED" ? "text-[#1DB954] bg-[#1DB954]/5 border-[#1DB954]/10" : tx.status === "FAILED" ? "text-rose-500 bg-rose-500/5 border-rose-500/10" : "text-amber-400 bg-amber-400/5 border-amber-400/10"}`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* ══ TAXAS ════════════════════════════════════════════════ */}
                {tab === "fees" && (
                    <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                {
                                    title: "Enviar / Receber / Pagar",
                                    icon: Zap, color: "#1DB954",
                                    rule: `max(${FEES.TRANSACTION.PERCENT}%, R$ ${FEES.TRANSACTION.MIN_FLAT.toFixed(2)})`,
                                    detail: "A maior taxa é aplicada: 3% do valor ou R$0,50 mínimo",
                                    examples: [
                                        { val: "R$ 10,00", fee: `R$ 0,50 (mínimo)` },
                                        { val: "R$ 50,00", fee: `R$ 1,50 (3%)` },
                                        { val: "R$ 200,00", fee: `R$ 6,00 (3%)` },
                                        { val: "R$ 1.000,00", fee: `R$ 30,00 (3%)` },
                                    ]
                                },
                                {
                                    title: "Swap PTS → USDT",
                                    icon: ArrowUpDown, color: "#26A17B",
                                    rule: `${FEES.SWAP_USDT.PERCENT}% do valor convertido`,
                                    detail: "Taxa sobre o valor em USDT antes da entrega",
                                    examples: [
                                        { val: "1.000 PTS → 1 USDT", fee: "0,01 USDT (1%)" },
                                        { val: "5.000 PTS → 5 USDT", fee: "0,05 USDT (1%)" },
                                        { val: "10.000 PTS → 10 USDT", fee: "0,10 USDT (1%)" },
                                        { val: "50.000 PTS → 50 USDT", fee: "0,50 USDT (1%)" },
                                    ]
                                },
                                {
                                    title: "Swap PTS → BTC",
                                    icon: Bitcoin, color: "#F7931A",
                                    rule: `${FEES.SWAP_BTC.PERCENT}% do valor convertido`,
                                    detail: "Taxa sobre o valor em BTC antes da entrega",
                                    examples: [
                                        { val: "1.000 PTS → 0,0001 BTC", fee: "0,000002 BTC (2%)" },
                                        { val: "5.000 PTS → 0,0005 BTC", fee: "0,00001 BTC (2%)" },
                                        { val: "10.000 PTS → 0,001 BTC", fee: "0,00002 BTC (2%)" },
                                        { val: "50.000 PTS → 0,005 BTC", fee: "0,0001 BTC (2%)" },
                                    ]
                                },
                            ].map((card, i) => (
                                <Card key={i} className="bg-[#121212] border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                                            <card.icon className="w-5 h-5" style={{ color: card.color }} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Taxa</p>
                                            <p className="text-xs font-black text-white uppercase tracking-tight">{card.title}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: `${card.color}08`, borderColor: `${card.color}20` }}>
                                        <p className="text-lg font-black tracking-tight" style={{ color: card.color }}>{card.rule}</p>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-2">{card.detail}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Exemplos</p>
                                        {card.examples.map((ex, j) => (
                                            <div key={j} className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-[9px] font-black text-[#A7A7A7] uppercase">{ex.val}</span>
                                                <span className="text-[9px] font-black uppercase" style={{ color: card.color }}>{ex.fee}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Receita por tipo */}
                        <Card className="bg-[#121212] border-white/5 rounded-[2.5rem] p-10 space-y-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Receita por Tipo de Taxa</h3>
                            {[
                                { label: "Transações (3% / R$0,50)", value: stats?.feeFromTransactions || 0, color: "#1DB954", icon: Zap },
                                { label: "Swap USDT (1%)", value: stats?.feeFromSwapsUSDT || 0, color: "#26A17B", icon: ArrowUpDown },
                                { label: "Swap BTC (2%)", value: stats?.feeFromSwapsBTC || 0, color: "#F7931A", icon: Bitcoin },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                        </div>
                                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{item.label}</p>
                                    </div>
                                    <p className="text-xl font-black" style={{ color: item.color }}>{fmt(item.value)}</p>
                                </div>
                            ))}
                        </Card>
                    </motion.div>
                )}

                {/* ══ LOGS ═════════════════════════════════════════════════ */}
                {tab === "logs" && (
                    <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="bg-[#121212] border-white/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <h3 className="text-lg font-black text-white uppercase">Audit Log</h3>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">{logs.length} ações registradas</p>
                            </div>
                            <div className="divide-y divide-white/[0.03]">
                                {logs.length === 0 ? (
                                    <div className="py-16 text-center text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Nenhum log registrado</div>
                                ) : logs.map((log, i) => (
                                    <div key={i} className="px-8 py-5 flex items-center gap-6 hover:bg-white/[0.01] transition-all">
                                        <div className="w-9 h-9 rounded-xl bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-4 h-4 text-[#1DB954]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider">{log.action}</p>
                                            <p className="text-[9px] font-black text-[#A7A7A7] mt-0.5">{log.responsible?.email} · {new Date(log.createdAt).toLocaleString("pt-BR")}</p>
                                        </div>
                                        <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest truncate max-w-[200px]">
                                            {log.details ? JSON.stringify(JSON.parse(log.details)).slice(0, 60) : "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* ── Modal de Confirmação ──────────────────────────────────── */}
            <AnimatePresence>
                {modalAction && modalUser && (
                    <motion.div
                        key="confirm-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && closeModal()}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
                        >
                            {/* Ícone */}
                            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${modalAction === "terminate" ? "bg-rose-500/10 border border-rose-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                                {modalAction === "terminate"
                                    ? <XCircle className="w-7 h-7 text-rose-500" />
                                    : <AlertCircle className="w-7 h-7 text-amber-400" />
                                }
                            </div>

                            {/* Título */}
                            <div className="text-center space-y-2">
                                <p className={`text-xs font-black uppercase tracking-[0.4em] ${modalAction === "terminate" ? "text-rose-500" : "text-amber-400"}`}>
                                    {modalAction === "terminate" ? t("admin_confirm_terminate") : t("admin_confirm_reject")}
                                </p>
                                <p className="text-xl font-black text-white">{modalUser.name || modalUser.email}</p>
                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{modalUser.email}</p>
                            </div>

                            {/* Aviso */}
                            <div className={`p-4 rounded-2xl ${modalAction === "terminate" ? "bg-rose-500/5 border border-rose-500/10" : "bg-amber-500/5 border border-amber-500/10"}`}>
                                <p className={`text-[9px] font-black uppercase tracking-widest leading-relaxed ${modalAction === "terminate" ? "text-rose-400/70" : "text-amber-400/70"}`}>
                                    {modalAction === "terminate"
                                        ? t("admin_terminate_warning")
                                        : t("admin_reject_warning")}
                                </p>
                            </div>

                            {/* Campo de confirmação */}
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                    {t("admin_type_to_confirm")}: <span className="text-white">{modalConfirmWord.toUpperCase()}</span>
                                </p>
                                <input
                                    type="text"
                                    value={modalConfirmText}
                                    onChange={e => setModalConfirmText(e.target.value.toUpperCase())}
                                    placeholder={modalConfirmWord.toUpperCase()}
                                    className="w-full h-12 px-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/20 outline-none text-white font-black text-sm uppercase tracking-widest placeholder:text-white/10 transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Ações */}
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={closeModal}
                                    className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 text-[#A7A7A7] hover:text-white hover:border-white/20 transition-all">
                                    {t("cancel")}
                                </button>
                                <button
                                    onClick={handleModalConfirm}
                                    disabled={modalConfirmText !== modalConfirmWord.toUpperCase() || modalLoading}
                                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${modalAction === "terminate" ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-amber-500 text-black hover:bg-amber-400"}`}>
                                    {modalLoading
                                        ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("processing")}</>
                                        : (modalAction === "terminate" ? t("terminate") : t("admin_reject"))}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
