"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { portfolioSchema } from "@/lib/validations/misc";
import { z } from "zod";

type PortfolioValues = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  mode: "create" | "edit";
  initialData?: PortfolioValues;
}

export default function PortfolioForm({
  mode,
  initialData,
}: PortfolioFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: initialData ?? { status: "draft", order: 0 },
  });

  const status = watch("status");

  async function onSubmit(values: PortfolioValues) {
    setError("");

    const url =
      mode === "create"
        ? "/api/portfolio"
        : `/api/portfolio/${initialData?.slug}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message ?? "Something went wrong");
      return;
    }

    router.push("/dashboard/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                {...register("serviceType")}
                placeholder="Website Development"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                {...register("industry")}
                placeholder="Retail & E-commerce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
              <Input id="thumbnail" {...register("thumbnail")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalLink">External Link (optional)</Label>
              <Input id="externalLink" {...register("externalLink")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={3} {...register("summary")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultsSummary">Results Summary (optional)</Label>
            <Textarea
              id="resultsSummary"
              rows={2}
              {...register("resultsSummary")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={status === "published"}
              onCheckedChange={(v) =>
                setValue("status", v ? "published" : "draft")
              }
            />
            <Label>Published</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/portfolio")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
