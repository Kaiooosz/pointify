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
        <div className="flex items-center gap-2 bg-[#121212] p-1 rounded-full border border-white/5 backdrop-blur-xl shadow-2xl">
            {/* Language Toggle */}
            <div className="flex gap-1">
                {(["pt", "en", "es"] as Language[]).map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`w-9 h-9 flex items-center justify-center text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${language === lang
                            ? "bg-[#1DB954] text-black shadow-[0_0_20px_rgba(29,185,84,0.3)] scale-105"
                            : "text-[#A7A7A7] hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>

    );
}
