import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { AdminHeader } from "../../components/layout/admin-header";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user as any;

    // STRICT ACCESS CONTROL
    // Only adm@pointify.com or users with specific admin roles can enter
    if (!user || (user.email !== "adm@pointify.com" && user.role === "CUSTOMER")) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            <Sidebar isAdmin={true} />

            <main className="md:pl-64 min-h-screen flex flex-col pt-2 bg-[#0B0B0B]">
                <AdminHeader userEmail={user.email} userName={user.name} />

                <div className="flex-1 p-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
