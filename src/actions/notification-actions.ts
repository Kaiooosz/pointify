"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

import { NotifType } from "@/lib/notifications";

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

