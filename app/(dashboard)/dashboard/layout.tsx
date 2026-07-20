import { redirect } from "next/navigation";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth/auth.config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={session.user.role} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader user={session.user} />
        <main className="flex-1 bg-muted/20 p-6">{children}</main>
      </div>
    </div>
  );
}
