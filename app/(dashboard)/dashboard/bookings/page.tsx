import connectDB from "@/lib/db/connectDB";
import { Booking } from "@/lib/models";
import BookingsTable from "@/app/components/dashboard/bookings/BookingsTable";

export const metadata = {
  title: "Booking Management | Digital Resolution",
};

async function getBookings() {
  await connectDB();
  const bookings = await Booking.find().sort({ date: -1, timeSlot: 1 }).lean();
  return JSON.parse(JSON.stringify(bookings));
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Booking Management
          </h1>
          <p className="text-muted-foreground">
            View, confirm, reschedule, or cancel bookings.
          </p>
        </div>
      </div>

      <BookingsTable initialBookings={bookings} />
    </div>
  );
}
