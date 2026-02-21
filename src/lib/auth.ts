import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const normalizedEmail = (credentials.email as string).toLowerCase().trim();
                console.log(`[AUTH] Login attempt: ${normalizedEmail}`);

                const user = await prisma.user.findFirst({
                    where: {
                        email: {
                            equals: normalizedEmail,
                            mode: 'insensitive'
                        }
                    }
                });

                if (!user) {
                    console.log(`[AUTH] User not found: ${normalizedEmail}`);
                    return null;
                }

                if (!user.password) {
                    console.log(`[AUTH] No password set for: ${normalizedEmail}`);
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                console.log(`[AUTH] Password match for ${normalizedEmail}: ${isPasswordCorrect}`);

                if (!isPasswordCorrect) {
                    console.log(`[AUTH] Inválido pass for: ${normalizedEmail}`);
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }


        })
    ],
});
