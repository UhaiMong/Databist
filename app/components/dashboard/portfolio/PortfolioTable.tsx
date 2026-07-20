"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  serviceType: string;
  industry: string;
  status: "draft" | "published";
  order: number;
}

interface PortfolioTableProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioTable({ initialItems }: PortfolioTableProps) {
  const [items, setItems] = useState(initialItems);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this portfolio item? This cannot be undone.")) return;

    setDeletingSlug(slug);
    const res = await fetch(`/api/portfolio/${slug}`, { method: "DELETE" });
    const data = await res.json();
    setDeletingSlug(null);

    if (data.success) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="p-3 font-medium">Order</th>
            <th className="p-3 font-medium">Title</th>
            <th className="p-3 font-medium">Service Type</th>
            <th className="p-3 font-medium">Industry</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-muted-foreground">
                No portfolio items yet.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id} className="border-b last:border-0">
                <td className="p-3">{item.order}</td>
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3">{item.serviceType}</td>
                <td className="p-3">{item.industry}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      item.status === "published" ? "default" : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/dashboard/portfolio/${item.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingSlug === item.slug}
                      onClick={() => handleDelete(item.slug)}
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
