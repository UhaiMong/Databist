import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <div className="mt-12 text-center">
      <Button
        className="brand-gradient text-white"
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
