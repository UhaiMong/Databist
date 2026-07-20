import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import ServicesTable from "@/app/components/dashboard/services/ServicesTable";

export const metadata = {
  title: "Service Management | Digital Resolution",
};

async function getServices() {
  await connectDB();
  const services = await ServicePackage.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(services));
}

export default async function DashboardServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Service Management
          </h1>
          <p className="text-muted-foreground">
            Manage package pricing, content, and visibility.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Link>
        </Button>
      </div>

      <ServicesTable initialServices={services} />
    </div>
  );
}
