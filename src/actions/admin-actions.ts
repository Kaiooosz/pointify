"use server";

import prisma from "@/lib/prisma";

export async function getAdminStats() {
    try {
        const totalUsers = await prisma.user.count();
        const totalVolume = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                currency: "POINTS",
                status: "COMPLETED"
            }
        });

        const pendingKyc = await prisma.user.count({
            where: {
                kycStatus: "PENDING"
            }
        });

        // Revenue calculation: Sum of MERCHANT_PAYMENT fees (if we had a fee field)
        // For now, let's pretend revenue is 1% of all transaction volume
        const revenue = (totalVolume._sum.amount || 0) * 0.01;

        return {
            success: true,
            stats: {
                totalUsers,
                totalVolume: totalVolume._sum.amount || 0,
                pendingKyc,
                revenue
            }
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { success: false, error: "Failed to fetch stats" };
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
