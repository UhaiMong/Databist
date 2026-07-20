"use client";

import { useMemo, useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreVertical, Download } from "lucide-react";
import { BookingStatus } from "@/app/types";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceOfInterest?: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
}

interface BookingsTableProps {
  initialBookings: Booking[];
}

const STATUS_VARIANT: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
  "no-show": "destructive",
};

export default function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter),
    [bookings, statusFilter],
  );

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);

    const res = await fetch(`/api/booking/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setUpdatingId(null);

    if (data.success) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );
    }
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Service",
      "Date",
      "Time",
      "Status",
    ];
    const rows = filtered.map((b) => [
      b.name,
      b.email,
      b.phone,
      b.serviceOfInterest ?? "",
      b.date,
      b.timeSlot,
      b.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No-show</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Contact</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">Date / Time</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-muted-foreground"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3 text-muted-foreground">
                    {b.email}
                    <br />
                    {b.phone}
                  </td>
                  <td className="p-3">{b.serviceOfInterest || "—"}</td>
                  <td className="p-3">
                    {b.date} · {b.timeSlot}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={STATUS_VARIANT[b.status]}
                      className="capitalize"
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updatingId === b._id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updateStatus(b._id, "confirmed")}
                        >
                          Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(b._id, "completed")}
                        >
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(b._id, "no-show")}
                        >
                          Mark No-show
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(b._id, "cancelled")}
                          className="text-destructive"
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
