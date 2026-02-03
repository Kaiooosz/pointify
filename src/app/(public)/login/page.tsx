"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // For demo, redirect to dashboard
            router.push("/dashboard");
        }, 1500);
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
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("welcome_back")}</CardTitle>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {t("login_desc")}
                        </p>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 pt-6">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    placeholder="seu@email.com"
                                    type="email"
                                    required
                                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="password">{t("password")}</label>
                                    <Link href="#" className="text-xs font-black text-emerald-600 hover:text-emerald-500 truncate">{t("forgot_password")}</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 font-bold pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {t("sign_in")}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                {t("no_account")}{" "}
                                <Link href="/register" className="text-emerald-600 font-black hover:text-emerald-500 underline underline-offset-4 decoration-2">
                                    {t("create_account")}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
