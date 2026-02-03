"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    RefreshCcw,
    Activity,
    AlertTriangle,
    Search,
    ArrowUpRight,
    DollarSign,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    getAdminStats,
    getGlobalActivity,
    approveUserKyc,
    togglePixDeposits,
    exportFiscalReport,
    getSystemSetting
} from "@/actions/admin-actions";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPixEnabled, setIsPixEnabled] = useState(true);
    const [isActionPending, setIsActionPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const statsRes = await getAdminStats();
            const activityRes = await getGlobalActivity();
            const pixRes = await getSystemSetting("pix_deposits_enabled");

            if (statsRes.success) setStats(statsRes.stats || { totalUsers: 0, totalVolume: 0, pendingKyc: 0, revenue: 0 });
            if (activityRes.success) setActivity(activityRes.transactions || []);
            if (pixRes.success) setIsPixEnabled(pixRes.value === "true");
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleApprove = async (userId: string) => {
        const res = await approveUserKyc(userId);
        if (res.success) {
            alert("Usuário aprovado com sucesso!");
            const activityRes = await getGlobalActivity();
            if (activityRes.success) setActivity(activityRes.transactions || []);
        }
    };

    const handleTogglePix = async () => {
        setIsActionPending(true);
        const res = await togglePixDeposits();
        if (res.success) {
            setIsPixEnabled(res.enabled!);
            alert(`Depósitos PIX ${res.enabled ? 'ATIVADOS' : 'PAUSADOS'} com sucesso.`);
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
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `relatorio_fiscal_${new Date().toISOString()}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        setIsActionPending(false);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Painel Administrativo</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Visão Geral de Faturamento e Operações</p>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Usuários", value: stats?.totalUsers || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Volume Total (PTS)", value: stats?.totalVolume?.toLocaleString() || "0", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Faturamento Estimado", value: `BRL ${stats?.revenue?.toLocaleString() || "0"}`, icon: DollarSign, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "KYC Pendentes", value: stats?.pendingKyc || "0", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border border-slate-100 dark:border-white/5 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {isLoading ? "..." : stat.value}
                            </p>
                            <div className="flex items-center gap-1 mt-3 text-[10px] text-emerald-600 font-black uppercase tracking-wider">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                +Real-time update
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent System Activity */}
                <Card className="lg:col-span-2 border border-slate-100 dark:border-white/5 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Últimas Transações</CardTitle>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monitoramento global em tempo real</p>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 dark:ring-white/5 focus:ring-emerald-500 transition-all"
                                placeholder="Filtrar eventos..."
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/30 border-y border-slate-100 dark:border-white/5">
                                        <th className="text-left p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário / ID</th>
                                        <th className="text-left p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                                        <th className="text-left p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                        <th className="text-left p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                                        <th className="text-right p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Carregando dados...</td></tr>
                                    ) : activity.length === 0 ? (
                                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Nenhuma atividade registrada</td></tr>
                                    ) : (
                                        activity.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="p-5">
                                                    <p className="font-black text-slate-900 dark:text-white text-sm">{row.user.email}</p>
                                                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{row.userId.substring(0, 12)}...</p>
                                                </td>
                                                <td className="p-5 font-bold text-xs text-slate-600 dark:text-slate-400 uppercase">{row.type.replace(/_/g, ' ')}</td>
                                                <td className="p-5 font-black text-sm text-slate-900 dark:text-white">
                                                    {row.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">{row.currency}</span>
                                                </td>
                                                <td className="p-5 text-xs text-slate-500 font-bold">{new Date(row.createdAt).toLocaleDateString()}</td>
                                                <td className="p-5 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${row.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* System Control / Security */}
                <Card className="bg-slate-900 border-none shadow-2xl rounded-[2.5rem] p-8 space-y-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Controle de Segurança</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Status do Core System</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Depósitos PIX</span>
                                    <span className={`font-black ${isPixEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPixEnabled ? 'ATIVO' : 'PAUSADO'}
                                    </span>
                                </div>
                                <div className="text-2xl font-black text-white">1.00 BRL = 100 PTS</div>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Liquidez Global</span>
                                    <span className="text-sky-400 font-black">STABLE</span>
                                </div>
                                <div className="text-2xl font-black text-white">4.288 BTC</div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Ações Rápidas do Administrador</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                onClick={handleTogglePix}
                                disabled={isActionPending}
                                className={`h-14 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-[1.02] ${isPixEnabled
                                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    }`}
                            >
                                {isActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPixEnabled ? "Pausar Depósitos PIX" : "Ativar Depósitos PIX")}
                            </Button>
                            <Button
                                onClick={handleExport}
                                disabled={isActionPending}
                                variant="outline"
                                className="h-14 rounded-2xl border-white/10 text-white hover:bg-white/5 font-black uppercase text-xs tracking-widest transition-all"
                            >
                                {isActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Exportar Relatório Fiscal"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
