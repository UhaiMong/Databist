import SubscribersTable from "@/app/components/dashboard/subscribers/SubscribersTable";
import connectDB from "@/lib/db/connectDB";
import { Subscriber } from "@/lib/models";

export const metadata = {
  title: "Newsletter Subscribers | Digital Resolution",
};

async function getSubscribers() {
  await connectDB();
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(subscribers));
}

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Newsletter Subscribers
        </h1>
        <p className="text-muted-foreground">
          Everyone who has subscribed via the footer signup.
        </p>
      </div>

      <SubscribersTable initialSubscribers={subscribers} />
    </div>
  );
}
