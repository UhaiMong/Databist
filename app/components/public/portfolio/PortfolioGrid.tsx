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
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {serviceTypes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No projects match these filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const CardInner = (
              <div className="group overflow-hidden rounded-lg border">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.serviceType}</Badge>
                    <Badge variant="outline">{item.industry}</Badge>
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
