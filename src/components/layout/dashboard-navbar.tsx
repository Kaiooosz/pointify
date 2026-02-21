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
    ChevronDown,
    ArrowUpDown,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-bell";

import { useLanguage } from "@/components/providers/language-provider";
import { ThemeAndLanguageToggle } from "./theme-language-toggle";
import { Button } from "@/components/ui/button";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFullUserProfile } from "@/actions/user-actions";

const navItems = (t: (key: string) => string) => [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("receive"), href: "/dashboard/receive", icon: Download },
    { name: t("send"), href: "/dashboard/send", icon: Send },
    { name: t("swap"), href: "/dashboard/swap", icon: ArrowUpDown },
    { name: t("withdraw"), href: "/dashboard/withdraw", icon: ArrowUpRight },
    { name: t("pay_bills"), href: "/dashboard/pay", icon: FileIcon },
    { name: t("pix_keys"), href: "/dashboard/keys", icon: Key },
    { name: t("payment_links"), href: "/dashboard/links", icon: LinkIcon },
    { name: t("history"), href: "/dashboard/history", icon: ListFilter },
];

export function DashboardNavbar({ initialUser }: { initialUser?: any }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const items = navItems(t);
    const activeItem = items.find(item => item.href === pathname) || items[0];
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [userData, setUserData] = useState<any>(initialUser || null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getFullUserProfile();
            if (res.success) {
                setUserData(res.user);
            }
        };
        fetchUser();
    }, [pathname]);

    const initials = userData?.name
        ? userData.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
        : userData?.email?.substring(0, 2).toUpperCase() || initialUser?.name?.substring(0, 2).toUpperCase() || "??";

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[100] w-full bg-black/80 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-[1600px] mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-6">
                    {/* Logo & Category Selector */}
                    <div className="flex items-center gap-8">
                        <Logo className="h-8 w-auto hover:opacity-80 transition-opacity" />

                        {/* Tool Selector Dropdown */}
                        <div className="hidden md:block relative">
                            <Button
                                onClick={() => {
                                    setIsToolsOpen(!isToolsOpen);
                                    if (isProfileOpen) setIsProfileOpen(false);
                                }}
                                variant="outline"
                                className="h-10 px-6 rounded-full border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:border-white transition-all flex items-center gap-3 relative z-[120]"
                            >
                                <activeItem.icon className="w-4 h-4 text-white" />
                                {activeItem.name}
                                <ChevronDown className={cn("w-3 h-3 text-[#A7A7A7] transition-transform", isToolsOpen && "rotate-180")} />
                            </Button>

                            {/* Tool Dropdown Menu */}
                            <AnimatePresence>
                                {isToolsOpen && (
                                    <>
                                        {/* Overlay para fechar ao clicar fora */}
                                        <div
                                            className="fixed inset-0 z-[110] bg-transparent"
                                            onClick={() => setIsToolsOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-3 w-72 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[115] overflow-hidden"
                                        >
                                            <p className="px-5 py-4 text-[9px] font-black text-[#A7A7A7] uppercase tracking-[0.3em] border-b border-white/5 mb-3">Selecione uma Ferramenta</p>
                                            <div className="grid grid-cols-1 gap-1.5 max-h-[450px] overflow-y-auto no-scrollbar pr-1">
                                                {items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsToolsOpen(false)}
                                                        className={cn(
                                                            "flex items-center justify-between px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                            pathname === item.href
                                                                ? "bg-[#1DB954] text-black shadow-[0_10px_20px_rgba(29,185,84,0.1)]"
                                                                : "text-[#A7A7A7] hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="w-4.5 h-4.5" />
                                                            {item.name}
                                                        </div>
                                                        {pathname === item.href && <div className="w-1.5 h-1.5 rounded-full bg-black/40" />}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Fixed Actions: Market & Profile & Notif */}
                    <div className="flex items-center gap-2 md:gap-8 flex-shrink-0">
                        <div className="hidden xl:block">
                            <MarketTicker />
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 relative">
                            <div className="hidden md:block">
                                <ThemeAndLanguageToggle />
                            </div>
                            <NotificationBell />

                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    if (isToolsOpen) setIsToolsOpen(false);
                                }}
                                className="flex items-center gap-2 md:gap-4 ml-1 md:pl-6 md:border-l md:border-white/5 group relative outline-none z-[120]"
                            >
                                <div className="flex flex-col items-end hidden lg:flex">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{userData?.name || userData?.email?.split('@')[0] || "..."}</span>
                                    <span className="text-[8px] font-black text-[#1DB954] uppercase tracking-widest mt-1.5 px-2 py-0.5 bg-[#1DB954]/5 rounded-full border border-[#1DB954]/20">Status Gold</span>
                                </div>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-white text-[10px] font-black shadow-2xl group-hover:border-white transition-all overflow-hidden">
                                    {userData?.image ? (
                                        <img src={userData.image} alt={userData.name} className="w-full h-full object-cover" />
                                    ) : initials}
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        {/* Overlay para fechar ao clicar fora */}
                                        <div
                                            className="fixed inset-0 z-[110] bg-transparent"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-64 bg-[#0A0A0A] border border-white/5 rounded-3xl p-3 shadow-2xl z-[115]"
                                        >
                                            <div className="p-4 border-b border-white/5 mb-2">
                                                <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{userData?.name || userData?.email?.split('@')[0] || "..."}</p>
                                                <p className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest mt-1 truncate">{userData?.email || ""}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1">
                                                <Link
                                                    href="/dashboard/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                                                >
                                                    <activeItem.icon className="w-4 h-4" />
                                                    Ver Perfil
                                                </Link>
                                                <Link
                                                    href="/dashboard/settings"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                                                >
                                                    <Key className="w-4 h-4" />
                                                    Configurações
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        window.location.href = "/login"; // Fallback simple redirect or use next-auth signOut
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-[#A7A7A7] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all text-left"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                    Sair da Sessão
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Sub-nav: Horizontal Scroll (Optional/Quick) */}
                <div className="w-full bg-white/[0.02] border-t border-white/5 overflow-hidden">
                    <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar py-2.5 px-6">
                        <div className="flex items-center gap-1 min-w-max">
                            {items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border",
                                            isActive
                                                ? "bg-[#1DB954] text-black border-[#1DB954] shadow-[0_10px_30px_rgba(29,185,84,0.2)]"
                                                : "text-[#A7A7A7] hover:text-white hover:bg-white/5 border-transparent"
                                        )}
                                    >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
            {/* Spacer to prevent content overlapping due to fixed nav */}
            <div className="h-[120px]" />
        </>
    );
}
