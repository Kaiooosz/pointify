"use server";

import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import validator from "validator";

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

// ─── Step 1: Validar email e enviar código ───────────────────────────────────
export async function sendVerificationCode(email: string) {
    if (!email || !validator.isEmail(email)) {
        return { success: false, error: "Formato de e-mail inválido." };
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
        // Validação avançada via Abstract API (opcional, se a key estiver configurada)
        if (ABSTRACT_API_KEY) {
            try {
                const res = await fetch(
                    `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(normalizedEmail)}`
                );
                const data = await res.json();

                if (data.is_valid_format && !data.is_valid_format.value) {
                    return { success: false, error: "Formato de e-mail inválido." };
                }
                if (data.is_disposable_email && data.is_disposable_email.value) {
                    return { success: false, error: "E-mails temporários não são aceitos." };
                }
                if (data.deliverability === "UNDELIVERABLE") {
                    return { success: false, error: "Este e-mail não pode receber mensagens." };
                }
            } catch {
                // Não bloqueia se a API externa falhar
                console.warn("[AbstractAPI] Falha na validação avançada — continuando");
            }
        }

        // Verifica se o email já está cadastrado
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (existingUser) {
            return { success: false, error: "Este e-mail já está cadastrado." };
        }

        // Gera o código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Remove tokens anteriores para este email e cria um novo
        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail },
        });

        await prisma.verificationToken.create({
            data: {
                identifier: normalizedEmail,
                token: code,
                expires,
            },
        });

        // Envia o email de verificação
        const emailResult = await sendVerificationEmail(normalizedEmail, code);

        if (!emailResult.success) {
            console.error("[Verification] Falha no envio do email:", emailResult.error);
            // Ainda retorna sucesso para não vazar informação sobre o sistema de email
            // mas loga o erro para diagnóstico
        }

        // Para debug em desenvolvimento: imprime o código no console
        if (process.env.NODE_ENV === "development") {
            console.log(`\n🔑 [DEV] Código de verificação para ${normalizedEmail}: ${code}\n`);
        }

        return {
            success: true,
            message: "Código de verificação enviado para seu e-mail.",
        };

    } catch (error: any) {
        console.error("[sendVerificationCode] Erro:", error);
        return { success: false, error: "Erro ao enviar código. Tente novamente." };
    }
}

// ─── Step 2: Validar o código ────────────────────────────────────────────────
export async function verifyCode(email: string, code: string) {
    if (!email || !code || code.length !== 6) {
        return { success: false, error: "Dados inválidos." };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    try {
        const token = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: normalizedEmail,
                    token: normalizedCode,
                },
            },
        });

        if (!token) {
            return { success: false, error: "Código inválido. Verifique e tente novamente." };
        }

        if (new Date() > token.expires) {
            // Remove token expirado
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: normalizedEmail,
                        token: normalizedCode,
                    },
                },
            }).catch(() => { });
            return { success: false, error: "Código expirado. Solicite um novo." };
        }

        // Código válido — não deletamos ainda, o token serve de "passaporte"
        // para completar o cadastro no step 4
        return { success: true };

    } catch (error) {
        console.error("[verifyCode] Erro:", error);
        return { success: false, error: "Erro ao validar o código." };
    }
}

// ─── Limpar token após registro concluído ───────────────────────────────────
export async function clearVerificationToken(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    try {
        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail },
        });
    } catch {
        // Silencioso — não é crítico
    }
}
