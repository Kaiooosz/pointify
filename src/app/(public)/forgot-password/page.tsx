"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft, AlertCircle, RefreshCw,
    ShieldCheck, Zap, Mail, Lock, CheckCircle2,
    Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";
import { ThemeAndLanguageToggle } from "@/components/layout/theme-language-toggle";
import { checkEmailStatus } from "@/actions/auth-actions";
import { sendPasswordResetCode, resetPasswordAction } from "@/actions/password-reset-actions";

type Step = "verify-email" | "verify-code" | "new-password" | "success";

function ForgotPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<Step>("verify-email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await checkEmailStatus(email);
            if (!res.exists) {
                // Se não existe, vai para registro como solicitado
                router.push(`/register?email=${encodeURIComponent(email)}`);
                return;
            }

            const sendRes = await sendPasswordResetCode(email);
            if (sendRes.success) {
                setStep("verify-code");
            } else {
                setError(sendRes.error || "Falha ao enviar código.");
            }
        } catch {
            setError("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) return;
        setStep("new-password"); // Code will be verified along with the new password for security
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await resetPasswordAction(email, code, password);
            if (res.success) {
                setStep("success");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(res.error || "Falha ao redefinir chave.");
            }
        } catch {
            setError("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const slideVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#FFC107]/5 rounded-full blur-[180px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-[#FFC107]/10 rounded-full blur-[180px] animate-pulse duration-[10s]" />
            </div>

            <div className="absolute top-10 left-10 hidden md:block">
                <Link href="/login" className="flex items-center gap-3 text-[11px] font-black text-[#A7A7A7] hover:text-[#FFC107] transition-all group uppercase tracking-[0.3em]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFC107]/30 transition-all">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    Voltar ao Login
                </Link>
            </div>

            <div className="w-full max-w-[500px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="p-5 rounded-[2.5rem] bg-[#0F0F0F] border border-white/5 shadow-2xl mb-8 group hover:border-[#FFC107]/40 transition-all duration-700">
                        <Logo width={48} height={48} />
                    </div>
                </motion.div>

                <SpotlightCard className="border border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden bg-[#0F0F0F] p-2">
                    <CardHeader className="space-y-4 text-center pt-14 pb-8">
                        <div className="flex justify-center mb-2">
                            <span className="px-6 py-2 rounded-full bg-[#FFC107]/10 text-[#FFC107] text-[9px] font-black uppercase tracking-[0.4em] border border-[#FFC107]/20 shadow-[0_0_20px_rgba(255,193,7,0.1)]">
                                Security Flow
                            </span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                variants={slideVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                            >
                                <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                                    {step === "verify-email" && "Esqueceu a Chave?"}
                                    {step === "verify-code" && "Validar Identidade"}
                                    {step === "new-password" && "Nova Chave"}
                                    {step === "success" && "Pronto!"}
                                </CardTitle>
                                <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] opacity-60 mt-3 px-6">
                                    {step === "verify-email" && "Inicie o protocolo de recuperação Pointify"}
                                    {step === "verify-code" && `Código enviado para ${email.toLowerCase()}`}
                                    {step === "new-password" && "Defina seu novo acesso criptográfico"}
                                    {step === "success" && "Sua chave foi redefinida com sucesso"}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </CardHeader>

                    <CardContent className="px-8 md:px-12 pb-16 pt-4">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-4"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="space-y-1 pt-0.5">
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Alerta de Sistema</p>
                                        <p className="text-xs font-black text-amber-500/60 uppercase tracking-tight">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {step === "verify-email" && (
                                <motion.form
                                    key="step1"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onSubmit={handleVerifyEmail}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6">Identificador</label>
                                        <div className="relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#A7A7A7]/30 group-focus-within:text-[#FFC107]/60">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <Input
                                                placeholder="USUARIO@NETWORK.COM"
                                                type="email"
                                                required
                                                className="h-20 rounded-[2rem] bg-[#050505] border-[#FFC107]/20 font-black text-sm pl-20 pr-10 focus:border-[#FFC107]/60 text-white uppercase tracking-widest"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-white text-black hover:bg-[#FFC107] shadow-2xl transition-all"
                                    >
                                        {isLoading ? <RefreshCw className="animate-spin" /> : "Verificar e Enviar Código"}
                                    </Button>
                                </motion.form>
                            )}

                            {step === "verify-code" && (
                                <motion.form
                                    key="step2"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onSubmit={handleVerifyCode}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6">Código de 6 Dígitos</label>
                                        <Input
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                            className="h-20 rounded-[2rem] bg-[#050505] border-[#FFC107]/20 font-black text-center text-2xl text-[#FFC107] tracking-[1em] focus:border-[#FFC107]/60"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={code.length !== 6}
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-white text-black hover:bg-[#FFC107] transition-all"
                                    >
                                        Validar Código
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setStep("verify-email")}
                                        className="w-full text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Alterar identificador
                                    </button>
                                </motion.form>
                            )}

                            {step === "new-password" && (
                                <motion.form
                                    key="step3"
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onSubmit={handleResetPassword}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6">Nova Chave Mestra</label>
                                        <div className="relative">
                                            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#A7A7A7]/30 group-focus-within:text-[#FFC107]/60">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                required
                                                className="h-20 rounded-[2rem] bg-[#050505] border-[#FFC107]/20 font-black text-sm pl-20 pr-20 focus:border-[#FFC107]/60 text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A7A7A7] hover:text-[#FFC107]"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !password}
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#FFC107] text-black shadow-2xl transition-all"
                                    >
                                        {isLoading ? <RefreshCw className="animate-spin" /> : "Redefinir Acesso"}
                                    </Button>
                                </motion.form>
                            )}

                            {step === "success" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-8 py-4"
                                >
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-[#FFC107]/10 flex items-center justify-center border-2 border-[#FFC107]/30 shadow-[0_0_50px_rgba(255,193,7,0.2)]">
                                        <CheckCircle2 className="w-12 h-12 text-[#FFC107]" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4">Acesso Restaurado</p>
                                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                                            Redirecionando para o túnel de login em instantes...
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </SpotlightCard>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#FFC107] border-t-transparent animate-spin" />
            </div>
        }>
            <ForgotPasswordContent />
        </Suspense>
    );
}
