import connectDB from "@/lib/db/connectDB";
import { FaqGlobal } from "@/lib/models";
import FaqManager from "@/app/components/dashboard/faq/FaqManager";

export const metadata = {
  title: "FAQ Management | Digital Resolution",
};

async function getFaqs() {
  await connectDB();
  const faqs = await FaqGlobal.find().sort({ category: 1, order: 1 }).lean();
  return JSON.parse(JSON.stringify(faqs));
}

export default async function DashboardFaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">FAQ Management</h1>
        <p className="text-muted-foreground">
          Manage the global FAQ set shown on the homepage and /faq page.
        </p>
      </div>

      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
