import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        }
    },
    providers: [], // Providers are configured in auth.ts to avoid edge runtime issues
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
