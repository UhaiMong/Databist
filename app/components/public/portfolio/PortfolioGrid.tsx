"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../..//ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../..//ui/select";

interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  serviceType: string;
  industry: string;
  summary: string;
  externalLink?: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [serviceType, setServiceType] = useState("all");
  const [industry, setIndustry] = useState("all");

  const serviceTypes = useMemo(
    () => Array.from(new Set(items.map((i) => i.serviceType))),
    [items],
  );
  const industries = useMemo(
    () => Array.from(new Set(items.map((i) => i.industry))),
    [items],
  );

  const filtered = items.filter(
    (i) =>
      (serviceType === "all" || i.serviceType === serviceType) &&
      (industry === "all" || i.industry === industry),
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-48 rounded border border-gray-300 bg-page-bg text-ink px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-1 focus:ring-brand"
        >
          <option value="all">All Services</option>
          {serviceTypes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Industry Select */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-48 rounded border bg-page-bg border-gray-300 px-3 text-ink py-2 text-sm shadow-sm focus:border-brand focus:ring-1 focus:ring-brand"
        >
          <option value="all">All Industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No projects match these filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const CardInner = (
              <div className="group overflow-hidden rounded-lg border aspect-square">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="eager"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge className="" variant="secondary">
                      {item.serviceType}
                    </Badge>
                    <Badge className="text-ink" variant="outline">
                      {item.industry}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              </div>
            );

            return item.externalLink ? (
              <a
                key={item._id}
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CardInner}
              </a>
            ) : (
              <Link key={item._id} href={`/portfolio/${item.slug}`}>
                {CardInner}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
