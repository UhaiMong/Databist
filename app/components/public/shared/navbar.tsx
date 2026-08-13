"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  PhoneCall,
  Home,
  BookOpen,
  Pen,
  Book,
  PersonStanding,
  Newspaper,
  Blocks,
  BriefcaseBusiness,
  CalendarCheck,
  BookUser,
  Contact,
} from "lucide-react";
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
const logo = "/logo.svg";
const NAV_LINKS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Services", icon: Blocks, href: "/services" },
  { label: "Works", icon: BriefcaseBusiness, href: "/portfolio" },
  { label: "Blog", icon: Newspaper, href: "/blog" },
  { label: "Consultant", icon: CalendarCheck, href: "/booking" },
  { label: "About Us", icon: BookUser, href: "/about" },
  { label: "Contact", icon: Contact, href: "/contact" },
] as const;

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-transparent flex items-center justify-between",
      )}
    >
      <div className="w-full h-16 lg:h-18 lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 pt-2"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md ring-1 ring-white/20">
              {logo && (
                <Image
                  className="w-full h-full object-cover"
                  src={logo}
                  alt="Logo"
                  priority
                  loading="eager"
                  width={60}
                  height={60}
                />
              )}
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-[#FF3131]">
                Data<span className="text-secondary">bist</span>
              </h2>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all bg-page-bg text-ink duration-300 flex items-center gap-2",
                    isActive
                      ? "hidden transition-all ease-in duration-300"
                      : "",
                  )}
                >
                  <Icon className="w-4 h-4 text-ink/60" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          {/* <div className="flex gap-x-3.5 items-center">
            <div className="shrink-0">
              <Button
                asChild
                variant="link"
                size="sm"
                className={cn("text-md font-bold", "bg-brand text-slate-50")}
              >
                <Link href="/contact">Hire Us</Link>
              </Button>
            </div>
          </div> */}
        </div>
      </div>
      {/* Mobile Menu Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors duration-200",
              "bg-linear-to-r from-indigo-500 to-pink-500",
            )}
            aria-label="Open menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-72 overflow-y-auto pt-6 bg-page-bg text-ink"
        >
          <VisuallyHidden.Root>
            <SheetTitle>Navigate Menu</SheetTitle>
            <SheetDescription>Access admin dashboard links</SheetDescription>
          </VisuallyHidden.Root>
          {/* Sheet Logo */}
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
              <Image
                className="w-full h-full object-cover"
                src={`${logo}`}
                alt="Databist logo"
                priority
                loading="eager"
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* Sheet Nav Links */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 flex justify-start items-center gap-2.5",
                  pathname === href
                    ? "bg-linear-to-r from-indigo-500 to-pink-500"
                    : "text-slate-300 hover:bg-slate-50 hover:text-slate-800",
                )}
              >
                <Icon className="w-4 h-4 text-ink/60" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Sheet CTAs */}
          {/* <div className="mt-8 flex flex-col gap-2 px-2">
            <Button
              asChild
              variant="default"
              className="w-full bg-brand text-white text-lg font-semibold hover:bg-linear-to-r from-brand to-blue-800 duration-300 transition-colors ease-in"
            >
              <Link href="/contact" onClick={() => setOpen(false)}>
                Hire Us
              </Link>
            </Button>
          </div> */}
        </SheetContent>
      </Sheet>
    </header>
  );
}
