import ServiceForm from "@/app/components/dashboard/services/ServiceForm";

export const metadata = {
  title: "Add Service | Digital Resolution",
};

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add Service Package
        </h1>
        <p className="text-muted-foreground">
          Create a new dashboard-managed service package.
        </p>
      </div>

      <ServiceForm mode="create" />
    </div>
  );
}
