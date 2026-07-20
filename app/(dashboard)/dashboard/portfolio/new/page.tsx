import PortfolioForm from "@/app/components/dashboard/portfolio/PortfolioForm";

export const metadata = {
  title: "New Portfolio Item | Digital Resolution",
};

export default function NewPortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add Portfolio Item
        </h1>
        <p className="text-muted-foreground">Create a new case study record.</p>
      </div>

      <PortfolioForm mode="create" />
    </div>
  );
}
