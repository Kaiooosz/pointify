"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";

export async function checkEmailStatus(email: string): Promise<{
    exists: boolean;
    status?: string;
}> {
    if (!email) return { exists: false };

    const normalizedEmail = email.toLowerCase().trim();

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive'
                }
            },
            select: { status: true },
        });

        if (!user) return { exists: false };

        return { exists: true, status: user.status };
    } catch {
        return { exists: false };
    }
}

export async function loginAction(formData: FormData) {
    const email = (formData.get("email") as string).toLowerCase().trim();
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            console.error("Auth Error:", error.type, error.message);
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Credenciais inválidas. Verifique sua chave e identificador." };
                default:
                    return { success: false, error: "Falha na autenticação. Tente novamente ou recupere sua chave." };
            }
        }

        // Rethrow everything else (including NEXT_REDIRECT)
        throw error;
    }
}
