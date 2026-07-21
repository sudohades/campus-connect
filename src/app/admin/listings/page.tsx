"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import type { Listing } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState, setCurrentState } from "@/lib/state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminListingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") router.push("/login");
  }, [user, router]);

  function refresh() { setListings([...currentState.listings]); }
  useEffect(() => { refresh(); }, []);

  function approveListing(id: string) {
    const updated = currentState.listings.map((l) => l.id === id ? { ...l, status: "active" as const } : l);
    setCurrentState({ ...currentState, listings: updated });
    refresh();
  }

  function removeListing(id: string) {
    const updated = currentState.listings.map((l) => l.id === id ? { ...l, status: "removed" as const } : l);
    setCurrentState({ ...currentState, listings: updated });
    refresh();
  }

  if (!user || user.role !== "admin") return null;

  const pending = listings.filter((l) => l.status === "pending");
  const all = listings;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Manage Listings</h1>
      {pending.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold text-neutral-300">Pending Approval ({pending.length})</h2>
          <div className="mb-6 flex flex-col gap-3">
            {pending.map((l) => (
              <div key={l.id} className="card animate-fade-in">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-100">{l.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatCurrency(l.price)} · {l.category} · {l.condition}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600 font-medium">Listed {formatDate(l.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => approveListing(l.id)} className="btn-crimson !px-3 !py-1.5 !text-xs">Approve</button>
                    <button onClick={() => removeListing(l.id)} className="btn-outline !px-3 !py-1.5 !text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <h2 className="mb-3 text-sm font-semibold text-neutral-300">All Listings ({all.length})</h2>
      {all.length === 0 ? (
        <EmptyState icon={Package} title="No listings" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-surface-raised shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-overlay text-xs text-neutral-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Title</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Price</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Category</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {all.map((l) => (
                <tr key={l.id} className="border-t border-neutral-800 transition-colors hover:bg-surface-elevated">
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-100 font-medium">{l.title}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-crimson-light font-semibold">{formatCurrency(l.price)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500 capitalize">{l.category}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {l.status !== "removed" && (
                      <button onClick={() => removeListing(l.id)} className="text-xs font-medium text-crimson-light hover:text-crimson transition-colors">Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
