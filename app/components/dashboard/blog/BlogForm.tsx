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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { blogPostSchema, BlogPostValues } from "@/lib/validations/blog";

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: BlogPostValues;
}

export default function BlogForm({ mode, initialData }: BlogFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData ?? {
      status: "draft",
      tags: [],
      author: { name: "" },
    },
  });

  const status = watch("status");

  async function onSubmit(values: BlogPostValues) {
    setError("");

    const url =
      mode === "create" ? "/api/blog" : `/api/blog/${initialData?.slug}`;
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

    router.push("/dashboard/blog");
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
              <Input
                id="slug"
                {...register("slug")}
                placeholder="my-article-title"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input id="featuredImage" {...register("featuredImage")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author.name">Author Name</Label>
              <Input id="author.name" {...register("author.name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author.role">Author Role</Label>
              <Input id="author.role" {...register("author.role")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body (HTML)</Label>
            <Textarea id="body" rows={12} {...register("body")} />
            <p className="text-xs text-muted-foreground">
              Rich text editor to be wired in — plain HTML textarea for now.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setValue("status", v as any)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Post"
              : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
