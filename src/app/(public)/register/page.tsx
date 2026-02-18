"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw, Zap, User } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { registerUserAction } from "@/actions/register-actions";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";

export default function RegisterPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);

        try {
            const res = await registerUserAction(data);
            if (res.success) {
                // Instead of redirecting, we can show a success state or redirect to a specific 'pending approval' page.
                // Or simply redirect to login with a specific query param that shows a specific toast/alert.
                // The user asked for "aguarde alguns minutos vamos aprovar a sua conta"
                // Let's redirect to login with a new param 'pending_approval=true' and handle it there.
                router.push("/login?pending_approval=true");
            } else {
                setError(res.error || "Erro ao criar conta.");
            }
        } catch (err) {
            setError("Falha na conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-6 py-20 relative overflow-hidden">
            {/* Background dynamic elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-[#1DB954]/10 rounded-full blur-[180px] animate-pulse duration-[10s]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-[#1DB954]/5 rounded-full blur-[180px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
            </div>

            <div className="absolute top-10 left-10 hidden md:block">
                <Link href="/" className="flex items-center gap-3 text-[11px] font-black text-[#A7A7A7] hover:text-[#1DB954] transition-all group uppercase tracking-[0.3em]">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#1DB954]/30 transition-all">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    {t("back_to_home")}
                </Link>
            </div>

            <div className="w-full max-w-[640px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="p-4 rounded-[2rem] bg-[#121212] border border-white/5 shadow-2xl group hover:border-[#1DB954]/40 transition-all duration-700">
                        <Logo width={40} height={40} />
                    </div>
                </motion.div>

                <SpotlightCard className="border border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden bg-[#121212] p-2">
                    <CardHeader className="space-y-4 text-center pt-14 pb-8 px-10">
                        <div className="flex justify-center mb-2">
                            <span className="px-6 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] font-black uppercase tracking-[0.4em] border border-[#1DB954]/20">
                                Digital Onboarding
                            </span>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">{t("create_account")}</CardTitle>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] opacity-60">
                            Protocolo de Acesso Pointify Network
                        </p>
                    </CardHeader>

                    <CardContent className="px-8 md:px-14 pb-16 pt-4">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-10 p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex items-start gap-5 shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Falha no Registro</p>
                                        <p className="text-xs font-black text-rose-500/60 uppercase tracking-tight">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleRegister} className="space-y-8">
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="name">Nome Completo</label>
                                <div className="relative">
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#A7A7A7]/40 group-focus-within:text-[#1DB954] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        placeholder="EX: KAI OTSUNOKAWA"
                                        required
                                        className="h-16 pl-20 pr-6 rounded-[2rem] bg-[#181818] border-white/5 font-black text-xs focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="email">Identificador Principal (Email)</label>
                                <Input
                                    id="email"
                                    placeholder="SEU@EMAIL.COM"
                                    type="email"
                                    required
                                    className="h-16 rounded-[2rem] bg-[#181818] border-white/5 font-black text-xs px-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="password">{t("password")}</label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-16 rounded-[2rem] bg-[#181818] border-white/5 font-black text-xs px-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 tracking-widest group-hover:border-[#1DB954]/50"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="confirmPassword">Confirmar Chave</label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-16 rounded-[2rem] bg-[#181818] border-white/5 font-black text-xs px-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 tracking-widest group-hover:border-[#1DB954]/50"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-[#1DB954]/5 p-8 rounded-[2.5rem] border border-[#1DB954]/10">
                                <ShieldCheck className="w-6 h-6 text-[#1DB954] mt-0.5 flex-shrink-0" />
                                <p className="text-[9px] font-black text-[#A7A7A7] leading-relaxed uppercase tracking-[0.2em] opacity-60">
                                    Ao protocolar este registro, você assume total responsabilidade pelas operações e concorda com as diretrizes de compliance da Pointify Global.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Criando Protocolo...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 fill-current" />
                                        Criar Identidade Pointify
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-14 text-center border-t border-white/5 pt-12">
                            <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest">
                                {t("already_have_account")}{" "}
                                <Link href="/login" className="text-[#1DB954] font-black hover:text-[#1ED760] transition-colors underline underline-offset-[12px] decoration-2 ml-3">
                                    {t("login")}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </SpotlightCard>
            </div>
        </div>
    );
}
