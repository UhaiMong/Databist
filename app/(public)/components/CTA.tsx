import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <div className="mt-12 text-center">
      <Button
        className="bg-linear-to-r from-indigo-500 to-pink-500"
        asChild
        size="lg"
      >
        <Link href="/booking">
          Not sure which package fits? Book a Consultation{" "}
          <ArrowRight size={14} />
        </Link>
      </Button>
    </div>
  );
}
