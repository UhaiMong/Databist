import DashboardOverview from "@/app/components/dashboard/overview/adminOverview";
import { authConfig } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Dashboardpage() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");
  return <DashboardOverview />;
}
