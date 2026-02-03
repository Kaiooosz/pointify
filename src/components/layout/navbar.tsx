"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeAndLanguageToggle } from "./theme-language-toggle";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-white/5 py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                <Logo />

                <div className="hidden lg:flex items-center gap-10">
                    <Link href="#how-it-works" className="text-sm font-black text-emerald-600 dark:text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">
                        {t("how_it_works")}
                    </Link>
                    <Link href="#benefits" className="text-sm font-black text-emerald-600 dark:text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">
                        {t("benefits")}
                    </Link>
                    <Link href="#for-whom" className="text-sm font-black text-emerald-600 dark:text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">
                        {t("for_whom")}
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeAndLanguageToggle />
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="font-bold text-emerald-600 dark:text-white hover:bg-emerald-50 dark:hover:bg-white/5">{t("login")}</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="font-bold px-6 rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white border-none">{t("create_account")}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
