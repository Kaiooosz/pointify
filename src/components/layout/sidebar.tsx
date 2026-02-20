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
    LayoutDashboard,
    ArrowUpDown
} from "lucide-react";

import { ThemeAndLanguageToggle } from "./theme-language-toggle";
import { useLanguage } from "@/components/providers/language-provider";

const customerItems = [
    { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "send", href: "/dashboard/send", icon: Send },
    { name: "receive", href: "/dashboard/receive", icon: Download },
    { name: "swap", href: "/dashboard/swap", icon: ArrowUpDown },
    { name: "history", href: "/dashboard/history", icon: History },
    { name: "settings", href: "/dashboard/settings", icon: Settings },
    { name: "profile", href: "/dashboard/profile", icon: User },
];

const adminItems = [
    { name: "backoffice", href: "/admin", icon: ShieldCheck },
    { name: "users", href: "/admin", icon: Home },
    { name: "finances", href: "/admin", icon: LayoutDashboard },
];

export function Sidebar({ isAdmin = false, mobile = false }: { isAdmin?: boolean, mobile?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const menuItems = isAdmin ? adminItems : customerItems;

    return (
        <aside className={cn(
            "flex-col bg-[#0B0B0B] border-r border-white/5 z-40 transition-all duration-300",
            mobile
                ? "flex w-full h-full"
                : "fixed left-0 top-0 bottom-0 w-64 hidden md:flex"
        )}>
            <div className="p-8">
                <Logo className="brightness-110" />
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                <p className="px-4 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] mb-4">
                    {isAdmin ? t("operational_system_label") : t("main_menu_label")}
                </p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href + item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group",
                                isActive
                                    ? "bg-[#1DB954]/10 text-[#1DB954]"
                                    : "text-[#A7A7A7] hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-[#1DB954]" : "text-[#A7A7A7] group-hover:text-white")} />
                                {t(item.name)}
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 space-y-6 border-t border-white/5">
                <ThemeAndLanguageToggle />

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-[#1DB954] flex items-center justify-center text-black font-black text-xs shadow-lg">
                        {isAdmin ? "A" : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{isAdmin ? t("admin_root") : t("pointify_user")}</p>
                        <p className="text-[8px] text-[#A7A7A7] truncate font-black uppercase tracking-widest">{isAdmin ? t("total_control") : t("active_status")}</p>
                    </div>
                </div>

                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#A7A7A7] hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all group uppercase tracking-widest">
                    <LogOut className="w-4 h-4 text-[#A7A7A7] group-hover:text-rose-500" />
                    {t("logout_label")}
                </Link>
            </div>
        </aside>
    );
}
