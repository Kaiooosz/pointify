"use server";

import prisma from "@/lib/prisma";
import { FEES } from "@/lib/fees";

type TransactionRow = Awaited<ReturnType<typeof prisma.transaction.findMany>>[number];
type UserStatusValue = "ACTIVE" | "BLOCKED" | "PENDING" | "ANALYSIS" | "TERMINATED";

// ─── Helpers ────────────────────────────────────────────────────────────────
async function logAdminAction(responsibleId: string, action: string, details: unknown, targetUserId?: string) {
    try {
        await prisma.adminLog.create({
            data: { responsibleId, action, details: JSON.stringify(details), targetUserId }
        });
    } catch (error) {
        console.error("Auditing failed:", error);
    }
}

function calcPlatformFee(grossAmount: number): number {
    const percentFee = grossAmount * (FEES.TRANSACTION.PERCENT / 100);
    return Math.max(percentFee, FEES.TRANSACTION.MIN_FLAT * 100); // armazenamos em centavos
}

// ─── ANALYTICS COMPLETO ──────────────────────────────────────────────────────
export async function getAdminStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

        const [
            totalUsers,
            newUsersToday,
            newUsersMonth,
            pendingKyc,
            allTx,
            txToday,
            txThisMonth,
            txLastMonth,
            swapTx,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: today } } }),
            prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.user.count({ where: { status: "PENDING" } }),
            prisma.transaction.findMany({ where: { status: "COMPLETED" } }),
            prisma.transaction.findMany({ where: { status: "COMPLETED", createdAt: { gte: today } } }),
            prisma.transaction.findMany({ where: { status: "COMPLETED", createdAt: { gte: startOfMonth } } }),
            prisma.transaction.findMany({ where: { status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
            // Simulando swaps — em produção virá de uma tabela dedicada
            prisma.transaction.findMany({ where: { status: "COMPLETED", method: "SWAP" } }),
        ]);

        // ── Volumes ──────────────────────────────────────────────────────────
        const totalVolume = allTx.reduce((acc: number, tx: TransactionRow) => acc + tx.grossAmount, 0);
        const totalSpread = allTx.reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);
        const volToday = txToday.reduce((acc: number, tx: TransactionRow) => acc + tx.grossAmount, 0);
        const spreadToday = txToday.reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);
        const volMonth = txThisMonth.reduce((acc: number, tx: TransactionRow) => acc + tx.grossAmount, 0);
        const spreadMonth = txThisMonth.reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);
        const volLastMonth = txLastMonth.reduce((acc: number, tx: TransactionRow) => acc + tx.grossAmount, 0);
        const spreadLastMonth = txLastMonth.reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);

        // ── Volume por método ────────────────────────────────────────────────
        const volumeByMethod = allTx.reduce((acc: Record<string, number>, tx: TransactionRow) => {
            const method = tx.method || "OTHER";
            acc[method] = (acc[method] || 0) + tx.grossAmount;
            return acc;
        }, {} as Record<string, number>);

        const spreadByMethod = allTx.reduce((acc: Record<string, number>, tx: TransactionRow) => {
            const method = tx.method || "OTHER";
            acc[method] = (acc[method] || 0) + tx.spread;
            return acc;
        }, {} as Record<string, number>);

        // ── Crescimento MoM ──────────────────────────────────────────────────
        const volGrowth = volLastMonth > 0
            ? ((volMonth - volLastMonth) / volLastMonth) * 100
            : 0;
        const spreadGrowth = spreadLastMonth > 0
            ? ((spreadMonth - spreadLastMonth) / spreadLastMonth) * 100
            : 0;

        // ── Simulação de taxas por tipo (mock até ter tabela swap) ────────────
        const feeFromTransactions = totalSpread; // já é o spread/taxa capturado
        const feeFromSwapsUSDT = swapTx
            .filter((tx: TransactionRow) => tx.method === "SWAP_USDT")
            .reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);
        const feeFromSwapsBTC = swapTx
            .filter((tx: TransactionRow) => tx.method === "SWAP_BTC")
            .reduce((acc: number, tx: TransactionRow) => acc + tx.spread, 0);

        return {
            success: true,
            stats: {
                // Usuários
                totalUsers,
                newUsersToday,
                newUsersMonth,
                pendingKyc,

                // Volume
                totalVolume,
                volToday,
                volMonth,
                volLastMonth,
                volGrowth,

                // Receita (spread/taxas)
                netRevenue: totalSpread,
                spreadToday,
                spreadMonth,
                spreadLastMonth,
                spreadGrowth,
                feeFromTransactions,
                feeFromSwapsUSDT,
                feeFromSwapsBTC,

                // Por método
                volumeByMethod,
                spreadByMethod,

                // Métricas
                txCount: allTx.length,
                txToday: txToday.length,
                txMonth: txThisMonth.length,
                ticketMedio: allTx.length > 0 ? totalVolume / allTx.length : 0,

                // Taxas vigentes (espelho do fees.ts)
                feeTable: {
                    transaction: `max(${FEES.TRANSACTION.PERCENT}%, R$ ${FEES.TRANSACTION.MIN_FLAT.toFixed(2)})`,
                    swapUsdt: `${FEES.SWAP_USDT.PERCENT}%`,
                    swapBtc: `${FEES.SWAP_BTC.PERCENT}%`,
                }
            }
        };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

// ─── USERS ───────────────────────────────────────────────────────────────────
export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { transactions: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function updateUserStatus(adminId: string, userId: string, status: UserStatusValue) {
    try {
        const user = await prisma.user.update({ where: { id: userId }, data: { status } });
        await logAdminAction(adminId, "UPDATE_USER_STATUS", { status }, userId);
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}

export async function updateUserLimits(adminId: string, userId: string, limits: { daily: number, monthly: number, perTx: number }) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { dailyLimit: limits.daily, monthlyLimit: limits.monthly, perTxLimit: limits.perTx }
        });
        await logAdminAction(adminId, "UPDATE_USER_LIMITS", limits, userId);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update limits" };
    }
}

export async function approveUserKyc(adminId: string, userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { kycStatus: "VERIFIED", status: "ACTIVE" }
        });
        await logAdminAction(adminId, "APPROVE_KYC", { method: "MANUAL" }, userId);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to approve" };
    }
}

export async function approveUser(adminId: string, userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: "ACTIVE" }
        });
        await logAdminAction(adminId, "APPROVE_USER", {}, userId);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to approve user" };
    }
}

export async function terminateUser(adminId: string, userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: "TERMINATED" }
        });
        await logAdminAction(adminId, "TERMINATE_USER", {}, userId);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to terminate user" };
    }
}

// ─── FINANCIAL LEDGER ────────────────────────────────────────────────────────
export async function getGlobalActivity(filters?: { method?: string; status?: string; search?: string }) {
    try {
        // Monta filtros de forma segura
        const where: Record<string, any> = {};

        if (filters?.method && filters.method !== "ALL") {
            where.method = filters.method;
        }
        if (filters?.status && filters.status !== "ALL") {
            where.status = filters.status;
        }
        // Busca por email sem mode insensitive (compatível com Neon/Postgres)
        if (filters?.search?.trim()) {
            where.user = {
                email: { contains: filters.search.trim().toLowerCase() }
            };
        }

        const transactions = await prisma.transaction.findMany({
            take: 100,
            orderBy: { createdAt: "desc" },
            where,
            include: { user: { select: { email: true, name: true } } }
        });
        return { success: true, transactions };
    } catch (error) {
        console.error("getGlobalActivity error:", error);
        return { success: false, error: "Failed to fetch activity" };
    }
}

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────
export async function getAdminLogs() {
    try {
        const logs = await prisma.adminLog.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: { responsible: { select: { name: true, email: true } } }
        });
        return { success: true, logs };
    } catch (error) {
        return { success: false, error: "Failed to fetch logs" };
    }
}

export async function updateSystemSetting(adminId: string, key: string, value: string) {
    try {
        await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
        await logAdminAction(adminId, "UPDATE_SETTING", { key, value });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to save setting" };
    }
}
