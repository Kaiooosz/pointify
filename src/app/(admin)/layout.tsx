"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Bell, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar isAdmin={true} />

            <main className="md:pl-64 min-h-screen flex flex-col">
                {/* Admin Header */}
                <header className="sticky top-0 bg-slate-900 text-white p-6 flex items-center justify-between z-30 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                                ADMIN PANEL <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded uppercase">Restricted</span>
                            </h2>
                            <p className="text-[10px] text-sky-400 font-mono">SYSTEM_VERSION: 1.0.0-MVP</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <Cpu className="w-3 h-3 animate-pulse" />
                            STATUS: OPTIMAL
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
                            <Bell className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
