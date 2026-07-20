"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published" | "scheduled";
  publishedAt?: string;
}

interface BlogTableProps {
  initialPosts: Post[];
}

const STATUS_VARIANT: Record<
  Post["status"],
  "default" | "secondary" | "outline"
> = {
  published: "default",
  draft: "outline",
  scheduled: "secondary",
};

export default function BlogTable({ initialPosts }: BlogTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;

    setDeletingSlug(slug);
    const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    const data = await res.json();
    setDeletingSlug(null);

    if (data.success) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="p-3 font-medium">Title</th>
            <th className="p-3 font-medium">Category</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Published</th>
            <th className="p-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No blog posts yet.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="border-b last:border-0">
                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3">{post.category}</td>
                <td className="p-3">
                  <Badge
                    variant={STATUS_VARIANT[post.status]}
                    className="capitalize"
                  >
                    {post.status}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/dashboard/blog/${post.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingSlug === post.slug}
                      onClick={() => handleDelete(post.slug)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
