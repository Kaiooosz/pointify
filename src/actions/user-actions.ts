"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserBalance() {
    try {
        const session = await auth();
        const userId = (session?.user as any)?.id;
        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                pointsBalance: true,
                usdtBalance: true,
                btcBalance: true,
            }
        });

        return {
            success: true,
            balance: user?.pointsBalance ?? 0,
            usdt: user?.usdtBalance ?? 0,
            btc: user?.btcBalance ? Number(user.btcBalance) : 0
        };
    } catch (error) {
        console.error("Error fetching balance:", error);
        return { success: false, error: "Failed to fetch balance" };
    }
}

export async function getRecentTransactions() {
    try {
        const session = await auth();
        const userId = (session?.user as any)?.id;
        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

export async function sendPoints(recipientIdentifier: string, amount: number, description: string = "") {
    try {
        const session = await auth();
        const senderId = (session?.user as any)?.id;
        const senderEmail = session?.user?.email;

        if (!senderId) {
            return { success: false, error: "Unauthorized" };
        }

        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Get sender and check balance
            const sender = await tx.user.findUnique({
                where: { id: senderId },
            });

            if (!sender || sender.pointsBalance < amount) {
                throw new Error("Insufficient balance");
            }

            // 2. Get recipient (Search by email first, then by PIX Key)
            let recipient = await tx.user.findUnique({
                where: { email: recipientIdentifier },
            });

            if (!recipient) {
                // Try to find by PIX Key
                const pixKey = await tx.pixKey.findUnique({
                    where: { key: recipientIdentifier },
                    include: { user: true }
                });

                if (pixKey && pixKey.category === "RECEIVING") {
                    recipient = pixKey.user;
                }
            }

            if (!recipient) {
                throw new Error("Recipient not found");
            }

            if (recipient.id === sender.id) {
                throw new Error("Cannot send points to yourself");
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
                    grossAmount: amount,
                    netAmount: amount,
                    type: "MERCHANT_PAYMENT",
                    status: "COMPLETED",
                    description: `Sent to ${recipient.email}: ${description}`,
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
export async function getFullUserProfile() {
    try {
        const session = await auth();
        console.log(`[USER_ACTION] Session check:`, !!session, session?.user?.id);

        const userId = (session?.user as any)?.id;

        if (!userId) {
            console.log("[USER_ACTION] No userId in session.");
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
        });

        if (!user) {
            console.log(`[USER_ACTION] User not found in DB by id: ${userId}`);
            return { success: false, error: "User not found" };
        }

        console.log(`[USER_ACTION] User found: ${user.name}`);
        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateUserProfile(data: { name: string; email: string; bio?: string; image?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                email: data.email,
                bio: data.bio,
                image: data.image
            }
        });

        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
}
