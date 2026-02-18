"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { loginAction } from "@/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const res = await loginAction(formData);

            if (res?.success) {
                router.push("/dashboard");
            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                setError(res?.error || "Falha na autenticação");

                if (newAttempts >= 3) {
                    setTimeout(() => {
                        router.push("/forgot-password");
                    }, 2000);
                }
            }
        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") return;
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-6 py-12 relative overflow-hidden">
            {/* Background dynamic elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#1DB954]/10 rounded-full blur-[180px] animate-pulse duration-[10s]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-[#1DB954]/5 rounded-full blur-[180px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="absolute top-10 left-10 hidden md:block">
                <Link href="/" className="flex items-center gap-3 text-[11px] font-black text-[#A7A7A7] hover:text-[#1DB954] transition-all group uppercase tracking-[0.3em]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#1DB954]/30 transition-all">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    {t("back_to_home")}
                </Link>
            </div>

            <div className="w-full max-w-[540px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="p-5 rounded-[2.5rem] bg-[#121212] border border-white/5 shadow-2xl mb-8 group hover:border-[#1DB954]/40 transition-all duration-700">
                        <Logo width={48} height={48} />
                    </div>
                </motion.div>

                <SpotlightCard className="border border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden bg-[#121212] p-2">
                    <CardHeader className="space-y-4 text-center pt-14 pb-8">
                        <div className="flex justify-center mb-2">
                            <span className="px-6 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] font-black uppercase tracking-[0.4em] border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                                Quantum Security
                            </span>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">Acesse sua Conta</CardTitle>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] opacity-60">
                            Central de Operações Pointify Global
                        </p>
                    </CardHeader>

                    <CardContent className="px-8 md:px-14 pb-16 pt-4">
                        <AnimatePresence mode="wait">
                            {/* Pending Approval Message */}
                            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pending_approval') === 'true' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-10 p-8 rounded-[2.5rem] bg-[#1DB954]/5 border border-[#1DB954]/10 flex items-start gap-5 shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-5 h-5 text-[#1DB954]" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest leading-none">Protocolo Criado</p>
                                        <p className="text-xs font-black text-[#1DB954]/60 uppercase tracking-tight">
                                            Aguarde alguns minutos. Vamos aprovar a sua conta.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-10 p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex items-start gap-5 shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Acesso Negado</p>
                                        <p className="text-xs font-black text-rose-500/60 uppercase tracking-tight">
                                            {attempts >= 3 ? "Multiplas falhas detectadas. Aguarde." : error}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-10">
                            <div className="space-y-4 group">
                                <div className="flex items-center justify-between px-6">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] group-focus-within:text-[#1DB954] transition-colors" htmlFor="email">Identificador Principal</label>
                                    <ShieldCheck className="w-4 h-4 text-white/5 group-focus-within:text-[#1DB954]/40 transition-colors" />
                                </div>
                                <Input
                                    id="email"
                                    placeholder="USUARIO@NETWORK.COM"
                                    type="email"
                                    required
                                    className="h-20 rounded-[2rem] bg-[#181818] border-white/5 font-black text-sm px-10 focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest shadow-inner group-hover:border-white/10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 group">
                                <div className="flex justify-between items-center px-6">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] group-focus-within:text-[#1DB954] transition-colors" htmlFor="password">Chave Criptográfica</label>
                                    <Link href="/forgot-password" title="Recuperar Acesso" className="text-[9px] font-black text-[#A7A7A7] hover:text-[#1DB954] transition-colors uppercase tracking-widest">Esqueceu a chave?</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="h-20 rounded-[2rem] bg-[#181818] border-white/5 font-black text-sm px-10 pr-20 focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 shadow-inner group-hover:border-white/10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-10 top-1/2 -translate-y-1/2 text-[#A7A7A7] hover:text-[#1DB954] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5 opacity-40" /> : <Eye className="w-5 h-5 opacity-40" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-white text-black hover:bg-[#1DB954] hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.03] active:scale-[0.97] border-none relative overflow-hidden group"
                                    disabled={isLoading || attempts >= 3}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Verificando Identidade...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 fill-current" />
                                            Autenticar Acesso
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-14 text-center space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-white/5" />
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Ou entre via</span>
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>

                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                {t("no_account")}{" "}
                                <Link href="/register" className="text-[#1DB954] font-black hover:text-[#1ED760] transition-colors underline underline-offset-[12px] decoration-2 ml-3">
                                    {t("create_account")}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </SpotlightCard>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-[#A7A7A7]/30 uppercase tracking-[0.5em]">
                        © 2026 POINTIFY SYSTEMS — ENCRYPTED SESSION
                    </p>
                </div>
            </div>
        </div>
    );
}
