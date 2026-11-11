import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { Booking, ServicePackage, Blog, Portfolio, Contact, Subscriber } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  CalendarCheck,
  Package,
  Newspaper,
  Images,
  Clock,
  Mail,
  PhoneCall,
} from "lucide-react";
import OverviewCharts from "./OverviewCharts";

export const metadata = {
  title: "Dashboard Overview | Databist",
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

function lastNDates(n: number): string[] {
  const dates: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const copy = new Date(d);
    copy.setDate(d.getDate() - i);
    dates.push(copy.toISOString().split("T")[0]);
  }
  return dates;
}

async function getStats() {
  await connectDB();

  const weekStart = startOfWeek();
  const monthStart = startOfMonth();
  const trendDates = lastNDates(14);
  const trendStart = trendDates[0];

  const [
    bookingsThisWeek,
    bookingsThisMonth,
    pendingBookings,
    totalServices,
    totalPosts,
    totalPortfolio,
    newContacts,
    newSubscribers,
    conversionByService,
    recentBookings,
    trendRows,
  ] = await Promise.all([
    Booking.countDocuments({ date: { $gte: weekStart } }),
    Booking.countDocuments({ date: { $gte: monthStart } }),
    Booking.countDocuments({ status: "pending" }),
    ServicePackage.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "published" }),
    Portfolio.countDocuments({ status: "completed" }),
    Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Subscriber.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
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
    Booking.aggregate([
      { $match: { date: { $gte: trendStart } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
    ]),
  ]);

  const trendMap = new Map(
    trendRows.map((row: { _id: string; count: number }) => [row._id, row.count]),
  );

  return {
    bookingsThisWeek,
    bookingsThisMonth,
    pendingBookings,
    totalServices,
    totalPosts,
    totalPortfolio,
    newContacts,
    newSubscribers,
    conversionByService: conversionByService.map(
      (item: { _id: string; count: number }) => ({
        label: item._id || "Unknown",
        count: item.count,
      }),
    ),
    recentBookings: JSON.parse(JSON.stringify(recentBookings)),
    bookingTrend: trendDates.map((date) => ({
      date,
      count: trendMap.get(date) ?? 0,
    })),
  };
}

export default async function DashboardOverview() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          A quick snapshot of your site&apos;s activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings This Week</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.bookingsThisWeek}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.bookingsThisMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published Services</CardTitle>
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
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPortfolio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Contacts (7d)</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.newContacts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Subscribers (7d)</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.newSubscribers}</p>
          </CardContent>
        </Card>
      </div>

      <OverviewCharts
        bookingTrend={stats.bookingTrend}
        conversionByService={stats.conversionByService}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-brand hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentBookings.map((b: any) => (
                <li
                  key={b._id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <span className="font-medium">{b.name}</span>
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
  );
}
