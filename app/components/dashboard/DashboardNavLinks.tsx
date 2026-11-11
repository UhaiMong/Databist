"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDashboardNav } from "@/lib/dashboard/nav";

type DashboardNavLinksProps = {
  role: "admin" | "staff";
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function DashboardNavLinks({
  role,
  collapsed = false,
  onNavigate,
}: DashboardNavLinksProps) {
  const pathname = usePathname();
  const items = getDashboardNav(role);

  return (
    <nav className="space-y-1 p-4">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center",
              isActive
                ? "bg-brand text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? item.label : <span className="sr-only">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
