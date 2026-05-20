import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#030712] flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pt-14 pb-16 lg:pb-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
