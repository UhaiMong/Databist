"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </GoogleReCaptchaProvider>
  );
}
