"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronsLeftRight,
  TimerIcon,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/dashboard/services", icon: Package },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  {
    label: "Avalability",
    href: "/dashboard/availability",
    icon: TimerIcon,
  },
  { label: "Blog", href: "/dashboard/blog", icon: Newspaper },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Images },
  { label: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  role: "admin" | "staff";
}

const logo = "/logo.png";

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r bg-background md:block transition-all ease-in-out duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex items-center py-2.5 px-2",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="">
            <Image
              className="object-cover"
              src={logo}
              alt="company logo"
              width={40}
              height={40}
            />
          </Link>
        )}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 flex items-center justify-center text-slate-200 hover:scale-105 transition-colors bg-brand"
        >
          <ChevronsLeftRight className="w-4 h-4" />
        </button>
      </div>
      <nav className="space-y-1 p-4">
        {NAV_ITEMS.filter(
          (item) => item.label !== "Settings" || role === "admin",
        ).map((item) => {
          const isActive =
            pathname === item?.href ||
            (item?.href !== "/dashboard" && pathname.startsWith(item?.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center",
                isActive
                  ? "bg-brand text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? item?.label : ""}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
