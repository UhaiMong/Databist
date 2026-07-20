"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Newspaper,
  Images,
  HelpCircle,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/dashboard/services", icon: Package },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Blog", href: "/dashboard/blog", icon: Newspaper },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Images },
  { label: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  role: "admin" | "staff";
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="font-semibold">
          Digital Resolution
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {NAV_ITEMS.filter(
          (item) => item.label !== "Settings" || role === "admin",
        ).map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
