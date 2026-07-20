"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: "admin" | "staff";
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <p className="text-sm font-medium">{user.name ?? user.email}</p>
        <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </header>
  );
}
