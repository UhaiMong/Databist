import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { ServicePackage } from "@/lib/models";
import ServiceForm from "@/app/components/dashboard/services/ServiceForm";

export const metadata = {
  title: "Edit Service | Digital Resolution",
};

interface EditServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  await connectDB();
  const service = await ServicePackage.findOne({ slug }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Service Package
        </h1>
        <p className="text-muted-foreground">
          Update pricing, content, and visibility.
        </p>
      </div>

      <ServiceForm mode="edit" initialData={service} />
    </div>
  );
}
