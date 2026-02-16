"use server";

import prisma from "@/lib/prisma";
import { pixProvider } from "@/lib/pix";
import { auth } from "@/lib/auth";

export async function createPixDeposit(amountBrl: number) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { success: false, error: "User not found" };

        // 1. Generate PIX via Provider
        const pixData = await pixProvider.createCharge(amountBrl, user.id);

        // 2. Create Transaction Record (Pending)
        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: amountBrl * 1, // Store request in BRL or Points? Schema says amount Int, currency string.
                // Decision: Store as BRL amount in the amount field, currency="BRL".
                // When sending points later, we create a new POINTS transaction or update this one?
                // Better: Create this as a "PIX_DEPOSIT".
                currency: "BRL",
                type: "PIX_DEPOSIT",
                status: "PENDING",
                description: "Deposit via PIX",
                externalId: pixData.transactionId
            }
        });

        return {
            success: true,
            pix: {
                qrCode: pixData.qrCode,
                copyPaste: pixData.copyPaste,
                expiresAt: pixData.expiresAt.toISOString(),
                transactionId: transaction.id
            }
        };

    } catch (error) {
        console.error("Error creating PIX deposit:", error);
        return { success: false, error: "Failed to create deposit" };
    }
}

export async function checkPixStatus(transactionId: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) return { success: false, error: "Transaction not found" };

        return {
            success: true,
            status: transaction.status,
            data: transaction
        };
    } catch (error) {
        return { success: false, error: "Failed to check status" };
    }
}
