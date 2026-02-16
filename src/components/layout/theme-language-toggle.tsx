"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, Language } from "@/components/providers/language-provider";
import { useEffect, useState } from "react";

export function ThemeAndLanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/10 backdrop-blur-md shadow-inner">
            {/* Language Toggle */}
            <div className="flex gap-1">
                {(["pt", "en", "es"] as Language[]).map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`w-8 h-8 flex items-center justify-center text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter ${language === lang
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                            }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>

    );
}
