"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getUserNotifications,
    markNotificationsRead,
    NOTIF_META,
} from "@/actions/notification-actions";

type Notif = {
    id: string;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    refId?: string | null;
    createdAt: Date | string;
};

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unread = notifs.filter(n => !n.isRead).length;

    const load = async () => {
        setLoading(true);
        const res = await getUserNotifications();
        if (res.success) setNotifs(res.notifications as Notif[]);
        setLoading(false);
    };

    const handleOpen = () => {
        setOpen(v => !v);
        if (!open) load();
    };

    const handleMarkAll = async () => {
        const ids = notifs.filter(n => !n.isRead).map(n => n.id);
        if (!ids.length) return;
        await markNotificationsRead(ids);
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // Fecha ao clicar fora
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Polling leve (30s)
    useEffect(() => {
        load();
        const id = setInterval(load, 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={handleOpen}
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#A7A7A7] hover:text-white hover:bg-white/5 transition-all"
                aria-label="Notificações"
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#1DB954] text-black text-[8px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(29,185,84,0.6)]"
                    >
                        {unread > 9 ? "9+" : unread}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="notif-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-80 max-h-[480px] overflow-y-auto rounded-[2rem] bg-[#111] border border-white/10 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sticky top-0 bg-[#111] z-10">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                Notificações {unread > 0 && <span className="text-[#1DB954]">· {unread} nova{unread > 1 ? "s" : ""}</span>}
                            </p>
                            <div className="flex items-center gap-2">
                                {unread > 0 && (
                                    <button onClick={handleMarkAll}
                                        className="text-[9px] font-black text-[#1DB954] uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Marcar todas
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)} className="text-[#A7A7A7] hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Lista */}
                        {loading && notifs.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 rounded-full border-2 border-[#1DB954]/30 border-t-[#1DB954] animate-spin" />
                            </div>
                        ) : notifs.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <Bell className="w-8 h-8 text-[#A7A7A7]/20 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-[#A7A7A7]/40 uppercase tracking-widest">Sem notificações</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-white/[0.03]">
                                {notifs.map(n => {
                                    const meta = NOTIF_META[n.type] ?? { color: "#A7A7A7", emoji: "🔔" };
                                    return (
                                        <div key={n.id}
                                            className={`flex items-start gap-3 px-5 py-4 transition-colors ${!n.isRead ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}>
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                                                style={{ backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                                                {meta.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-white leading-tight">{n.title}</p>
                                                <p className="text-[9px] font-black text-[#A7A7A7]/60 mt-0.5 leading-relaxed">{n.body}</p>
                                                <p className="text-[8px] font-black text-[#A7A7A7]/30 mt-1 uppercase tracking-widest">
                                                    {new Date(n.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 shadow-[0_0_6px_rgba(29,185,84,0.6)]"
                                                    style={{ backgroundColor: meta.color }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
