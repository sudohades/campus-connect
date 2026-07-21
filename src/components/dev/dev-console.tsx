"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  RotateCcw,
  LogOut,
  Activity,
  Home,
  Package,
  Wrench,
  MessageSquare,
  Bell,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { MOCK_USERS } from "@/data/users";
import { currentState, resetAll, resetSlice } from "@/lib/state";
import { useSession } from "@/lib/session-context";
import { RoleBadge, VerificationBadge } from "@/components/shared/role-badge";
import { cn } from "@/lib/utils";

const RESETTABLE_SLICES = [
  { key: "listings" as const, label: "Reset Listings" },
  { key: "chats" as const, label: "Reset Messages" },
  { key: "notifications" as const, label: "Reset Notifications" },
  { key: "reviews" as const, label: "Reset Reviews" },
  { key: "transactions" as const, label: "Reset Transactions" },
];

const QUICK_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Package },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chats", label: "Chats", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function DevConsole() {
  const { user, switchUser, logout, refresh } = useSession();
  const [showPasswords, setShowPasswords] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const stats = {
    Users: currentState.users.length,
    Listings: currentState.listings.filter((l) => l.status === "active").length,
    Services: currentState.services.filter((s) => s.status === "active").length,
    Orders: currentState.orders.length,
    Chats: currentState.chats.length,
    Notifications: currentState.notifications.length,
    Reports: currentState.adminReports.length,
    Disputes: currentState.disputes.length,
  };

  function note(action: string) {
    setLastAction(action);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-light">
            Presenter Only
          </p>
          <h1 className="mt-1 page-title">Developer Console</h1>
        </div>
        <span className="rounded-full bg-gradient-to-r from-crimson to-crimson-hover px-3 py-1 text-[11px] font-medium text-white shadow-soft">
          Demo Mode
        </span>
      </div>

      {/* Current session */}
      <section className="mb-5 glass rounded-2xl p-5 shadow-medium">
        <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Current Session</h2>
        {user ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-crimson to-crimson-hover text-sm font-medium text-white shadow-soft">
                {user.name.split(" ").map((p) => p[0]).join("")}
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-100">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={user.role} />
              <VerificationBadge status={user.verified} />
              <button
                type="button"
                onClick={() => {
                  logout();
                  note("Session ended");
                }}
                className="btn-ghost !text-xs"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No active session.</p>
        )}
      </section>

      {/* Quick navigation */}
      <section className="mb-5 card rounded-2xl p-5">
        <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Quick Navigation</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-outline !px-3 !py-1.5 !text-xs !rounded-xl"
            >
              <link.icon className="h-3 w-3" />
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/analytics"
            className="btn-outline !px-3 !py-1.5 !text-xs !rounded-xl !border-crimson/30 !text-crimson-light hover:!bg-crimson/5"
          >
            <Shield className="h-3 w-3" />
            Admin
          </Link>
        </div>
      </section>

      {/* Switch user */}
      <section className="mb-5 card rounded-2xl p-5">
        <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Switch User</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MOCK_USERS.map((demoUser) => (
            <button
              key={demoUser.id}
              type="button"
              onClick={async () => {
                await switchUser(demoUser.id);
                note(`Switched to ${demoUser.name}`);
              }}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-150",
                user?.id === demoUser.id
                  ? "border-crimson/30 bg-crimson/10 shadow-sm"
                  : "border-neutral-700 hover:bg-surface-elevated hover:border-neutral-600",
              )}
            >
              <span className="text-neutral-100 font-medium">{demoUser.name}</span>
              <RoleBadge role={demoUser.role} />
            </button>
          ))}
        </div>
      </section>

      {/* Demo accounts / passwords */}
      <section className="mb-5 card rounded-2xl p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-100">Demo Accounts</h2>
          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="btn-ghost !text-xs !px-2 !py-1"
          >
            {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPasswords ? "Hide" : "Show"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-overlay text-neutral-500">
              <tr>
                <th className="whitespace-nowrap px-3 py-2 font-medium">Name</th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">Email</th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">Password</th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">Role</th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((demoUser) => (
                <tr key={demoUser.id} className="border-t border-neutral-800 transition-colors hover:bg-surface-elevated">
                  <td className="whitespace-nowrap px-3 py-2.5 text-neutral-100 font-medium">{demoUser.name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-neutral-500">{demoUser.email}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-neutral-500">
                    {showPasswords ? demoUser.password : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <RoleBadge role={demoUser.role} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <VerificationBadge status={demoUser.verified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reset controls */}
      <section className="mb-5 card rounded-2xl p-5">
        <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Reset State</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              resetAll();
              note("Full application state reset");
            }}
            className="btn-crimson !px-3 !py-1.5 !text-xs !rounded-xl"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Entire Application
          </button>
          {RESETTABLE_SLICES.map((slice) => (
            <button
              key={slice.key}
              type="button"
              onClick={() => {
                resetSlice(slice.key);
                note(slice.label);
              }}
              className="btn-outline !px-3 !py-1.5 !text-xs !rounded-xl"
            >
              <RotateCcw className="h-3 w-3" />
              {slice.label}
            </button>
          ))}
        </div>
        {lastAction && (
          <p className="mt-3 text-xs text-emerald-400 font-medium animate-fade-in">Last action: {lastAction}</p>
        )}
      </section>

      {/* Diagnostics */}
      <section className="glass rounded-2xl p-5 shadow-medium">
        <h2 className="mb-3.5 flex items-center gap-2 text-sm font-semibold text-neutral-100">
          <Activity className="h-4 w-4 text-gold-light" />
          Application Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-surface-elevated border border-neutral-800 px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{key}</p>
              <p className="text-xl font-bold text-neutral-50 tracking-tight mt-1">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
