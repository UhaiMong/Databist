"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import DashboardNavLinks from "./DashboardNavLinks";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: "admin" | "staff";
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,18rem)] p-0">
            <SheetHeader className="border-b px-4 py-3 text-left">
              <SheetTitle className="flex items-center gap-2">
                <Image src="/logo.svg" alt="" width={28} height={28} />
                Databist
              </SheetTitle>
            </SheetHeader>
            <DashboardNavLinks role={user.role} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
          <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/" target="_blank" rel="noreferrer">
            View site
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </header>
  );
}
