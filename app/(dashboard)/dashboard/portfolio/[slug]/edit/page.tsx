import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { Portfolio } from "@/lib/models";
import PortfolioForm from "@/app/components/dashboard/portfolio/PortfolioForm";

export const metadata = {
  title: "Edit Portfolio Item | Digital Resolution",
};

interface EditPortfolioPageProps {
  params: Promise<{ slug: string }>;
}

async function getItem(slug: string) {
  await connectDB();
  const item = await Portfolio.findOne({ slug }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Portfolio Item
        </h1>
        <p className="text-muted-foreground">Update case study details.</p>
      </div>

      <PortfolioForm mode="edit" initialData={item} />
    </div>
  );
}
