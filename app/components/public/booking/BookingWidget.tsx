"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/app/components/ui/calendar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent } from "@/app/components/ui/card";
import { CheckCircle2, Loader2, CalendarDays, Check } from "lucide-react";
import {
  bookingFormSchema,
  BookingFormValues,
} from "@/lib/validations/booking";
import { getLocalDateString } from "@/lib/utils/timeSlots";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "@/lib/utils";
import { Dialog } from "../../ui/dialog";
import { BookingFormModal } from "./BookingFormModal";

interface BookingWidgetProps {
  defaultServiceId?: string;
}

export default function BookingWidget({
  defaultServiceId,
}: BookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmedInfo, setConfirmedInfo] = useState<{
    date: string;
    slot: string;
  } | null>(null);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  useEffect(() => {
    if (!date) return;

    const dateStr = getLocalDateString(date);
    setLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/booking/availability?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.success ? data.slots : []))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(null);
  };

  function handleSlotSelect(slot: string) {
    if (!date) return;
    setSelectedSlot(slot);
    setShowForm(true);
  }

  return (
    <>
      <div className="mx-auto max-w-4xl mt-14">
        <div className="w-full">
          <Card className="rounded-2xl bg-page-bg text-slate-50">
            <CardContent
              className={cn(
                "p-5 sm:p-6",
                "flex flex-col-reverse md:flex-row gap-4",
              )}
            >
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 " />
                  <h3 className="text-sm font-semibold tracking-tight">
                    Choose a date & time
                  </h3>
                </div>

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className="mx-auto w-11/12 border rounded-xl border-slate-100 text-slate-50"
                />
              </div>

              {date ? (
                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                    Available — {date.toLocaleDateString()} ({timezone})
                  </p>

                  {loadingSlots ? (
                    <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading slots...
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="py-2 text-sm text-muted-foreground">
                      No available slots for this date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={
                            selectedSlot === slot ? "default" : "outline"
                          }
                          size="sm"
                          className={cn(
                            "rounded-lg bg-brand font-normal",
                            selectedSlot === slot
                              ? "bg-white text-brand cursor-not-allowed duration-300 transition-colors ease-in"
                              : "",
                          )}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-lg font-semibold text-brand-light italic flex-1">
                  <span>Please Select a date to book a free consultantion</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {showForm && selectedSlot && (
        <BookingFormModal
          open={showForm}
          onOpenChange={setShowForm}
          timezone={timezone}
          defaultServiceId={defaultServiceId!}
          selectedSlot={selectedSlot as string}
          date={date}
        />
      )}
    </>
  );
}
