"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingBag, Star, Wrench, Calendar, Users, FlagTriangleRight } from "lucide-react";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/shared/stat-card";
import { currentState } from "@/lib/state";
import { RoleBadge } from "@/components/shared/role-badge";

export default function DashboardPage() {
  const { user } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push("/login");
  }, [user, router]);

  if (!mounted || !user) return null;

  return (
    <DashboardShell role={user.role}>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="page-title">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 subtitle">Here&apos;s what&apos;s happening on your account.</p>
        </div>
        <RoleBadge role={user.role} />
      </div>

      {user.role === "buyer" && <BuyerOverview userId={user.id} />}
      {user.role === "seller" && <SellerOverview userId={user.id} />}
      {user.role === "service_provider" && <ProviderOverview userId={user.id} />}
      {user.role === "admin" && <AdminOverview />}
    </DashboardShell>
  );
}

function BuyerOverview({ userId }: { userId: string }) {
  const orders = currentState.orders.filter((o) => o.buyerId === userId);
  const reviews = currentState.reviews.filter((r) => r.authorId === userId);
  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Total orders" value={orders.length} icon={ShoppingBag} tone="accent" />
      <StatCard label="In progress" value={active.length} icon={Package} tone="gold" />
      <StatCard label="Reviews left" value={reviews.length} icon={Star} tone="gold" />
    </div>
  );
}

function SellerOverview({ userId }: { userId: string }) {
  const listings = currentState.listings.filter((l) => l.sellerId === userId);
  const active = listings.filter((l) => l.status === "active");
  const orders = currentState.orders.filter((o) => o.sellerId === userId);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Active listings" value={active.length} icon={Package} tone="accent" />
      <StatCard label="Total listings" value={listings.length} icon={Package} tone="gold" />
      <StatCard label="Orders received" value={orders.length} icon={ShoppingBag} />
    </div>
  );
}

function ProviderOverview({ userId }: { userId: string }) {
  const services = currentState.services.filter((s) => s.providerId === userId);
  const bookings = currentState.transactions.filter(
    (t) => t.sellerId === userId && t.serviceId,
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Active services" value={services.filter((s) => s.status === "active").length} icon={Wrench} tone="accent" />
      <StatCard label="Total bookings" value={bookings.length} icon={Calendar} tone="gold" />
      <StatCard label="Total services" value={services.length} icon={Wrench} />
    </div>
  );
}

function AdminOverview() {
  const pendingReports = currentState.adminReports.filter((r) => r.status === "open");
  const disputes = currentState.disputes.filter((d) => d.status !== "resolved");

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Registered users" value={currentState.users.length} icon={Users} tone="accent" />
      <StatCard label="Open reports" value={pendingReports.length} icon={FlagTriangleRight} tone="gold" />
      <StatCard label="Active disputes" value={disputes.length} icon={FlagTriangleRight} />
    </div>
  );
}
