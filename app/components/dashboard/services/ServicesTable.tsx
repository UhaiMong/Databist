"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  slug: string;
  priceLabel: string;
  status: "draft" | "published";
  isCombo?: boolean;
  order: number;
}

interface ServicesTableProps {
  initialServices: Service[];
}

export default function ServicesTable({ initialServices }: ServicesTableProps) {
  const [services, setServices] = useState(initialServices);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this service package? This cannot be undone.")) return;

    setDeletingSlug(slug);
    const res = await fetch(`/api/services/${slug}`, { method: "DELETE" });
    const data = await res.json();
    setDeletingSlug(null);

    if (data.success) {
      setServices((prev) => prev.filter((s) => s.slug !== slug));
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="p-3 font-medium">Order</th>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Price</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No service packages yet.
              </td>
            </tr>
          ) : (
            services.map((service) => (
              <tr key={service._id} className="border-b last:border-0">
                <td className="p-3">{service.order}</td>
                <td className="p-3 font-medium">
                  {service.name}
                  {service.isCombo && (
                    <Badge variant="secondary" className="ml-2">
                      Combo
                    </Badge>
                  )}
                </td>
                <td className="p-3">{service.priceLabel}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      service.status === "published" ? "default" : "outline"
                    }
                  >
                    {service.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/dashboard/services/${service.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingSlug === service.slug}
                      onClick={() => handleDelete(service.slug)}
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
