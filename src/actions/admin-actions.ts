"use server";

import prisma from "@/lib/prisma";

export async function getAdminStats() {
    try {
        const totalUsers = await prisma.user.count();
        const activeUsersLast24h = await prisma.user.count({
            where: {
                updatedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });

        const completedTransactions = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                status: "COMPLETED"
            }
        });

        const inflow = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                type: "PIX_DEPOSIT",
                status: "COMPLETED"
            }
        });

        const outflow = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                type: "PIX_WITHDRAW",
                status: "COMPLETED"
            }
        });

        const pendingKyc = await prisma.user.count({
            where: {
                kycStatus: "PENDING"
            }
        });

        // Revenue calculation: 1.5% of all MERCHANT_PAYMENT transactions
        const merchantVol = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { type: "MERCHANT_PAYMENT", status: "COMPLETED" }
        });

        const totalPointsVolume = completedTransactions._sum.amount || 0;
        const totalInflow = inflow._sum.amount || 0;
        const totalOutflow = outflow._sum.amount || 0;
        const revenue = (merchantVol._sum.amount || 0) * 0.015;

        return {
            success: true,
            stats: {
                totalUsers,
                activeUsersLast24h,
                totalVolume: totalPointsVolume,
                totalInflow,
                totalOutflow,
                pendingKyc,
                revenue,
                netMovement: totalInflow - totalOutflow
            }
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                pointsBalance: true,
                kycStatus: true,
                createdAt: true,
                _count: {
                    select: { transactions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, users };
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function getGlobalActivity() {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { email: true }
                }
            }
        });

        return { success: true, transactions };
    } catch (error) {
        console.error("Error fetching activity:", error);
        return { success: false, error: "Failed to fetch activity" };
    }
}

export async function approveUserKyc(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { kycStatus: "VERIFIED" }
        });
        return { success: true };
    } catch (error) {
        console.error("Error approving KYC:", error);
        return { success: false, error: "Failed to approve user" };
    }
}

export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        });
        return { success: true, value: setting?.value || "false" };
    } catch (error) {
        return { success: false, error: "Failed to fetch setting" };
    }
}

export async function togglePixDeposits() {
    try {
        const key = "pix_deposits_enabled";
        const current = await prisma.systemSetting.findUnique({
            where: { key }
        });

        const newValue = current?.value === "true" ? "false" : "true";

        await prisma.systemSetting.upsert({
            where: { key },
            update: { value: newValue },
            create: { key, value: newValue }
        });

        return { success: true, enabled: newValue === "true" };
    } catch (error) {
        console.error("Error toggling PIX:", error);
        return { success: false, error: "Failed to toggle PIX" };
    }
}

export async function exportFiscalReport() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Simple CSV generation
        const header = "ID,User,Amount,Currency,Type,Status,Date\n";
        const rows = transactions.map((tx: any) =>
            `${tx.id},${tx.user.email},${tx.amount},${tx.currency},${tx.type},${tx.status},${tx.createdAt.toISOString()}`
        ).join("\n");

        return { success: true, csv: header + rows };
    } catch (error) {
        console.error("Error exporting report:", error);
        return { success: false, error: "Failed to export report" };
    }
}
