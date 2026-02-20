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
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { status: true },
        });

        if (!user) return { exists: false };

        return { exists: true, status: user.status };
    } catch {
        return { exists: false };
    }
}

export async function loginAction(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Credenciais inválidas. Verifique seu e-mail e senha." };
                default:
                    return { success: false, error: "Ocorreu um erro ao tentar entrar. Tente novamente." };
            }
        }
        if ((error as any).message === "NEXT_REDIRECT") {
            throw error;
        }

        return { success: false, error: "Conexão falhou. Verifique sua rede." };
    }
}
