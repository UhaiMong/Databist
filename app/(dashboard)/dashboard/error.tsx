"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-semibold">Dashboard error</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Could not load this section. Try again or refresh the page.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
