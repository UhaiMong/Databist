import connectDB from "@/lib/db/connectDB";
import { Booking, ServicePackage, Blog, Portfolio } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CalendarCheck, Package, Newspaper, Images, Clock } from "lucide-react";

export const metadata = {
  title: "Dashboard Overview | Digital Resolution",
};

function startOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function startOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
}

async function getStats() {
  await connectDB();

  const today = new Date().toISOString().split("T")[0];
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const [
    bookingsThisWeek,
    bookingsThisMonth,
    pendingBookings,
    totalServices,
    totalPosts,
    totalPortfolio,
    conversionByService,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments({ date: { $gte: weekStart } }),
    Booking.countDocuments({ date: { $gte: monthStart } }),
    Booking.countDocuments({ status: "pending" }),
    ServicePackage.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "published" }),
    Portfolio.countDocuments({ status: "published" }),
    Booking.aggregate([
      { $match: { serviceOfInterest: { $nin: [null, ""] } } },
      { $group: { _id: "$serviceOfInterest", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name date timeSlot status")
      .lean(),
  ]);

  return {
    bookingsThisWeek,
    bookingsThisMonth,
    pendingBookings,
    totalServices,
    totalPosts,
    totalPortfolio,
    conversionByService: JSON.parse(JSON.stringify(conversionByService)),
    recentBookings: JSON.parse(JSON.stringify(recentBookings)),
  };
}

export default async function DashboardOverview() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          A quick snapshot of your site&apos;s activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Bookings This Week
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.bookingsThisWeek}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Bookings This Month
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.bookingsThisMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Published Services
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalServices}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Items
            </CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPortfolio}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion by Service</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.conversionByService.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No booking data yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {stats.conversionByService.map((item: any) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item._id}</span>
                    <span className="font-semibold">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentBookings.map((b: any) => (
                  <li
                    key={b._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{b.name}</span>
                    <span className="text-muted-foreground">
                      {b.date} · {b.timeSlot}
                    </span>
                    <span className="capitalize font-medium">{b.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
