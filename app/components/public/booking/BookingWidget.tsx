"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "../../ui/calendar";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent } from "../../ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  bookingFormSchema,
  BookingFormValues,
} from "@/lib/validations/booking";

interface BookingWidgetProps {
  defaultService?: string;
}

export default function BookingWidget({ defaultService }: BookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "form" | "confirmed">("pick");
  const [submitError, setSubmitError] = useState("");
  const [confirmedInfo, setConfirmedInfo] = useState<{
    date: string;
    slot: string;
  } | null>(null);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceOfInterest: defaultService ?? "",
      timezone,
    },
  });

  useEffect(() => {
    if (!date) return;

    const dateStr = date.toISOString().split("T")[0];
    setLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/booking/availability?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.success ? data.slots : []))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  function handleSlotSelect(slot: string) {
    if (!date) return;
    setSelectedSlot(slot);
    setValue("date", date.toISOString().split("T")[0]);
    setValue("timeSlot", slot);
    setValue("timezone", timezone);
    setStep("form");
  }

  async function onSubmit(values: BookingFormValues) {
    setSubmitError("");

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!data.success) {
      setSubmitError(
        data.message ?? "Something went wrong. Please try another slot.",
      );
      if (res.status === 409) {
        setStep("pick");
        setSelectedSlot(null);
      }
      return;
    }

    setConfirmedInfo({ date: values.date, slot: values.timeSlot });
    setStep("confirmed");
  }

  if (step === "confirmed" && confirmedInfo) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h3 className="text-xl font-semibold">Booking Confirmed</h3>
          <p className="text-muted-foreground">
            Your consultation is booked for{" "}
            <span className="font-medium text-foreground">
              {confirmedInfo.date}
            </span>{" "}
            at{" "}
            <span className="font-medium text-foreground">
              {confirmedInfo.slot}
            </span>{" "}
            ({timezone}).
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation has been sent to your email with a cancel/reschedule
            link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d: Date) =>
              d < new Date(new Date().setHours(0, 0, 0, 0))
            }
            className="mx-auto"
          />

          {date && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Available slots — {date.toLocaleDateString()} ({timezone})
              </p>

              {loadingSlots ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading slots...
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No available slots for this date.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedSlot === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {step === "form" && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Booking {date?.toLocaleDateString()} at {selectedSlot} (
                {timezone})
              </p>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" {...register("company")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceOfInterest">Service of Interest</Label>
                <Input
                  id="serviceOfInterest"
                  {...register("serviceOfInterest")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea id="message" rows={3} {...register("message")} />
              </div>

              {/* Honeypot field — hidden from real users */}
              <input
                type="text"
                {...register("honeypot")}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
