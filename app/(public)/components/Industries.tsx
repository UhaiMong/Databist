import IndustriesGrid from "@/app/components/public/home/IndustriesGrid";

const INDUSTRIES = [
  { name: "Fashion & Apparel", icon: "shirt" },
  { name: "Retail & E-commerce", icon: "shopping-cart" },
  { name: "Real Estate", icon: "building" },
  { name: "Education", icon: "graduation-cap" },
  { name: "Professional Services", icon: "briefcase" },
];

export default function Industries() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Industries We Serve
          </h2>
        </div>
        <IndustriesGrid industries={INDUSTRIES} />
      </div>
    </section>
  );
}
