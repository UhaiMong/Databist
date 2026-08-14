"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Newspaper,
  Blocks,
  BriefcaseBusiness,
  CalendarCheck,
  BookUser,
  Contact,
  ChevronDown,
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

// Types for the fetched data
export interface DropdownItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
}

interface PublicNavbarProps {
  services?: DropdownItem[];
  works?: DropdownItem[];
}

export function PublicNavbar({ services = [], works = [] }: PublicNavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to get dropdown data based on the nav label
  const getDropdownItems = (label: string) => {
    if (label === "Services") return services;
    if (label === "Works") return works;
    return [];
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-primary text-slate-200 flex items-center justify-between",
      )}
    >
      <div className="w-full h-16 lg:h-18 lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 pt-2"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md ring-1 ring-white/20 relative bg-white">
              {logo && (
                <Image
                  className="w-full h-full object-cover"
                  src={logo}
                  alt="Databist Logo"
                  priority
                  loading="eager"
                  width={60}
                  height={60}
                />
              )}
            </div>
            <div>
              <h2 className="text-[18px] font-black tracking-wide text-[#FF3131]">
                Data<span className="text-[#A431FF]">bist</span>
              </h2>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 h-full">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              const dropdownItems = getDropdownItems(label);
              const hasDropdown = dropdownItems.length > 0;

              return (
                <div
                  key={href}
                  className="relative group h-full flex items-center"
                >
                  <Link
                    href={href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                      isActive
                        ? "bg-slate-100 text-[#FF3131]"
                        : "hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{label}</span>
                    {hasDropdown && (
                      <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                  </Link>

                  {/* Desktop Dropdown Menu (Grid) */}
                  {hasDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-175 lg:w-225 max-w-[90vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                      <div className="bg-primary backdrop-blur-md shadow-xl ring-1 ring-black/5 rounded-2xl p-6">
                        <div className="mb-4 pb-2 border-b border-slate-100">
                          <h3 className="text-[16px] font-bold text-slate-200 uppercase tracking-wider">
                            Our {label}
                          </h3>
                        </div>
                        {/* 3 cols for MD, 4 cols for LG */}
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                          {dropdownItems.map((item) => (
                            <Link
                              key={item._id || item.id || item.slug}
                              href={`${href}/${item.slug}`}
                              className="group/item flex flex-col"
                            >
                              <span className="text-sm font-medium text-slate-300 group-hover/item:text-[#FF3131] transition-colors line-clamp-2">
                                {item.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Trigger & Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden mr-4">
          <Button
            variant="ghost"
            size="icon"
            className="transition-colors duration-200 bg-linear-to-r from-indigo-500 to-pink-500 text-white"
            aria-label="Open menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-80 overflow-y-auto pt-6 bg-primary text-slate-300 border-l border-slate-200"
        >
          <VisuallyHidden.Root>
            <SheetTitle>Navigate Menu</SheetTitle>
            <SheetDescription>Access site links</SheetDescription>
          </VisuallyHidden.Root>

          {/* Sheet Logo */}
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
              <Image
                className="w-full h-full object-cover"
                src={logo}
                alt="Databist logo"
                priority
                loading="eager"
                width={40}
                height={40}
              />
            </div>
            <h2 className="text-sm font-black tracking-wide text-[#FF3131]">
              Data<span className="text-slate-800">bist</span>
            </h2>
          </div>

          {/* Mobile Nav Links (1 Column List) */}
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const dropdownItems = getDropdownItems(label);
              const hasDropdown = dropdownItems.length > 0;
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <div key={href} className="flex flex-col">
                  <Link
                    href={href}
                    onClick={() => {
                      if (!hasDropdown) setOpen(false);
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 flex justify-between items-center",
                      isActive
                        ? "bg-slate-100 text-[#FF3131]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-70" />
                      <span>{label}</span>
                    </div>
                  </Link>

                  {/* Mobile Dropdown Nested List */}
                  {hasDropdown && (
                    <div className="flex flex-col gap-1 pl-10 pr-4 py-2 mt-1 border-l-2 border-slate-100 ml-6">
                      {dropdownItems.map((item) => (
                        <Link
                          key={item._id || item.id || item.slug}
                          href={`${href}/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm text-slate-500 hover:text-[#FF3131] transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
