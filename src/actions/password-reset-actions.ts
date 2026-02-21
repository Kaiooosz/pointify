"use server";

import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { clearVerificationToken } from "./verification-actions";

export async function sendPasswordResetCode(email: string) {
    if (!email) return { success: false, error: "Identificador não fornecido." };

    const normalizedEmail = email.toLowerCase().trim();

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive'
                }
            },
            select: { id: true, email: true }
        });

        if (!user) {
            return { success: false, error: "Este identificador não possui uma infraestrutura ativa." };
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.verificationToken.deleteMany({ where: { identifier: user.email } });
        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: code,
                expires,
            },
        });

        await sendPasswordResetEmail(user.email, code);

        return { success: true };
    } catch (error) {
        console.error("Error sending reset code:", error);
        return { success: false, error: "Falha na rede de segurança. Tente novamente." };
    }
}

export async function resetPasswordAction(email: string, code: string, newPassword: string) {
    if (!email || !code || !newPassword) return { success: false, error: "Dados incompletos." };

    const normalizedEmail = email.toLowerCase().trim();

    try {
        // Encontrar o usuário ignorando case
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) return { success: false, error: "Usuário não encontrado." };

        const token = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: user.email,
                    token: code.trim(),
                },
            },
        });

        if (!token || new Date() > token.expires) {
            return { success: false, error: "Chave de segurança inválida ou expirada." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        await clearVerificationToken(user.email);

        return { success: true };
    } catch (error) {
        console.error("Error resetting password:", error);
        return { success: false, error: "Falha ao redefinir chave." };
    }
}
