"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  bookingFormSchema,
  BookingFormValues,
} from "@/lib/validations/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const formatDateString = (d: Date | undefined) => {
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
};

export function BookingFormModal({
  open,
  onOpenChange,
  defaultServiceId,
  timezone,
  date,
  selectedSlot,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultServiceId: string;
  timezone: string;
  date: Date | undefined;
  selectedSlot: string;
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitError, setSubmitError] = useState("");
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      timezone: timezone ?? "",
      date: formatDateString(date) ?? "",
      timeSlot: selectedSlot ?? "",
    },
  });

  const selectedServiceId = watch("serviceOfInterest");

  useEffect(() => {
    setValue("date", formatDateString(date));
    setValue("timeSlot", selectedSlot ?? "");
    setValue("timezone", timezone ?? "");
    if (defaultServiceId) {
      setValue("serviceOfInterest", defaultServiceId);
    }
  }, [date, selectedSlot, timezone, defaultServiceId, setValue]);

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      // Delay reset so animation finishes smoothly
      setTimeout(() => setIsSubmitted(false), 300);
    }
    onOpenChange(val);
  };

  async function onSubmit(values: BookingFormValues) {
    if (!executeRecaptcha) {
      toast.error("reCaptcha is loading...");
      return;
    }
    setLoading(true);
    setSubmitError("");
    const recaptchaToken = await executeRecaptcha("booking_form");

    if (!recaptchaToken) {
      toast.error("reCaptcha failed to generate. Please try again.");
      return;
    }

    if (!date && !selectedSlot) {
      setSubmitError("Date and time slot are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: formatDateString(date),
          timeSlot: selectedSlot,
          timezone,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLoading(false);
        setIsSubmitted(true);
        return;
      }

      if (!data.success) {
        toast.error("Something went wrong!");
        setSubmitError(
          data.message ?? "Something went wrong. Please try another slot.",
        );
        return;
      }

      onOpenChange(false);
    } catch (err) {
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-10/12 lg:max-w-3xl max-h-[92vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>

            <DialogTitle className="text-2xl font-bold text-slate-800">
              Booking Confirmed!
            </DialogTitle>

            <DialogDescription className="text-slate-600 max-w-sm mx-auto">
              Thank you! We have reserved your appointment for{" "}
              <span className="font-semibold text-slate-900">
                {date?.toLocaleDateString()} at {selectedSlot}
              </span>{" "}
              ({timezone}).
            </DialogDescription>

            <div className="pt-4">
              <Button
                onClick={() => handleOpenChange(false)}
                className="w-full bg-brand text-slate-50"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Free booking consultant
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please Fill Up the form to book a schedule
            </DialogDescription>

            <div className="mb-4">
              <p className="mt-0.5 text-sm text-brand-muted">
                {date?.toLocaleDateString()} at {selectedSlot} ({timezone})
              </p>
            </div>

            {/* Added error callback to handleSubmit to surface invalid fields */}
            <form
              onSubmit={handleSubmit(onSubmit, (invalidFields) => {
                console.log("Zod Validation Failed:", invalidFields);
              })}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Uhai Mong"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. uhai@databist.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
                >
                  Phone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  placeholder="01788XXXXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="company"
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
                >
                  Company (optional)
                </Label>
                <Input
                  id="company"
                  placeholder="Databist"
                  {...register("company")}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="serviceOfInterest"
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
                >
                  Interest of service (optional)
                </Label>
                <Select
                  value={selectedServiceId ?? ""}
                  onValueChange={(v) => setValue("serviceOfInterest", v)}
                >
                  <SelectTrigger id="serviceOfInterest">
                    <SelectValue placeholder="Not sure yet — leave blank" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-full" position="popper">
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
                  className="text-sm font-bold uppercase tracking-wide text-slate-700 my-1"
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
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Booking..." : "Confirm booking"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
