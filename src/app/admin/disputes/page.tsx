"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import type { Dispute } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState, setCurrentState } from "@/lib/state";
import { findUserById } from "@/data/users";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function AdminDisputesPage() {
  const { user } = useSession();
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => { if (!user || user.role !== "admin") router.push("/login"); }, [user, router]);
  function refresh() { setDisputes([...currentState.disputes]); }
  useEffect(() => { refresh(); }, []);

  function updateStatus(disputeId: string, status: Dispute["status"], resolution?: string) {
    const updated = currentState.disputes.map((d) => d.id === disputeId ? { ...d, status, resolution: resolution ?? d.resolution } : d);
    setCurrentState({ ...currentState, disputes: updated });
    refresh();
  }

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Disputes</h1>
      {disputes.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="No disputes" description="No active disputes to review." />
      ) : (
        <div className="flex flex-col gap-3">
          {disputes.map((dispute) => {
            const raiser = findUserById(dispute.raisedById);
            const against = findUserById(dispute.againstId);
            return (
              <div key={dispute.id} className="card animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={dispute.status} />
                      <span className="text-xs text-neutral-500">Transaction: {dispute.transactionId}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-100">{dispute.reason}</p>
                    <p className="mt-1 text-xs text-neutral-500">Raised by {raiser?.name ?? "Unknown"} against {against?.name ?? "Unknown"}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600 font-medium">{formatDate(dispute.createdAt)}</p>
                    {dispute.resolution && <p className="mt-2 text-xs text-emerald-400 font-medium">Resolution: {dispute.resolution}</p>}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {dispute.status === "open" && (
                    <button onClick={() => updateStatus(dispute.id, "investigating")} className="btn-outline !px-3 !py-1.5 !text-xs">Investigate</button>
                  )}
                  {dispute.status === "investigating" && (
                    <>
                      <button onClick={() => updateStatus(dispute.id, "resolved", "Refund issued to buyer.")} className="btn-crimson !px-3 !py-1.5 !text-xs">Resolve (Refund)</button>
                      <button onClick={() => updateStatus(dispute.id, "resolved", "No action required.")} className="btn-outline !px-3 !py-1.5 !text-xs">Dismiss</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
