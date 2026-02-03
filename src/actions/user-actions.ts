"use server";

import prisma from "@/lib/prisma";

export async function getUserBalance(email: string = "adm@pointify.com") {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                pointsBalance: true,
            }
        });

        return { success: true, balance: user?.pointsBalance ?? 0 };
    } catch (error) {
        console.error("Error fetching balance:", error);
        return { success: false, error: "Failed to fetch balance" };
    }
}

export async function getRecentTransactions(email: string = "adm@pointify.com") {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        return { success: true, transactions: user?.transactions ?? [] };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

export async function sendPoints(recipientEmail: string, amount: number, description: string = "") {
    try {
        const senderEmail = "admin@pointify.com"; // Mock sender for now

        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Get sender and check balance
            const sender = await tx.user.findUnique({
                where: { email: senderEmail },
            });

            if (!sender || sender.pointsBalance < amount) {
                throw new Error("Insufficient balance");
            }

            // 2. Get recipient
            const recipient = await tx.user.findUnique({
                where: { email: recipientEmail },
            });

            if (!recipient) {
                throw new Error("Recipient not found");
            }

            // 3. Update balances
            await tx.user.update({
                where: { id: sender.id },
                data: { pointsBalance: { decrement: amount } },
            });

            await tx.user.update({
                where: { id: recipient.id },
                data: { pointsBalance: { increment: amount } },
            });

            // 4. Create transaction records
            await tx.transaction.create({
                data: {
                    userId: sender.id,
                    amount: amount,
                    type: "MERCHANT_PAYMENT",
                    status: "COMPLETED",
                    description: `Sent to ${recipientEmail}: ${description}`,
                    currency: "POINTS",
                },
            });

            await tx.transaction.create({
                data: {
                    userId: recipient.id,
                    amount: amount,
                    type: "CASHBACK",
                    status: "COMPLETED",
                    description: `Received from ${senderEmail}: ${description}`,
                    currency: "POINTS",
                },
            });

            return { success: true };
        });

        return result;
    } catch (error: any) {
        console.error("Error sending points:", error);
        return { success: false, error: error.message || "Failed to send points" };
    }
}
