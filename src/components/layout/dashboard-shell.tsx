"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Calendar,
  ShoppingBag,
  Star,
  Users,
  FlagTriangleRight,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  buyer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
  ],
  seller: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/listings", label: "My Listings", icon: Package },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  ],
  service_provider: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/services", label: "My Services", icon: Wrench },
    { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/verifications", label: "Approve Students", icon: Users },
    { href: "/admin/listings", label: "Approve Listings", icon: Package },
    { href: "/admin/reports", label: "Reports", icon: FlagTriangleRight },
    { href: "/admin/disputes", label: "Disputes", icon: ShieldAlert },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 overflow-x-auto md:mb-0 -mx-1 px-1">
        <nav className="flex gap-1 md:hidden">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-crimson/12 text-crimson-light shadow-sm"
                    : "text-neutral-500 hover:bg-surface-elevated hover:text-neutral-300",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-20">
            <nav className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                      active
                        ? "bg-crimson/10 font-medium text-crimson-light"
                        : "text-neutral-500 hover:bg-surface-elevated hover:text-neutral-300",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-crimson" />
                    )}
                    <Icon className={cn("h-4 w-4 transition-colors", active ? "text-crimson-light" : "text-neutral-600 group-hover:text-neutral-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1 animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
