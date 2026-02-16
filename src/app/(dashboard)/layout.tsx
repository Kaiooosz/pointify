"use client";

import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { useLanguage } from "@/components/providers/language-provider";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";

const locales = { pt: ptBR, en: enUS, es: es };

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#0B0B0B] transition-colors duration-500">
            <DashboardNavbar />

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] overflow-x-hidden">
                <div className="flex-1 p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>


    );
}
