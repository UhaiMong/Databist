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
import { cn } from "@/app/lib/utils";

interface BookingWidgetProps {
  defaultServiceId?: string;
}

const STEPS = [
  { key: "pick", label: "Date & time" },
  { key: "form", label: "Your details" },
  { key: "confirmed", label: "Confirmed" },
] as const;

export default function BookingWidget({
  defaultServiceId,
}: BookingWidgetProps) {
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
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.success ? data.services : []));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceOfInterest: defaultServiceId ?? "",
      timezone,
    },
  });
  const selectedServiceId = watch("serviceOfInterest");

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

  function handleSlotSelect(slot: string) {
    if (!date) return;
    setSelectedSlot(slot);
    setValue("date", getLocalDateString(date));
    setValue("timeSlot", slot);
    setValue("timezone", timezone);
    setStep("form");
  }

  const inputCls = (hasError?: boolean) =>
    `h-10 w-full rounded-lg border-slate-200 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 ${
      hasError ? "border-red-300 focus-visible:ring-red-200" : ""
    }`;

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

  return (
    <div className="mx-auto max-w-4xl mt-14">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const isDone = i < stepIndex;
          const isCurrent = i === stepIndex;
          return (
            <li key={s.key} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors ${
                    isDone
                      ? "bg-brand text-primary-foreground"
                      : isCurrent
                        ? "border-2 border-primary text-primary"
                        : "border border-slate-200 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    isCurrent
                      ? "text-foreground"
                      : isDone
                        ? "text-foreground/70"
                        : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={`h-px w-8 sm:w-12 ${
                    isDone ? "bg-primary" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {step === "confirmed" && confirmedInfo ? (
        <Card className="mx-auto max-w-lg overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold tracking-tight">
                Booking confirmed
              </h3>
              <p className="text-sm text-muted-foreground">
                A confirmation with a cancel or reschedule link is on its way to
                your email.
              </p>
            </div>

            <div className="mt-2 w-full rounded-xl border border-slate-200/80 bg-slate-50/60 px-5 py-4 text-left">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{confirmedInfo.date}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium">{confirmedInfo.slot}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Timezone</dt>
                  <dd className="font-medium">{timezone}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl bg-page-bg text-slate-50">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 " />
                <h3 className="text-sm font-semibold tracking-tight">
                  Choose a date & time
                </h3>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className="mx-auto w-11/12 border-2 border-slate-100 text-slate-50"
              />

              {date && (
                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
              )}
            </CardContent>
          </Card>

          {step === "form" && (
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold tracking-tight">
                    Your details
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {date?.toLocaleDateString()} at {selectedSlot} ({timezone})
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Uhai Mong"
                      className={inputCls(!!errors.name)}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. uhai@databist.com"
                      className={inputCls(!!errors.email)}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Phone / WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      placeholder="01788XXXXX"
                      className={inputCls(!!errors.phone)}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="company"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Company (optional)
                    </Label>
                    <Input
                      id="company"
                      placeholder="Digital Resolution"
                      className={inputCls()}
                      {...register("company")}
                    />
                  </div>

                  <div className="space-y-1 5">
                    <Select
                      value={selectedServiceId ?? ""}
                      onValueChange={(v) => setValue("serviceOfInterest", v)}
                    >
                      <SelectTrigger
                        id="serviceOfInterest"
                        className={inputCls(!!errors.serviceOfInterest)}
                      >
                        <SelectValue placeholder="Not sure yet — leave blank" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {services.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="message"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Message (optional)
                    </Label>
                    <Textarea
                      id="message"
                      rows={3}
                      placeholder="e.g. I want a full E-commerce platform"
                      className="resize-none rounded-lg border-slate-200 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                      {...register("message")}
                    />
                  </div>

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

                  <Button
                    type="submit"
                    variant="default"
                    className="w-full rounded-lg bg-brand text-slate-50 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Confirm booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
