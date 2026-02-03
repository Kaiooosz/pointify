"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function RegisterPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert(t("passwords_dont_match"));
            return;
        }
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {t("back_to_home")}
                </Link>
            </div>

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-10">
                    <Logo width={48} height={48} />
                </div>

                <Card className="border border-slate-100 dark:border-white/10 shadow-2xl shadow-emerald-900/5 rounded-[2rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader className="space-y-2 text-center pt-10">
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("create_account")}</CardTitle>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4">
                            Junte-se ao futuro dos pagamentos baseados em pontos
                        </p>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 pt-6">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1" htmlFor="name">{t("full_name")}</label>
                                <Input
                                    id="name"
                                    placeholder={t("your_name")}
                                    required
                                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    placeholder="seu@email.com"
                                    type="email"
                                    required
                                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1" htmlFor="password">{t("password")}</label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1" htmlFor="confirmPassword">{t("confirm_password")}</label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
                                    {t("agree_terms")}
                                </p>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {t("create_account")}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                {t("already_have_account")}{" "}
                                <Link href="/login" className="text-emerald-600 font-black hover:text-emerald-500 underline underline-offset-4 decoration-2">
                                    {t("login")}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
