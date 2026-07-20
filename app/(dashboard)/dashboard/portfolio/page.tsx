import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import PortfolioTable from "@/app/components/dashboard/portfolio/PortfolioTable";

export const metadata = {
  title: "Portfolio Management | Digital Resolution",
};

async function getItems() {
  await connectDB();
  const items = await Portfolio.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export default async function DashboardPortfolioPage() {
  const items = await getItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-muted-foreground">
            Manage case studies and past project records.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/portfolio/new">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <PortfolioTable initialItems={items} />
    </div>
  );
}
