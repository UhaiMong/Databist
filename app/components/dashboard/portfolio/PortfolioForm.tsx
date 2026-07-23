"use client";

import { useEffect, useState } from "react";
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
import slugify from "slugify";
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
  const [slugPreview, setSlugPreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioValues>({
    resolver: zodResolver(portfolioSchema as any),
    defaultValues: initialData ?? { status: "completed", order: 0 },
  });

  const status = watch("status");

  useEffect(() => {
    const title = watch("title");
    if (!title) return;
    const generateSlug = slugify(title, { lower: true, strict: true });
    setSlugPreview(generateSlug);
    setValue("slug", generateSlug, { shouldValidate: true });
  }, [watch("title")]);

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
              <Input
                id="title"
                placeholder="Success Hub"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="success-hub"
                readOnly
                {...register("slug")}
              />
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
              <Input
                id="thumbnail"
                placeholder="https://www.img.come"
                {...register("thumbnail")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalLink">External Link (optional)</Label>
              <Input
                id="externalLink"
                placeholder="https://successhub.net"
                {...register("externalLink")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="e.g. 1"
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Success hub is a university alumni management system.."
              rows={3}
              {...register("summary")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultsSummary">Results Summary (optional)</Label>
            <Textarea
              id="resultsSummary"
              placeholder="e.g. Alumni directory, Networking..."
              rows={2}
              {...register("resultsSummary")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              className=""
              checked={status === "completed"}
              onCheckedChange={(v) =>
                setValue("status", v ? "completed" : "under-development")
              }
            />
            <Label>Project status</Label>
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Full details about the project"
              rows={4}
              {...register("description")}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          className="bg-brand text-slate-50 cursor-pointer"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </Button>
        <Button
          className="text-slate-50 bg-brand"
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
