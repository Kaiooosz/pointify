"use server";

import prisma from "@/lib/prisma";
import { UserRole, UserStatus, KycStatus, TransactionType } from "../../prisma/generated-client";

// --- AUDIT LOGGING ---
async function logAdminAction(responsibleId: string, action: string, details: any, targetUserId?: string) {
    try {
        await prisma.adminLog.create({
            data: {
                responsibleId,
                action,
                details: JSON.stringify(details),
                targetUserId
            }
        });
    } catch (error) {
        console.error("Auditing failed:", error);
    }
}

// --- DASHBOARD ANALYTICS ---
export async function getAdminStats() {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalUsers,
            activeUsers24h,
            allTx,
            merchantTx,
            pendingKyc
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { updatedAt: { gte: new Date(Date.now() - 86400000) } } }),
            prisma.transaction.findMany({ where: { status: "COMPLETED" } }),
            prisma.transaction.findMany({ where: { type: "MERCHANT_PAYMENT", status: "COMPLETED" } }),
            prisma.user.count({ where: { kycStatus: "PENDING" } })
        ]);

        const totalVolume = allTx.reduce((acc, tx) => acc + tx.grossAmount, 0);
        const totalSpread = allTx.reduce((acc, tx) => acc + tx.spread, 0);

        // Temporal Segmentation
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const txToday = allTx.filter(tx => tx.createdAt >= today);
        const volToday = txToday.reduce((acc, tx) => acc + tx.grossAmount, 0);
        const spreadToday = txToday.reduce((acc, tx) => acc + tx.spread, 0);

        // Volume by Method
        const volumeByMethod = allTx.reduce((acc: any, tx) => {
            const method = tx.method || "OTHER";
            acc[method] = (acc[method] || 0) + tx.grossAmount;
            return acc;
        }, {});

        return {
            success: true,
            stats: {
                totalUsers,
                activeUsers24h,
                totalVolume,
                volToday,
                spreadToday,
                grossRevenue: totalVolume,
                netRevenue: totalSpread,
                pendingKyc,
                volumeByMethod,
                txCount: allTx.length,
                ticketMedio: allTx.length > 0 ? totalVolume / allTx.length : 0
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch stats" };
    }
}

// --- USER MANAGEMENT ---
export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: { select: { transactions: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function updateUserStatus(adminId: string, userId: string, status: UserStatus) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status }
        });
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
            data: {
                dailyLimit: limits.daily,
                monthlyLimit: limits.monthly,
                perTxLimit: limits.perTx
            }
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

// --- FINANCIAL CONTROL ---
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

export async function getGlobalActivity() {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, name: true } } }
        });
        return { success: true, transactions };
    } catch (error) {
        return { success: false, error: "Failed to fetch activity" };
    }
}

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
