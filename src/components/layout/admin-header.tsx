"use client";

import { Bell, Cpu, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface AdminHeaderProps {
    userEmail?: string | null;
    userName?: string | null;
}

export function AdminHeader({ userEmail, userName }: AdminHeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 bg-[#0B0B0B]/80 backdrop-blur-xl p-8 flex items-center justify-between z-30 border-b border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                    <Terminal className="w-6 h-6 text-[#1DB954]" />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black tracking-tighter uppercase">{t("backoffice")} Infrastructure</h1>
                        <span className="px-2.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-rose-500/20">Alpha Access</span>
                    </div>
                    <p className="text-[10px] text-[#A7A7A7] font-black uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                        <Lock className="w-3 h-3 text-[#1DB954]" /> {t("session_secure")}: {userEmail}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden xl:flex items-center gap-2 text-[9px] font-black text-[#1DB954] bg-[#1DB954]/5 px-4 py-2 rounded-full border border-[#1DB954]/10 shadow-inner">
                    <Cpu className="w-3.5 h-3.5 animate-pulse" />
                    CORE_STATUS: {t("operational_stable")}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="group w-12 h-12 rounded-full bg-white/5 border border-white/5 hover:bg-white/10">
                        <Bell className="w-5 h-5 text-[#A7A7A7] group-hover:text-white transition-colors" />
                    </Button>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1DB954] to-[#1ED760] p-[2px] cursor-pointer hover:scale-110 transition-all duration-500">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-black text-xs text-white">
                            {userName?.[0] || 'A'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
