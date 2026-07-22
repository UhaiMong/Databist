"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import { Card, CardContent } from "../../ui/card";
import slugify from "slugify";
import { Plus, Trash2 } from "lucide-react";
import {
  servicePackageSchema,
  ServicePackageValues,
} from "@/lib/validations/servicePackage";

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: ServicePackageValues;
}

export default function ServiceForm({ mode, initialData }: ServiceFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [slugPreview, setSlugPreview] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ServicePackageValues>({
    resolver: zodResolver(servicePackageSchema as any),
    defaultValues: initialData ?? {
      name: "",
      priceLabel: "",
      shortDescription: "",
      longDescription: "",
      heroImage: "",
      isCombo: false,
      inclusions: [""],
      processSteps: [],
      faqs: [],
      status: "draft",
      order: 0,
    },
  });

  const inclusions = useFieldArray({ control, name: "inclusions" as never });
  const processSteps = useFieldArray({ control, name: "processSteps" });
  const faqs = useFieldArray({ control, name: "faqs" });

  const status = watch("status");

  useEffect(() => {
    const name = watch("name");
    if (!name) return;
    const generateSluge = slugify(name, { lower: true, strict: true });
    setSlugPreview(generateSluge);
    setValue("slug", generateSluge, { shouldValidate: true });
  }, [watch("name")]);
  async function onSubmit(values: ServicePackageValues) {
    setError("");

    const url =
      mode === "create"
        ? "/api/services"
        : `/api/services/${initialData?.slug}`;
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

    router.push("/dashboard/services");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Realstate web application"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                readOnly
                {...register("slug")}
                placeholder="website-package"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceLabel">Price Label</Label>
              <Input
                id="priceLabel"
                {...register("priceLabel")}
                placeholder="From $350"
              />
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
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              rows={2}
              {...register("shortDescription")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              rows={5}
              {...register("longDescription")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero Image URL</Label>
            <Input id="heroImage" {...register("heroImage")} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isCombo")}
                onCheckedChange={(v) => setValue("isCombo", v)}
              />
              <Label>Combo / Bundle Package</Label>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <Label>Inclusions</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inclusions.append("")}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          {inclusions.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`inclusions.${i}` as const)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => inclusions.remove(i)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <Label>Process Steps</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                processSteps.append({ title: "", description: "" })
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          {processSteps.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_2fr_auto]"
            >
              <Input
                placeholder="Step title"
                {...register(`processSteps.${i}.title` as const)}
              />
              <Input
                placeholder="Description"
                {...register(`processSteps.${i}.description` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => processSteps.remove(i)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <Label>Package FAQs</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => faqs.append({ question: "", answer: "" })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          {faqs.fields.map((field, i) => (
            <div key={field.id} className="space-y-2 rounded-md border p-3">
              <Input
                placeholder="Question"
                {...register(`faqs.${i}.question` as const)}
              />
              <Textarea
                placeholder="Answer"
                rows={2}
                {...register(`faqs.${i}.answer` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => faqs.remove(i)}
              >
                <Trash2 className="mr-1 h-4 w-4 text-destructive" /> Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Service"
              : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
