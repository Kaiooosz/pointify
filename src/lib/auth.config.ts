import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.role) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    providers: [], // Providers are configured in auth.ts to avoid edge runtime issues
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
