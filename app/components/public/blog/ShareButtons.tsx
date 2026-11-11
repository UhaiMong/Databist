"use client";

import { Link2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  FacebookIcon,
  LinkedInIcon,
  XIcon,
} from "@/app/components/icons/BrandIcons";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  function share(platform: "facebook" | "twitter" | "linkedin") {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(links[platform], "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="mt-8 flex items-center gap-2 border-t pt-6">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button variant="outline" size="icon" onClick={() => share("facebook")}>
        <FacebookIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("twitter")}>
        <XIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => share("linkedin")}>
        <LinkedInIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink}>
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
