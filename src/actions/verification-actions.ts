"use server";

import prisma from "@/lib/prisma";

import axios from "axios";
import validator from "validator";

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

// Action: Step 1 - Check email availability and send verification code
export async function sendVerificationCode(email: string) {
    // 1. Validate email format (Basic)
    if (!email || !validator.isEmail(email)) {
        return { success: false, error: "Formato de e-mail inválido." };
    }

    const normalizedEmail = email.toLowerCase();

    try {
        // 2. Advanced Validation via Abstract API (if API Key is present)
        if (ABSTRACT_API_KEY) {
            try {
                const response = await axios.get(
                    "https://emailvalidation.abstractapi.com/v1/",
                    {
                        params: {
                            api_key: ABSTRACT_API_KEY,
                            email: normalizedEmail,
                        },
                    }
                );

                const data = response.data;

                // Anti-fraud checks
                if (data.is_valid_format && !data.is_valid_format.value) {
                    return { success: false, error: "Formato de e-mail inválido (API)." };
                }

                if (data.is_mx_found && !data.is_mx_found.value) {
                    return { success: false, error: "Domínio de e-mail sem MX válido." };
                }

                if (data.is_disposable_email && data.is_disposable_email.value) {
                    return { success: false, error: "E-mails descartáveis não são permitidos." };
                }

                if (data.deliverability === "UNDELIVERABLE") {
                    return { success: false, error: "E-mail não entregável." };
                }

                // Additional quality score check if needed
                if (data.quality_score && data.quality_score < 0.5) {
                    console.warn(`[Risk] Low quality email score: ${data.quality_score} for ${normalizedEmail}`);
                }

            } catch (apiError) {
                console.error("Abstract API Validation Failed (Warning only):", apiError);
                // We proceed if the external API fails to avoid blocking legitimate users during outages
            }
        }

        // 3. Check if email is already registered in our DB
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return { success: false, error: "Este e-mail já está cadastrado." };
        }

        // 4. Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes expiration

        // 5. Save code to database
        // Delete any existing tokens for this email first
        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail }
        });

        // Create new token
        await prisma.verificationToken.create({
            data: {
                identifier: normalizedEmail,
                token: code,
                expires,
            },
        });

        // 6. Send email (Mocked for now)
        // In a real scenario, integrate Resend/SendGrid/Abstract API here.
        console.log(`[Validation Code] To: ${normalizedEmail} | Code: ${code}`);

        return { success: true, message: "Código de verificação enviado para seu e-mail." };

    } catch (error: any) {
        console.error("Error sending verification code:", error);
        return { success: false, error: error.message || "Erro ao enviar código. Tente novamente." };
    }
}

// Action: Step 2 - Verify the code
export async function verifyCode(email: string, code: string) {
    if (!email || !code) {
        return { success: false, error: "Dados inválidos." };
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: normalizedEmail,
                    token: code,
                }
            },
        });

        if (!verificationToken) {
            return { success: false, error: "Código inválido." };
        }

        if (new Date() > verificationToken.expires) {
            return { success: false, error: "Código expirado. Solicite um novo." };
        }

        // Valid code
        // We can optionally delete the token here, or keep it until registration is complete.
        // Keeping it allows the user to complete registration in step 3 without issue if step 3 fails validation elsewhere.

        return { success: true };
    } catch (error) {
        console.error("Error verifying code:", error);
        return { success: false, error: "Erro ao validar código." };
    }
}
