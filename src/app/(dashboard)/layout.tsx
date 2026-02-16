import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
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
        <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#0B0B0B] transition-colors duration-500">
            <DashboardNavbar />

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] overflow-x-hidden">
                <div className="flex-1 p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
