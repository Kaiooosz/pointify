"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/components/ui/button";
import {
    Home,
    Send,
    Download,
    History,
    Settings,
    User,
    ShieldCheck,
    LogOut,
    ChevronRight,
    LayoutDashboard
} from "lucide-react";

import { ThemeAndLanguageToggle } from "./theme-language-toggle";
import { useLanguage } from "@/components/providers/language-provider";

const menuItems = [
    { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "send", href: "/dashboard/send", icon: Send },
    { name: "receive", href: "/dashboard/receive", icon: Download },
    { name: "history", href: "/dashboard/history", icon: History },
    { name: "settings", href: "/dashboard/settings", icon: Settings },
    { name: "profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar({ isAdmin = false, mobile = false }: { isAdmin?: boolean, mobile?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <aside className={cn(
            "flex-col bg-slate-950 border-r border-white/5 z-40 transition-all duration-300 dark",
            mobile
                ? "flex w-full h-full"
                : "fixed left-0 top-0 bottom-0 w-64 hidden md:flex"
        )}>
            <div className="p-8">
                <Logo className="brightness-110" />
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
                                {t(item.name)}
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <div className="pt-10 pb-2">
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t("administration")}</p>
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                                pathname.startsWith("/admin")
                                    ? "bg-sky-500/10 text-sky-400"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <ShieldCheck className="w-5 h-5 transition-colors" />
                            {t("admin_panel")}
                        </Link>
                    </div>
                )}
            </nav>

            <div className="p-6 space-y-6 border-t border-white/5">
                <ThemeAndLanguageToggle />

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20">
                        K
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Kai Otsunokawa</p>
                        <p className="text-[10px] text-slate-500 truncate">{t("managing_director")}</p>
                    </div>
                </div>

                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                    {t("logout")}
                </Link>
            </div>
        </aside>
    );
}
