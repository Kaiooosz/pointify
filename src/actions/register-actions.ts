"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUserAction(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            return { success: false, error: "Preencha todos os campos obrigatórios." };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: "Este e-mail já está em uso." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "CUSTOMER",
                pointsBalance: 0,
                status: "ACTIVE", // Automatically active for smoother onboarding
                kycStatus: "VERIFIED", // Automatically verified for smoother onboarding
            },
        });


        return { success: true };
    } catch (error: any) {
        console.error("Error registering user:", error);
        return { success: false, error: "Ocorreu um erro ao criar a conta. Tente novamente." };
    }
}
