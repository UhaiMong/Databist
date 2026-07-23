import AvailabilityManager from "@/app/components/dashboard/bookings/AvailabilityManager";
import connectDB from "@/lib/db/connectDB";
import { Availability, BlackoutDate } from "@/lib/models";

export const metadata = {
  title: "Availability Settings | Digital Resolution",
};

async function getData() {
  await connectDB();
  const [rules, blackoutDates] = await Promise.all([
    Availability.find().sort({ dayOfWeek: 1, startTime: 1 }).lean(),
    BlackoutDate.find().sort({ date: 1 }).lean(),
  ]);
  return {
    rules: JSON.parse(JSON.stringify(rules)),
    blackoutDates: JSON.parse(JSON.stringify(blackoutDates)),
  };
}
export default async function AvailabilityPage() {
  const { rules, blackoutDates } = await getData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Availability Settings
        </h1>
        <p className="text-muted-foreground">
          Configure working hours, slot length, buffer time, and blackout dates.
        </p>
      </div>

      <AvailabilityManager
        initialRules={rules}
        initialBlackoutDates={blackoutDates}
      />
    </div>
  );
}
