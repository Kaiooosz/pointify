import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { UserProvider } from "@/components/providers/user-provider";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session: any = null;
    try {
        session = await auth();
    } catch {
        redirect("/login");
    }
    const user = session?.user as any;

    // STRICT SEPARATION
    // Admin user (adm@pointify.com) is NOT allowed in the main customer dashboard
    if (user?.email === "adm@pointify.com") {
        redirect("/admin");
    }

    // Regular customers who are not logged in go to login (optional, but good for security)
    if (!user) {
        redirect("/login");
    }

    return (
        <UserProvider user={user}>
            <div className="min-h-screen bg-[#000000] text-white transition-colors duration-500">
                <DashboardNavbar initialUser={user} />

                {/* Main Content */}
                <main className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] overflow-x-hidden">
                    <div className="flex-1 p-6 md:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </UserProvider>
    );
}
