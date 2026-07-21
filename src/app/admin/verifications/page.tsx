"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState } from "@/lib/state";
import { MOCK_PENDING_VERIFICATIONS } from "@/data/admin";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

interface PendingVerification {
  id: string;
  name: string;
  studentId: string;
  email: string;
  submittedAt: string;
}

export default function AdminVerificationsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<PendingVerification[]>(MOCK_PENDING_VERIFICATIONS);

  useEffect(() => {
    if (!user || user.role !== "admin") router.push("/login");
  }, [user, router]);

  function handleApprove(verifyId: string) {
    setPending((prev) => prev.filter((v) => v.id !== verifyId));
  }

  function handleReject(verifyId: string) {
    setPending((prev) => prev.filter((v) => v.id !== verifyId));
  }

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Student Verifications</h1>
      {pending.length === 0 ? (
        <EmptyState icon={Users} title="All caught up" description="No pending verification requests." />
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((v) => (
            <div key={v.id} className="card animate-fade-in">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-100">{v.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{v.studentId} · {v.email}</p>
                  <p className="mt-0.5 text-[10px] text-neutral-600 font-medium">Submitted {formatDate(v.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleApprove(v.id)} className="btn-crimson !px-3 !py-1.5 !text-xs">Approve</button>
                  <button onClick={() => handleReject(v.id)} className="btn-outline !px-3 !py-1.5 !text-xs">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
