"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw, Zap, User, Mail, Smartphone, Instagram, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { registerUserAction } from "@/actions/register-actions";
import { sendVerificationCode, verifyCode } from "@/actions/verification-actions";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";
import { ThemeAndLanguageToggle } from "@/components/layout/theme-language-toggle";

function RegisterPageContent() {
    const { t } = useLanguage();
    const router = useRouter();

    const searchParams = useSearchParams();
    const [step, setStep] = useState(1); // 1: Name/Phone, 2: Email, 3: Code, 4: Social/Password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        instagram: "",
        code: "",
        password: "",
        confirmPassword: ""
    });

    // Pré-preencher email se vier do fluxo de login
    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
            setStep(2); // Já tem o email, pular para step 2
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null);
    };

    // Step 1: Name & Phone
    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!formData.name || !formData.phone) {
            setError(t("reg_error_fields"));
            return;
        }
        setStep(2);
    };

    // Step 2: Send Verification Code
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await sendVerificationCode(formData.email);
            if (res.success) {
                setSuccessMessage(t("reg_success_code_sent"));
                setStep(3);
            } else {
                setError(res.error || t("send_code_error"));
            }
        } catch (err) {
            setError(t("connection_error"));
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Verify Code
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await verifyCode(formData.email, formData.code);
            if (res.success) {
                setSuccessMessage(t("reg_success_verified"));
                setTimeout(() => {
                    setSuccessMessage(null);
                    setStep(4);
                }, 1000);
            } else {
                setError(res.error || t("reg_error_code_invalid"));
            }
        } catch (err) {
            setError(t("verification_failed") || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4: Complete Registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError(t("reg_error_pass_match"));
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("instagram", formData.instagram);
        data.append("password", formData.password);

        try {
            const res = await registerUserAction(data);
            if (res.success) {
                router.push("/login?pending_approval=true");
            } else {
                setError(res.error || t("create_account_error"));
            }
        } catch (err) {
            setError(t("connection_error"));
        } finally {
            setIsLoading(false);
        }
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

            <div className="absolute top-10 right-10 z-50 hidden md:block">
                <ThemeAndLanguageToggle />
            </div>

            <div className="w-full max-w-[640px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="p-4 rounded-[2rem] bg-[#0F0F0F] border border-white/5 shadow-2xl group hover:border-[#1DB954]/40 transition-all duration-700">
                        <Logo width={40} height={40} />
                    </div>
                </motion.div>

                <SpotlightCard className="border border-white/5 shadow-2xl rounded-[3.5rem] overflow-hidden bg-[#0F0F0F] p-2">
                    <CardHeader className="space-y-4 text-center pt-14 pb-8 px-10">
                        <div className="flex justify-center mb-2">
                            <span className="px-6 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] font-black uppercase tracking-[0.4em] border border-[#1DB954]/20">
                                {t("step_indicator").replace("{current}", step.toString()).replace("{total}", "4")}
                            </span>
                        </div>
                        <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                            {step === 1 && t("reg_step1_label")}
                            {step === 2 && t("reg_step2_label")}
                            {step === 3 && t("reg_step3_label")}
                            {step === 4 && t("reg_step4_label")}
                        </CardTitle>
                        <p className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.4em] opacity-60">
                            {t("reg_protocol_subtitle")}
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
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">{t("reg_alert_title")}</p>
                                        <p className="text-xs font-black text-rose-500/60 uppercase tracking-tight">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-10 p-8 rounded-[2.5rem] bg-[#1DB954]/5 border border-[#1DB954]/10 flex items-start gap-5 shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest leading-none">{t("reg_success_title")}</p>
                                        <p className="text-xs font-black text-[#1DB954]/60 uppercase tracking-tight">{successMessage}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {step === 1 && (
                            <form onSubmit={handleStep1} className="space-y-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="name">{t("reg_name_label")}</label>
                                    <div className="relative">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#A7A7A7]/40 group-focus-within:text-[#1DB954] transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="name"
                                            placeholder={t("reg_name_ph")}
                                            required
                                            className="h-16 pl-20 pr-6 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="phone">{t("reg_phone_label")}</label>
                                    <div className="relative">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#A7A7A7]/40 group-focus-within:text-[#1DB954] transition-colors">
                                            <Smartphone className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="phone"
                                            placeholder={t("reg_phone_ph")}
                                            type="tel"
                                            required
                                            className="h-16 pl-20 pr-6 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
                                >
                                    <div className="flex items-center gap-3">
                                        {t("continue")}
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSendCode} className="space-y-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="email">{t("reg_email_label")}</label>
                                    <div className="relative">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#A7A7A7]/40 group-focus-within:text-[#1DB954] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="email"
                                            placeholder={t("reg_email_ph")}
                                            type="email"
                                            required
                                            className="h-16 pl-24 pr-10 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                {t("reg_btn_sending")}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Send className="w-5 h-5 fill-current" />
                                                {t("reg_btn_send")}
                                            </div>
                                        )}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-[10px] font-black text-[#A7A7A7] hover:text-white uppercase tracking-widest py-4 transition-colors"
                                    >
                                        {t("back")}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleVerifyCode} className="space-y-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="code">{t("reg_code_label")}</label>
                                    <div className="relative">
                                        <Input
                                            id="code"
                                            placeholder={t("reg_code_ph")}
                                            maxLength={6}
                                            required
                                            className="h-16 text-center text-2xl tracking-[0.5em] rounded-[2rem] bg-[#050505] border-white/5 font-black focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.code}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <p className="text-center text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest px-6">
                                        {t("reg_sent_to")} <span className="text-white">{formData.email}</span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                {t("reg_btn_verifying")}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5" />
                                                {t("reg_btn_verify")}
                                            </div>
                                        )}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="text-[10px] font-black text-[#A7A7A7] hover:text-white uppercase tracking-widest py-4 transition-colors"
                                    >
                                        {t("reg_change_email")}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 4 && (
                            <form onSubmit={handleRegister} className="space-y-8">
                                <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="instagram">{t("reg_instagram_label")}</label>
                                    <div className="relative">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#A7A7A7]/40 group-focus-within:text-[#1DB954] transition-colors">
                                            <Instagram className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="instagram"
                                            placeholder={t("reg_instagram_ph")}
                                            required
                                            className="h-16 pl-20 pr-6 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 uppercase tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="password">{t("reg_pass_label")}</label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={t("reg_pass_ph")}
                                            required
                                            className="h-16 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs px-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] px-6" htmlFor="confirmPassword">{t("reg_confirm_pass_label")}</label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder={t("reg_confirm_pass_ph")}
                                            required
                                            className="h-16 rounded-[2rem] bg-[#050505] border-white/5 font-black text-xs px-10 focus:border-[#1DB954] focus:ring-[#1DB954]/20 transition-all text-white placeholder:text-[#A7A7A7]/10 tracking-widest group-hover:border-[#1DB954]/50 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#050505_inset] [&:-webkit-autofill]:-webkit-text-fill-color:white"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] bg-[#1DB954] text-black hover:bg-[#1ED760] shadow-[0_20px_40px_rgba(29,185,84,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            {t("reg_btn_creating")}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 fill-current" />
                                            {t("reg_btn_create")}
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}

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

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin" />
            </div>
        }>
            <RegisterPageContent />
        </Suspense>
    );
}
