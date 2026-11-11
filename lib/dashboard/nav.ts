import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Newspaper,
  Images,
  FolderOpen,
  HelpCircle,
  MessageSquareQuote,
  Settings,
  TimerIcon,
  Mail,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/dashboard/services", icon: Package },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Availability", href: "/dashboard/availability", icon: TimerIcon },
  { label: "Blog", href: "/dashboard/blog", icon: Newspaper },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Images },
  { label: "Media", href: "/dashboard/media", icon: FolderOpen },
  { label: "Contact", href: "/dashboard/contact", icon: PhoneCall },
  { label: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, adminOnly: true },
];

export function getDashboardNav(role: "admin" | "staff") {
  return DASHBOARD_NAV.filter((item) => !item.adminOnly || role === "admin");
}
