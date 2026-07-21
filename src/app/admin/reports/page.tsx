"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlagTriangleRight } from "lucide-react";
import type { AdminReport } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState, setCurrentState } from "@/lib/state";
import { findUserById } from "@/data/users";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function AdminReportsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<AdminReport[]>([]);

  useEffect(() => { if (!user || user.role !== "admin") router.push("/login"); }, [user, router]);
  function refresh() { setReports([...currentState.adminReports]); }
  useEffect(() => { refresh(); }, []);

  function updateStatus(reportId: string, status: AdminReport["status"]) {
    const updated = currentState.adminReports.map((r) => r.id === reportId ? { ...r, status } : r);
    setCurrentState({ ...currentState, adminReports: updated });
    refresh();
  }

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Reports</h1>
      {reports.length === 0 ? (
        <EmptyState icon={FlagTriangleRight} title="No reports" description="All clear — no reports to review." />
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => {
            const reporter = findUserById(report.reporterId);
            return (
              <div key={report.id} className="card animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={report.status} />
                      <span className="text-xs text-neutral-500 capitalize">{report.targetType}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-100">{report.reason}</p>
                    <p className="mt-1 text-xs text-neutral-500">Reported by {reporter?.name ?? "Unknown"} · Target: {report.targetId}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600 font-medium">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {report.status === "open" && (
                    <>
                      <button onClick={() => updateStatus(report.id, "reviewing")} className="btn-outline !px-3 !py-1.5 !text-xs">Review</button>
                      <button onClick={() => updateStatus(report.id, "dismissed")} className="btn-outline !px-3 !py-1.5 !text-xs">Dismiss</button>
                    </>
                  )}
                  {report.status === "reviewing" && (
                    <>
                      <button onClick={() => updateStatus(report.id, "resolved")} className="btn-crimson !px-3 !py-1.5 !text-xs">Resolve</button>
                      <button onClick={() => updateStatus(report.id, "dismissed")} className="btn-outline !px-3 !py-1.5 !text-xs">Dismiss</button>
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
