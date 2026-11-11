"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardNavLinks from "./DashboardNavLinks";

interface DashboardSidebarProps {
  role: "admin" | "staff";
}

const logo = "/logo.svg";

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
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
          <Link href="/dashboard">
            <Image
              className="object-cover"
              src={logo}
              alt="Databist logo"
              width={40}
              height={40}
            />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-6 w-6 items-center justify-center bg-brand text-slate-200 transition-colors hover:scale-105"
        >
          <ChevronsLeftRight className="h-4 w-4" />
        </button>
      </div>
      <DashboardNavLinks role={role} collapsed={collapsed} />
    </aside>
  );
}
