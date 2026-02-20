"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─── Tipos de notificação ─────────────────────────────────────────────────────
export type NotifType =
    | "TRANSFER_IN" | "TRANSFER_OUT"
    | "DEPOSIT" | "SWAP" | "WITHDRAW"
    | "KYC_APPROVED" | "KYC_REJECTED"
    | "SYSTEM" | "NEW_USER" | "ADMIN_ACTION";

// ─── Criar notificação (chamado internamente pelas actions) ───────────────────
export async function createNotification({
    userId,
    type,
    title,
    body,
    refId,
}: {
    userId?: string | null;        // null = evento global (admins veem)
    type: NotifType;
    title: string;
    body: string;
    refId?: string;
}) {
    try {
        await prisma.notification.create({
            data: { userId: userId ?? null, type, title, body, refId },
        });
    } catch (e) {
        // não quebra o fluxo principal
        console.error("createNotification error:", e);
    }
}

// ─── Buscar notificações do usuário logado ────────────────────────────────────
export async function getUserNotifications() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, notifications: [] };

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 40,
    });
    return { success: true, notifications };
}

// ─── Buscar TODAS as notificações (admin) ─────────────────────────────────────
// Admin vê: globais (userId null) + eventos de qualquer usuário
export async function getAdminNotifications() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 60,
        include: { user: { select: { email: true, name: true } } },
    });
    return { success: true, notifications };
}

// ─── Marcar como lida ─────────────────────────────────────────────────────────
export async function markNotificationsRead(ids: string[]) {
    await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
    });
    return { success: true };
}

// ─── Contagem de não lidas (usuário) ──────────────────────────────────────────
export async function getUnreadCount() {
    const session = await auth();
    if (!session?.user?.id) return { count: 0 };
    const count = await prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
    });
    return { count };
}

// ─── Contagem de não lidas (admin — todas) ────────────────────────────────────
export async function getAdminUnreadCount() {
    const count = await prisma.notification.count({ where: { isRead: false } });
    return { count };
}

// ─── Helpers de ícone/cor por tipo ───────────────────────────────────────────
export const NOTIF_META: Record<string, { color: string; emoji: string }> = {
    TRANSFER_IN: { color: "#1DB954", emoji: "⬇️" },
    TRANSFER_OUT: { color: "#A7A7A7", emoji: "⬆️" },
    DEPOSIT: { color: "#1DB954", emoji: "💰" },
    SWAP: { color: "#26A17B", emoji: "🔄" },
    WITHDRAW: { color: "#F7931A", emoji: "📤" },
    KYC_APPROVED: { color: "#1DB954", emoji: "✅" },
    KYC_REJECTED: { color: "#EF4444", emoji: "❌" },
    SYSTEM: { color: "#60A5FA", emoji: "🔔" },
    NEW_USER: { color: "#60A5FA", emoji: "👤" },
    ADMIN_ACTION: { color: "#F59E0B", emoji: "⚡" },
};
