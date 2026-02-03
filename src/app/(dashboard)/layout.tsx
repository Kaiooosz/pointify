"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";

const locales = { pt: ptBR, en: enUS, es: es };

import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language } = useLanguage();

    const formattedDate = format(new Date(), "PP", { locale: locales[language] });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row">
            <Sidebar isAdmin={true} /> {/* Demo: always show admin if we want to explore */}

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 p-4 flex items-center justify-between z-50">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="dark:text-white">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-xs">P</div>
                    <span className="font-black dark:text-white tracking-tight">Pointify</span>
                </div>
                <Button variant="ghost" size="icon" className="dark:text-white relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 min-h-screen flex flex-col bg-[#FCFCFD] dark:bg-slate-950 overflow-x-hidden">
                {/* Desktop Header */}
                <header className="hidden md:flex sticky top-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md px-10 py-8 items-center justify-between z-30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t("dashboard")}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("operational_system")} • {formattedDate.toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Button variant="outline" size="icon" className="rounded-2xl border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-transform hover:scale-105 active:scale-95">
                            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </Button>
                        <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-white/5">
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 dark:text-white">Kai Otsunokawa</p>
                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{t("premium_user")}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-white dark:border-white/5 shadow-md flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">
                                KO
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-5 md:p-10">
                    {children}
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-slate-950 z-[70] md:hidden shadow-2xl"
                        >
                            <Sidebar mobile isAdmin={true} />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 right-[-50px] w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                            >
                                <X className="w-5 h-5 dark:text-white" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
