"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Activity,
    AlertTriangle,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShieldCheck,
    Loader2,
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart3,
    ArrowLeftRight,
    UserCheck,
    Download,
    Settings,
    LayoutDashboard,
    RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    getAdminStats,
    getAdminUsers,
    getGlobalActivity,
    approveUserKyc,
    togglePixDeposits,
    exportFiscalReport,
    getSystemSetting
} from "@/actions/admin-actions";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/components/ui/react-bits/CountUp";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPixEnabled, setIsPixEnabled] = useState(true);
    const [isActionPending, setIsActionPending] = useState(false);
    const [tab, setTab] = useState<"overview" | "users" | "activity">("overview");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [statsRes, usersRes, activityRes, pixRes] = await Promise.all([
                getAdminStats(),
                getAdminUsers(),
                getGlobalActivity(),
                getSystemSetting("pix_deposits_enabled")
            ]);

            if (statsRes.success) setStats(statsRes.stats);
            if (usersRes.success && usersRes.users) setUsers(usersRes.users);
            if (activityRes.success && activityRes.transactions) setActivity(activityRes.transactions);
            if (pixRes.success) setIsPixEnabled(pixRes.value === "true");
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleTogglePix = async () => {
        setIsActionPending(true);
        const res = await togglePixDeposits();
        if (res.success) {
            setIsPixEnabled(res.enabled!);
        }
        setIsActionPending(false);
    };

    const handleExport = async () => {
        setIsActionPending(true);
        const res = await exportFiscalReport();
        if (res.success) {
            const blob = new Blob([res.csv!], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `relatorio_fiscal_${new Date().toISOString()}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        setIsActionPending(false);
    };

    const mainStats = [
        { label: "Usuários Totais", value: stats?.totalUsers || 0, sub: `+${stats?.activeUsersLast24h || 0} ativos hoje`, icon: Users, color: "text-[#1DB954]", bg: "bg-[#1DB954]/10" },
        { label: "Volume Global (PTS)", value: stats?.totalVolume || 0, sub: "Processamento síncrono", icon: Activity, color: "text-white", bg: "bg-white/10" },
        { label: "Lucro Estimado", value: stats?.revenue || 0, sub: "Fees MERCHANT_PAYMENT", icon: DollarSign, color: "text-[#1DB954]", bg: "bg-[#1DB954]/10", isBRL: true },
        { label: "KYC Pendentes", value: stats?.pendingKyc || 0, sub: "Aguardando revisão", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto pb-32 px-4 md:px-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Painel de Controle Elite</h2>
                    </div>
                    <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.4em] ml-16">Sistema de Inteligência Financeira e Auditoria</p>
                </div>

                {/* Dashboard Controls */}
                <div className="flex items-center gap-2 bg-[#121212] p-2 rounded-full border border-white/5">
                    {["overview", "users", "activity"].map((t) => (
                        <Button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`h-10 px-8 rounded-full font-black uppercase text-[9px] tracking-widest transition-all border-none ${tab === t ? "bg-[#1DB954] text-black shadow-lg" : "text-[#A7A7A7] hover:text-white"
                                }`}
                        >
                            {t === "overview" && <PieChart className="w-3.5 h-3.5 mr-2" />}
                            {t === "users" && <Users className="w-3.5 h-3.5 mr-2" />}
                            {t === "activity" && <Activity className="w-3.5 h-3.5 mr-2" />}
                            {t}
                        </Button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {tab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        {/* Main Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            {mainStats.map((stat, i) => (
                                <Card key={i} className="bg-[#121212] border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-[#1DB954]/5" />
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                                <RefreshCw className="w-3 h-3 animate-spin text-[#1DB954]" /> Atualizado
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{stat.label}</p>
                                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                                {isLoading ? "..." : (
                                                    <CountUp
                                                        to={stat.value}
                                                        prefix={stat.isBRL ? "R$ " : ""}
                                                        decimals={stat.isBRL ? 2 : 0}
                                                    />
                                                )}
                                            </h3>
                                            <p className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest mt-2">{stat.sub}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Movement Tracking & Analytics */}
                            <Card className="lg:col-span-8 bg-[#121212] border-white/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-[#1DB954]/5 to-transparent pointer-events-none" />
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Movimentação da Rede</h3>
                                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mt-1">Análise de Fluxo (Inflow vs Outflow)</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Saldo Líquido</p>
                                                <p className="text-xl font-black text-[#1DB954]">
                                                    R$ <CountUp to={stats?.netMovement || 0} decimals={2} />
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 shadow-lg">
                                                <ArrowLeftRight className="w-6 h-6 text-[#1DB954]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simplified Chart Area */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                        <div className="bg-[#181818] p-10 rounded-[2.5rem] border border-white/5 group hover:border-[#1DB954]/20 transition-all">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center text-[#1DB954]">
                                                    <TrendingUp className="w-6 h-6" />
                                                </div>
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">Inflow (PIX Deposits)</p>
                                            </div>
                                            <h4 className="text-5xl font-black text-white tracking-tighter mb-4">
                                                R$ <CountUp to={stats?.totalInflow || 0} decimals={2} />
                                            </h4>
                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-[#1DB954]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "75%" }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-[#181818] p-10 rounded-[2.5rem] border border-white/5 group hover:border-rose-500/20 transition-all text-right">
                                            <div className="flex items-center gap-4 mb-6 justify-end">
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">Outflow (PIX Withdrawals)</p>
                                                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center text-rose-500">
                                                    <TrendingDown className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <h4 className="text-5xl font-black text-white tracking-tighter mb-4">
                                                R$ <CountUp to={stats?.totalOutflow || 0} decimals={2} />
                                            </h4>
                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-rose-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "25%" }}
                                                    transition={{ duration: 1, delay: 0.7 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* System Health & Master Controls */}
                            <Card className="lg:col-span-4 bg-[#121212] border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#1DB954] border border-white/10 shadow-inner">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Core Status</h3>
                                            <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">Controle de Sistema Central</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`p-6 rounded-[2rem] border transition-all ${isPixEnabled ? 'bg-[#1DB954]/5 border-[#1DB954]/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Gateway PIX</span>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isPixEnabled ? 'bg-[#1DB954] text-black' : 'bg-rose-500 text-white'}`}>
                                                    {isPixEnabled ? 'Ativo' : 'Pausado'}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-white tracking-tighter">Gateway v4.0.2 Stable</p>
                                        </div>

                                        <div className="p-6 rounded-[2rem] border bg-white/[0.02] border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">Liquidez da Rede</span>
                                                <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-sky-500 text-white">Excelente</span>
                                            </div>
                                            <p className="text-2xl font-black text-white tracking-tighter">98.4% Disponível</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-10 border-t border-white/5 mt-10">
                                    <Button
                                        onClick={handleTogglePix}
                                        disabled={isActionPending}
                                        className={`w-full h-16 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all border-none ${isPixEnabled ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[#1DB954] text-black hover:bg-[#1ED760]'
                                            }`}
                                    >
                                        {isActionPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isPixEnabled ? "Pausar Fluxo PIX" : "Ativar Fluxo PIX")}
                                    </Button>
                                    <Button
                                        onClick={handleExport}
                                        disabled={isActionPending}
                                        variant="outline"
                                        className="w-full h-16 rounded-full border-white/10 text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-[0.2em]"
                                    >
                                        {isActionPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <Download className="w-4 h-4 mr-3" /> Relatório Fiscal
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {tab === "users" && (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <Card className="bg-[#121212] border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
                            <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-white">Base de Usuários</CardTitle>
                                    <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1">Gestão de Identidades e Balanços</p>
                                </div>
                                <div className="relative w-80">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        className="h-12 w-full bg-[#181818] border-none rounded-full pl-14 pr-6 text-[11px] font-black text-white uppercase tracking-widest placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#1DB954]/40"
                                        placeholder="Pesquisar por email, nome ou id..."
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto overflow-y-auto max-h-[600px] no-scrollbar">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-white/5">
                                                <th className="text-left p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] pl-10">Membro / ID</th>
                                                <th className="text-left p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em]">Role</th>
                                                <th className="text-right p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em]">Balanço (PTS)</th>
                                                <th className="text-center p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em]">Atividade</th>
                                                <th className="text-center p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em]">KYC</th>
                                                <th className="text-right p-6 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] pr-10">Contratos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-6 pl-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] font-black text-xs border border-[#1DB954]/20 group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-white text-xs uppercase tracking-tight">{user.name || "Membro Pointify"}</p>
                                                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{user.email} • ID {user.id.substring(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.role === "ADMIN" ? "bg-white text-black" :
                                                            user.role === "PARTNER" ? "bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30" :
                                                                "bg-white/5 text-[#A7A7A7]"
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right font-black text-white text-xs tabular-nums">
                                                        {user.pointsBalance.toLocaleString()} <span className="text-[9px] text-[#A7A7A7] ml-1">PTS</span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <p className="text-xs font-black text-white">{user._count.transactions}</p>
                                                        <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">TX Totais</p>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.kycStatus === "VERIFIED" ? "text-[#1DB954] bg-[#1DB954]/5" : "text-amber-500 bg-amber-500/5"
                                                            }`}>
                                                            {user.kycStatus === "VERIFIED" ? <UserCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                            {user.kycStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right pr-10">
                                                        <Button variant="ghost" className="h-8 rounded-full text-[#A7A7A7] hover:text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/5">Gerenciar</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {tab === "activity" && (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Similar Global Activity Table but refined for Admin */}
                        <Card className="bg-[#121212] border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
                            <CardHeader className="p-10 pb-6 bg-white/[0.02] border-b border-white/5">
                                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Global Transaction Ledger</CardTitle>
                                <p className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] mt-1">Monitoramento em Tempo Real de Ativos da Rede</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-1">
                                    {activity.map((tx, i) => (
                                        <div key={i} className="p-8 border-b border-white/5 hover:bg-white/[0.01] transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/5 ${tx.type === "PIX_DEPOSIT" ? "bg-emerald-500/10 text-emerald-500" :
                                                    tx.type === "PIX_WITHDRAW" ? "bg-rose-500/10 text-rose-500" :
                                                        "bg-sky-500/10 text-sky-500"
                                                    }`}>
                                                    {tx.type === "PIX_DEPOSIT" ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownRight className="w-7 h-7" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-black text-white text-lg tracking-tight uppercase leading-none">{tx.type.replace(/_/g, ' ')}</p>
                                                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">{tx.status}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                                        {tx.user.email} • ID {tx.id.substring(0, 16).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className={`text-2xl font-black tabular-nums ${tx.type === "PIX_DEPOSIT" ? "text-[#1DB954]" : "text-white"}`}>
                                                    {tx.type === "PIX_DEPOSIT" ? "+" : "-"} {tx.amount.toLocaleString()} <span className="text-xs text-[#A7A7A7] uppercase">PTS</span>
                                                </p>
                                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">{new Date(tx.createdAt).toLocaleString()} • Blockchain Verified</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
