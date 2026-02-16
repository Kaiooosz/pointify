"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
    Home,
    Download,
    Send,
    FileText as FileIcon,
    Key,
    Link as LinkIcon,
    ListFilter,
    Users,
    Terminal,
    Bell,
    Moon,
    User,
    Settings,
    ChevronDown
} from "lucide-react";
import { cn } from "@/components/ui/button";

import { useLanguage } from "@/components/providers/language-provider";
import { ThemeAndLanguageToggle } from "./theme-language-toggle";
import { Button } from "@/components/ui/button";

const navItems = (t: (key: string) => string) => [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("receive"), href: "/dashboard/receive", icon: Download },
    { name: t("send"), href: "/dashboard/send", icon: Send },
    { name: t("pay_bills"), href: "/dashboard/pay", icon: FileIcon },
    { name: t("pix_keys"), href: "/dashboard/keys", icon: Key },
    { name: t("payment_links"), href: "/dashboard/links", icon: LinkIcon },
    { name: t("history"), href: "/dashboard/history", icon: ListFilter },
];

export function DashboardNavbar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const items = navItems(t);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 h-20">
            <div className="max-w-[1600px] mx-auto h-full px-8 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-10">
                    <Logo className="h-8 w-auto" />

                    {/* Navigation Items */}
                    <div className="hidden xl:flex items-center gap-2">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        isActive
                                            ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 shadow-[0_10px_30px_rgba(29,185,84,0.1)]"
                                            : "text-slate-500 hover:text-slate-900 dark:text-[#A7A7A7] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#1DB954]" : "text-slate-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <ThemeAndLanguageToggle />

                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <Link href="/dashboard/profile">
                        <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-white/5 ml-2">
                            <div className="w-11 h-11 rounded-full bg-[#181818] flex items-center justify-center text-[#1DB954] text-xs font-black shadow-xl border border-white/5 cursor-pointer hover:border-[#1DB954]/40 transition-all">
                                KS
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Nav Scroll (Optional) */}
            <div className="xl:hidden flex overflow-x-auto no-scrollbar gap-2 px-6 py-3 border-t border-slate-50 dark:border-white/5 bg-white/90 dark:bg-[#0B0B0B]/90 backdrop-blur-md">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                                isActive
                                    ? "bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20"
                                    : "text-slate-500 dark:text-[#A7A7A7] shadow-sm border border-slate-50 dark:border-white/5"
                            )}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </nav>


    );
}
