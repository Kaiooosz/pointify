"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, ArrowLeft, AlertCircle, RefreshCw,
    ShieldCheck, Zap, Mail, Clock, ArrowRight, UserPlus, Lock
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { loginAction, checkEmailStatus } from "@/actions/auth-actions";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";
import { ThemeAndLanguageToggle } from "@/components/layout/theme-language-toggle";

// ─── Tipos de tela ───────────────────────────────────────────────────────────
type Screen =
    | "email"          // Etapa 1: inserir e-mail
    | "password"       // Etapa 2: conta ativa → inserir senha
    | "pending"        // Conta existe mas está PENDING
    | "blocked";       // Conta bloqueada

export default function LoginPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const [screen, setScreen] = useState<Screen>("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);

    // ── Step 1: Verificar e-mail ──────────────────────────────────────────────
    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await checkEmailStatus(email);

            if (!res.exists) {
                // Não tem conta → levar para criar conta
                router.push(`/register?email=${encodeURIComponent(email)}`);
                return;
            }

            // Tem conta — verificar status
            if (res.status === "PENDING" || res.status === "ANALYSIS") {
                setScreen("pending");
            } else if (res.status === "BLOCKED" || res.status === "TERMINATED") {
                setScreen("blocked");
            } else {
                // ACTIVE, OPERATIONAL, FINANCE etc → pedir senha
                setScreen("password");
            }
        } catch {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Step 2: Login com senha ───────────────────────────────────────────────
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

                if (newAttempts >= 3) {
                    // 3 tentativas erradas → redirecionar para recuperar senha
                    setError("Múltiplas falhas detectadas. Redirecionando...");
                    setTimeout(() => {
                        router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
                    }, 1800);
                } else {
                    setError(res?.error || "Credenciais inválidas.");
                }
            }
        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") return;
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Variantes de animação ─────────────────────────────────────────────────
    const slideVariants = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    };

    const attemptsLeft = 3 - attempts;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#1DB954]/10 rounded-full blur-[180px] animate-pulse duration-[10s]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-[#1DB954]/5 rounded-full blur-[180px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Back */}
            <div className="absolute top-10 left-10 hidden md:block">
                <Link href="/" className="flex items-center gap-3 text-[11px] font-black text-[#A7A7A7] hover:text-[#1DB954] transition-all group uppercase tracking-[0.3em]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#1DB954]/30 transition-all">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    {t("back_to_home")}
                </Link>
            </div>

            {/* Theme toggle */}
            <div className="absolute top-10 right-10 z-50 hidden md:block">
                <ThemeAndLanguageToggle />
            </div>

            <div className="w-full max-w-[540px] relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="p-5 rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 shadow-2xl mb-8 group hover:border-[#1DB954]/40 transition-all duration-700">
                        <Logo width={48} height={48} />
                    </div>
                </motion.div>

                <SpotlightCard className="border border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden bg-[#0F0F0F] p-2">
                    <CardHeader className="space-y-4 text-center pt-14 pb-8">
                        <div className="flex justify-center mb-2">
                            <span className="px-6 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] font-black uppercase tracking-[0.4em] border border-[#1DB954]/20 shadow-[0_0_20px_rgba(29,185,84,0.1)]">
                                Quantum Security
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={screen}
                                variants={slideVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                            >
                                <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                                    {screen === "email" && "Acesse sua Conta"}
                                    {screen === "password" && "Sua Chave"}
                                    {screen === "pending" && "Em Análise"}
                                    {screen === "blocked" && "Acesso Restrito"}
                                </CardTitle>
                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] opacity-60 mt-3">
                                    {screen === "email" && "Central de Operações Pointify Global"}
                                    {screen === "password" && email.toUpperCase()}
                                    {screen === "pending" && "Protocolo pendente de validação"}
                                    {screen === "blocked" && "Conta suspensa pelo sistema"}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </CardHeader>

                    <CardContent className="px-8 md:px-14 pb-16 pt-4">

                        {/* ── Alertas ─────────────────────────────────────────── */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 p-6 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 flex items-start gap-4"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <div className="space-y-1 pt-0.5">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                            {attempts >= 3 ? "Bloqueio Temporário" : "Acesso Negado"}
                                        </p>
                                        <p className="text-xs font-black text-rose-500/60 uppercase tracking-tight">{error}</p>
                                        {attempts > 0 && attempts < 3 && (
                                            <p className="text-[10px] text-rose-500/40 uppercase tracking-widest mt-1">
                                                {attemptsLeft} tentativa{attemptsLeft !== 1 ? "s" : ""} restante{attemptsLeft !== 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── SCREEN: email ────────────────────────────────────── */}
                        <AnimatePresence mode="wait">
                            {screen === "email" && (
                                <motion.form
                                    key="email-screen"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                    onSubmit={handleCheckEmail}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4 group">
                                        <div className="flex items-center justify-between px-6">
                                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] group-focus-within:text-[#1DB954] transition-colors" htmlFor="email">
                                                Identificador Principal
                                            </label>
                                            <ShieldCheck className="w-4 h-4 text-white/5 group-focus-within:text-[#1DB954]/40 transition-colors" />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#A7A7A7]/30 group-focus-within:text-[#1DB954]/60 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="email"
                                                placeholder="USUARIO@NETWORK.COM"
                                                type="email"
                                                required
                                                autoFocus
                                                className="h-20 rounded-[2rem] bg-[#050505] border-[#1DB954]/20 font-black text-sm pl-20 pr-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest shadow-inner group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-white text-black hover:bg-[#1DB954] hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.03] active:scale-[0.97] border-none group"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Verificando...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                Continuar
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-[#A7A7A7]/40 uppercase tracking-widest">
                                            Não tem conta?{" "}
                                            <Link href="/register" className="text-[#1DB954] hover:text-[#1ED760] transition-colors ml-2">
                                                Criar Conta
                                            </Link>
                                        </p>
                                    </div>
                                </motion.form>
                            )}

                            {/* ── SCREEN: password ─────────────────────────────── */}
                            {screen === "password" && (
                                <motion.form
                                    key="password-screen"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                    onSubmit={handleLogin}
                                    className="space-y-8"
                                >
                                    {/* Email pill */}
                                    <div className="flex items-center gap-3 px-6 py-4 rounded-[2rem] bg-[#1DB954]/5 border border-[#1DB954]/10">
                                        <div className="w-8 h-8 rounded-xl bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-4 h-4 text-[#1DB954]" />
                                        </div>
                                        <span className="text-xs font-black text-white/60 uppercase tracking-widest truncate">{email}</span>
                                        <button
                                            type="button"
                                            onClick={() => { setScreen("email"); setPassword(""); setError(null); setAttempts(0); }}
                                            className="ml-auto text-[9px] font-black text-[#A7A7A7] hover:text-[#1DB954] uppercase tracking-widest transition-colors"
                                        >
                                            Trocar
                                        </button>
                                    </div>

                                    <div className="space-y-4 group">
                                        <div className="flex justify-between items-center px-6">
                                            <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] group-focus-within:text-[#1DB954] transition-colors" htmlFor="password">
                                                Chave Criptográfica
                                            </label>
                                            <Link href={`/forgot-password?email=${encodeURIComponent(email)}`} className="text-[9px] font-black text-[#A7A7A7] hover:text-[#1DB954] transition-colors uppercase tracking-widest">
                                                Esqueceu a chave?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#A7A7A7]/30 group-focus-within:text-[#1DB954]/60 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                required
                                                autoFocus
                                                className="h-20 rounded-[2rem] bg-[#050505] border-[#1DB954]/20 font-black text-sm pl-20 pr-20 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 shadow-inner group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/5 hover:bg-[#1DB954]/10 flex items-center justify-center text-[#A7A7A7] hover:text-[#1DB954] transition-all border border-white/5 hover:border-[#1DB954]/20"
                                            >
                                                {showPassword
                                                    ? <EyeOff className="w-4 h-4" />
                                                    : <Eye className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || attempts >= 3}
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-white text-black hover:bg-[#1DB954] hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.03] active:scale-[0.97] border-none group"
                                    >
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
                                </motion.form>
                            )}

                            {/* ── SCREEN: pending ──────────────────────────────── */}
                            {screen === "pending" && (
                                <motion.div
                                    key="pending-screen"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                    className="space-y-8"
                                >
                                    <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex flex-col items-center gap-6 text-center">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                            <Clock className="w-7 h-7 text-amber-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">
                                                Aguardando Aprovação
                                            </p>
                                            <p className="text-xs font-black text-amber-400/50 uppercase tracking-wide leading-relaxed">
                                                Sua conta está em análise. Nossa equipe irá revisar e aprovar em breve.
                                            </p>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4">
                                                {email}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setScreen("email"); setError(null); }}
                                        className="w-full text-[10px] font-black text-[#A7A7A7] hover:text-white uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Usar outro e-mail
                                    </button>
                                </motion.div>
                            )}

                            {/* ── SCREEN: blocked ──────────────────────────────── */}
                            {screen === "blocked" && (
                                <motion.div
                                    key="blocked-screen"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                    className="space-y-8"
                                >
                                    <div className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex flex-col items-center gap-6 text-center">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                            <ShieldCheck className="w-7 h-7 text-rose-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">
                                                Acesso Restrito
                                            </p>
                                            <p className="text-xs font-black text-rose-500/50 uppercase tracking-wide leading-relaxed">
                                                Esta conta foi suspensa. Entre em contato com o suporte para mais informações.
                                            </p>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4">
                                                {email}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setScreen("email"); setError(null); }}
                                        className="w-full text-[10px] font-black text-[#A7A7A7] hover:text-white uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Usar outro e-mail
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Rodapé ─────────────────────────────────────────── */}
                        {screen === "email" && (
                            <></>
                        )}
                        {screen === "password" && (
                            <div className="mt-10 text-center">
                                <p className="text-[9px] font-black text-[#A7A7A7]/30 uppercase tracking-widest">
                                    Sessão criptografada · Pointify Systems
                                </p>
                            </div>
                        )}
                    </CardContent>
                </SpotlightCard>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black text-[#A7A7A7]/30 uppercase tracking-[0.5em]">
                        © 2026 POINTIFY SYSTEMS — ENCRYPTED SESSION
                    </p>
                </div>
            </div>
        </div>
    );
}
