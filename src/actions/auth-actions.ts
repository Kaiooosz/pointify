"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

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
        // Next.js redirect throws an error, so we need to rethrow it or handle it
        if ((error as any).message === "NEXT_REDIRECT") {
            throw error;
        }

        // Handle other errors
        return { success: false, error: "Conexão falhou. Verifique sua rede." };
    }
}
