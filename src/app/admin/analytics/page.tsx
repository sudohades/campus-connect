"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  Wrench,
  CreditCard,
  ShoppingBag,
  DollarSign,
  FlagTriangleRight,
  Clock,
} from "lucide-react";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState } from "@/lib/state";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => { if (!user || user.role !== "admin") router.push("/login"); }, [user, router]);
  if (!user || user.role !== "admin") return null;

  const totalUsers = currentState.users.length;
  const totalListings = currentState.listings.length;
  const activeListings = currentState.listings.filter((l) => l.status === "active").length;
  const totalServices = currentState.services.length;
  const totalTransactions = currentState.transactions.length;
  const completedTransactions = currentState.transactions.filter((t) => t.status === "completed");
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalOrders = currentState.orders.length;
  const pendingReports = currentState.adminReports.filter((r) => r.status === "open" || r.status === "reviewing").length;
  const openDisputes = currentState.disputes.filter((d) => d.status !== "resolved").length;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Analytics</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} tone="accent" />
        <StatCard label="Listings" value={totalListings} trend={`${activeListings} active`} icon={Package} tone="gold" />
        <StatCard label="Services" value={totalServices} icon={Wrench} tone="gold" />
        <StatCard label="Transactions" value={totalTransactions} icon={CreditCard} />
        <StatCard label="Orders" value={totalOrders} icon={ShoppingBag} />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} tone="accent" />
        <StatCard label="Pending Reports" value={pendingReports} icon={FlagTriangleRight} tone="gold" />
        <StatCard label="Open Disputes" value={openDisputes} icon={Clock} />
      </div>
    </DashboardShell>
  );
}
