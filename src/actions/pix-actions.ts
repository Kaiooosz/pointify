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
        const amountInCents = Math.round(amountBrl * 100);
        const spread = Math.round(amountInCents * 0.01); // 1% fee
        const netAmount = amountInCents - spread;

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: netAmount,
                grossAmount: amountInCents,
                netAmount: netAmount,
                spread: spread,
                currency: "BRL",
                type: "PIX_DEPOSIT",
                status: "PENDING",
                description: "Deposit via PIX (1% taxa)",
                externalId: pixData.transactionId,
                method: "PIX"
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

// ─── Pix Keys Management ───────────────────────────────────────────────────

export async function getPixKeys(category?: "RECEIVING" | "WITHDRAWAL") {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const where: any = { userId: session.user.id };
        if (category) where.category = category;

        const keys = await prisma.pixKey.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, keys };
    } catch (error) {
        console.error("Error fetching PIX keys:", error);
        return { success: false, error: "Failed to fetch keys" };
    }
}

export async function createPixKey(data: {
    key: string;
    type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM" | "BTC" | "USDT";
    category: "RECEIVING" | "WITHDRAWAL";
    network?: string;
    label?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Basic validation: max 5 keys per category (as seen in UI)
        const count = await prisma.pixKey.count({
            where: {
                userId: session.user.id,
                category: data.category
            }
        });

        if (count >= 5) {
            return { success: false, error: "Limite de 5 chaves por categoria atingido." };
        }

        const pixKey = await prisma.pixKey.create({
            data: {
                ...data,
                userId: session.user.id
            }
        });

        return { success: true, pixKey };
    } catch (error: any) {
        console.error("Error creating PIX key:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Esta chave PIX já está cadastrada." };
        }
        return { success: false, error: "Falha ao criar chave PIX." };
    }
}

export async function deletePixKey(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Ensure user owns the key
        const key = await prisma.pixKey.findUnique({
            where: { id }
        });

        if (!key || key.userId !== session.user.id) {
            return { success: false, error: "Chave não encontrada ou acesso negado." };
        }

        await prisma.pixKey.delete({
            where: { id }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting PIX key:", error);
        return { success: false, error: "Falha ao excluir chave PIX." };
    }
}
