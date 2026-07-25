"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  name: string;
  email: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g. "09:00"
  timezone: string;
  status: string;
}

interface Slot {
  time: string; // "09:00"
  available: boolean;
}

export function RescheduleModal({
  booking,
  open,
  onOpenChange,
  onSuccess,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Booking) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    booking.date ? new Date(booking.date + "T00:00:00") : undefined,
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(booking.timeSlot);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  // Fetch availability whenever the picked date changes
  useEffect(() => {
    if (!dateKey) return;

    let cancelled = false;
    setLoadingSlots(true);
    setError(null);

    fetch(`/api/booking/availability?date=${dateKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setError(data.message || "Failed to load available slots");
          setSlots([]);
          return;
        }
        setSlots(data.slots || []);

        // if current selection isn't valid for the new date anymore, clear it
        // (keep it if it's the booking's own original slot on its own date)
        const stillValid = (data.slots || []).some(
          (s: Slot) => s.time === selectedSlot && s.available,
        );
        if (!stillValid && dateKey !== booking.date) {
          setSelectedSlot("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading slots");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  async function handleSubmit() {
    if (!dateKey || !selectedSlot) {
      setError("Please select both a date and a time slot");
      return;
    }

    // no-op guard
    if (dateKey === booking.date && selectedSlot === booking.timeSlot) {
      onOpenChange(false);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/booking/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, timeSlot: selectedSlot }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reschedule booking");
        return;
      }

      onSuccess(data.booking);
      onOpenChange(false);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="text-sm text-muted-foreground">
            Currently: <strong>{booking.date}</strong> at{" "}
            <strong>{booking.timeSlot}</strong> ({booking.timezone})
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New time slot</label>
            <Select
              value={selectedSlot}
              onValueChange={setSelectedSlot}
              disabled={!dateKey || loadingSlots}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingSlots ? "Loading slots..." : "Select a time slot"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {slots.length === 0 && !loadingSlots && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No slots available for this date
                  </div>
                )}
                {slots.map((slot) => (
                  <SelectItem
                    key={slot.time}
                    value={slot.time}
                    disabled={!slot.available}
                  >
                    {slot.time}
                    {!slot.available ? " (booked)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || loadingSlots}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
