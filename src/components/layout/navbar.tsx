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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 dark:bg-[#0B0B0B]/95 backdrop-blur-xl shadow-2xl border-b border-slate-100 dark:border-white/5 py-4" : "bg-transparent py-8"
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                <Logo />

                <div className="hidden lg:flex items-center gap-12">
                    <Link href="#how-it-works" className="text-[11px] font-black text-slate-500 dark:text-[#C0C0C0] hover:text-[#00FFCC] dark:hover:text-[#00FFCC] transition-all uppercase tracking-[0.2em]">
                        {t("how_it_works")}
                    </Link>
                    <Link href="#benefits" className="text-[11px] font-black text-slate-500 dark:text-[#C0C0C0] hover:text-[#00FFCC] dark:hover:text-[#00FFCC] transition-all uppercase tracking-[0.2em]">
                        {t("benefits")}
                    </Link>
                    <Link href="#for-whom" className="text-[11px] font-black text-slate-500 dark:text-[#C0C0C0] hover:text-[#00FFCC] dark:hover:text-[#00FFCC] transition-all uppercase tracking-[0.2em]">
                        {t("for_whom")}
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <ThemeAndLanguageToggle />
                    <div className="hidden sm:flex items-center gap-6">
                        <Link href="/login">
                            <Button variant="ghost" className="font-black uppercase text-[11px] tracking-widest text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 px-6 rounded-2xl">
                                {t("login")}
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="font-black uppercase text-[11px] tracking-widest px-8 h-12 rounded-2xl bg-[#1DB954] hover:bg-[#1ED760] text-black shadow-xl shadow-[#1DB954]/20 transition-all hover:scale-105 active:scale-95">
                                {t("create_account")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

