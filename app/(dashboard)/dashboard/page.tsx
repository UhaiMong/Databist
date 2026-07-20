import { authConfig } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Dashboardpage() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
