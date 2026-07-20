"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { VisuallyHidden } from "radix-ui";
const logo = "/logo.png";
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Consultant", href: "/booking" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "/95 bg-brand backdrop-blur-md shadow-2xl",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md ring-1 ring-white/20">
              {logo ? (
                <Image
                  className="w-full h-full object-cover"
                  src={logo}
                  alt="Logo"
                  width={40}
                  height={40}
                />
              ) : (
                <div>
                  <h2>Digital Resolution</h2>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all text-white duration-300",
                    isActive ? "bg-brand-dark" : "",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-xl gap-1 text-sm font-semibold transition-all duration-200",
                "bg-[#2e318f] hover:bg-[#1e2066] text-white",
              )}
            >
              <Link href="tel:+880 1840-930768">
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> +880
                1840-930768
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("text-sm font-medium", "bg-white text-brand")}
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-200",
                  "text-brand bg-white",
                )}
                aria-label="Open menu"
              >
                {open ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 pt-6">
              <VisuallyHidden.Root>
                <SheetTitle>Navigate Menu</SheetTitle>
                <SheetDescription>
                  Access admin dashboard links
                </SheetDescription>
              </VisuallyHidden.Root>
              {/* Sheet Logo */}
              <div className="flex items-center gap-2.5 mb-8 px-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
                  <Image
                    className="w-full h-full object-cover"
                    src="/logo.jpeg"
                    alt="Success Academy logo"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="leading-tight transition ease-in duration-300 text-[#2e318f]">
                  <span className="block text-sm font-bold text-[#2e318f]">
                    Success
                  </span>
                  <span className="block text-[9px] tracking-widest uppercase">
                    Academic
                  </span>
                </div>
              </div>

              {/* Sheet Nav Links */}
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-[#eef0ff] text-[#2e318f]"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Sheet CTAs */}
              <div className="mt-8 flex flex-col gap-2 px-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#2e318f] text-[#2e318f] hover:bg-[#eef0ff]"
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "rounded-xl gap-1 text-sm font-semibold transition-all duration-200",
                    "bg-[#2e318f] hover:bg-[#1e2066] text-white",
                  )}
                >
                  <Link href="tel:+880 1840-930768">
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> +880
                    1840-930768
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
